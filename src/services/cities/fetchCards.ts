import {
  collection,
  doc,
  DocumentData,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  Query,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  startAfter,
  where,
} from 'firebase/firestore';
import { db } from '@shared/config/firebase';
import { COLLECTION } from '@shared/constants/constants';
import { City } from '@shared/types/city';
import { FirebaseError } from 'firebase/app';
import { FetchModeType } from '@shared/types/fetchMode';
import { Option } from '@shared/types/options';
import { capitalizeFirst } from '@shared/utils/utils';

interface FetchCardsOptions {
  mode?: FetchModeType;
  perPage?: number;
  searchQuery?: string;
  filters?: string[];
  lastDoc?: QueryDocumentSnapshot<DocumentData, DocumentData> | null;
  relatedCards?: number;
  currentCardId?: string;
}

interface FetchCardsPaginatedResult {
  data: City[];
  total: number;
  lastRequest: 'search' | 'filter';
  lastDoc: QueryDocumentSnapshot | null;
}

export const fetchCards = async ({
  mode = 'all',
  perPage = 3,
  searchQuery = '',
  filters = [],
  lastDoc = null,
  relatedCards,
  currentCardId,
}: FetchCardsOptions): Promise<City[] | City | FetchCardsPaginatedResult | Option[] | string> => {
  try {
    const collectionRef = collection(db, COLLECTION);

    const fetchingCards = (snapshot: QuerySnapshot<DocumentData, DocumentData>) => {
      const cards: City[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as City[];

      return cards;
    };

    if (mode === 'all') {
      const snapshot = await getDocs(collectionRef);
      return fetchingCards(snapshot);
    }

    if (mode === 'paginate') {
      let q;
      const conditions = [];
      let countQuery: Query<DocumentData> = collectionRef;

      if (searchQuery) {
        const capitalizedSearchQuery = capitalizeFirst(searchQuery);

        conditions.push(
          where('name', '>=', capitalizedSearchQuery),
          where('name', '<', capitalizedSearchQuery + '\uf8ff')
        );
        countQuery = query(
          countQuery,
          where('name', '>=', capitalizedSearchQuery),
          where('name', '<', capitalizedSearchQuery + '\uf8ff')
        );
      }

      if (filters.length > 0) {
        conditions.push(where('country', 'in', filters));
        countQuery = query(countQuery, where('country', 'in', filters));
      }

      const orderField = filters.length > 0 ? 'country' : 'name';

      q = query(collectionRef, ...conditions, orderBy(orderField), limit(perPage));

      if (lastDoc) {
        q = query(collectionRef, ...conditions, orderBy(orderField), startAfter(lastDoc), limit(perPage));
      }

      const [snapshot, countSnapshot] = await Promise.all([getDocs(q), getCountFromServer(countQuery)]);

      const total = countSnapshot.data().count ?? 0;

      const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1] ?? null;

      return {
        data: fetchingCards(snapshot),
        lastRequest: searchQuery ? 'search' : 'filter',
        total,
        lastDoc: lastVisibleDoc,
      };
    }

    if (mode === 'options') {
      const snapshot = await getDocs(query(collectionRef, orderBy('name')));
      const options: Option[] = snapshot.docs.map((doc) => ({
        key: doc.id,
        value: doc.data().country,
      }));
      return options;
    }

    if (mode === 'related' && relatedCards) {
      const countSnapshot = await getCountFromServer(collectionRef);
      const collectionLength = countSnapshot.data().count ?? 0;
      const indexes = new Set<number>();
      while (indexes.size < relatedCards + (currentCardId ? 1 : 0))
        indexes.add(Math.floor(Math.random() * collectionLength));

      const snapshot = await getDocs(query(collectionRef, where('index', 'in', Array.from(indexes))));

      const cards = fetchingCards(snapshot);

      const filtered = currentCardId ? cards.filter((card) => card.id !== currentCardId).slice(0, relatedCards) : cards;
      return filtered.sort(() => 0.5 - Math.random());
    }

    if (mode === 'single' && currentCardId) {
      const snapshot = await getDoc(doc(collectionRef, currentCardId));

      if (!snapshot.exists()) return 'City not found';

      return {
        id: snapshot.id,
        ...snapshot.data(),
      } as City;
    }

    return 'Unsupported fetch mode.';
  } catch (e) {
    if (e instanceof FirebaseError) {
      const errorMessages: Record<string, string> = {
        'permission-denied': 'You do not have permission to view cities.',
        'unavailable': 'Firestore is temporarily unavailable. Please try again later.',
        'deadline-exceeded': 'Request timed out. Please try again.',
        'resource-exhausted': 'Quota exceeded. Please try again later.',
        'unauthenticated': 'You must be logged in to perform this action.',
      };
      return errorMessages[e.code] ?? 'Failed to fetch cards. Please try again later.';
    }
    return 'Unexpected error. Please try again.';
  }
};
