import {
  collection,
  DocumentData,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
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

interface FetchCardsOptions {
  mode?: FetchModeType;
  perPage?: number;
  searchQuery?: string;
  filters?: string[];
  lastDoc?: QueryDocumentSnapshot<DocumentData, DocumentData> | null;
}

interface FetchCardsPaginatedResult {
  data: City[];
  total: number;
  lastRequest: 'search' | 'filter';
  lastDoc: QueryDocumentSnapshot;
}

export const fetchCards = async ({
  mode = 'all',
  perPage = 3,
  searchQuery = '',
  filters = [],
  lastDoc = null,
}: FetchCardsOptions): Promise<City[] | FetchCardsPaginatedResult | Option[] | string> => {
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
      let q = query(collectionRef, orderBy('name'));

      if (searchQuery && filters.length) {
        q = query(
          q,
          where('name', '>=', searchQuery),
          where('name', '<=', searchQuery + '\uf8ff'),
          where('name', 'in', filters),
          limit(perPage)
        );
      } else if (searchQuery) {
        q = query(q, where('name', '>=', searchQuery), where('name', '<=', searchQuery + '\uf8ff'), limit(perPage));
      } else if (filters.length) {
        q = query(q, where('name', 'in', filters), limit(perPage));
      } else {
        q = query(q, limit(perPage));
      }

      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const snapshot = await getDocs(q);
      const countSnap = await getCountFromServer(collectionRef);
      const total = countSnap.data().count ?? 0;

      return {
        data: fetchingCards(snapshot),
        lastRequest: searchQuery ? 'search' : 'filter',
        total,
        lastDoc: snapshot.docs[snapshot.docs.length - 1] ?? null,
      };
    }

    if (mode === 'options') {
      const snapshot = getDocs(query(collectionRef, orderBy('name')));
      const options: Option[] = (await snapshot).docs.map((doc) => ({
        key: doc.id,
        value: doc.data().name,
      }));
      return options;
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
