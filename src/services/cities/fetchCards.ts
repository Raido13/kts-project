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
  lastDoc: QueryDocumentSnapshot;
}

interface DropdownOption {
  key: string;
  value: string;
}

export const fetchCards = async ({
  mode = 'all',
  perPage = 3,
  searchQuery = '',
  filters = [],
  lastDoc = null,
}: FetchCardsOptions): Promise<City[] | FetchCardsPaginatedResult | DropdownOption[] | string> => {
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

      if (searchQuery) {
        q = query(q, where('name', '>=', searchQuery), where('name', '<=', searchQuery));
      }

      q = lastDoc ? query(q, startAfter(lastDoc), limit(perPage)) : query(q, limit(perPage));
      const snapshot = await getDocs(q);
      const countSnap = await getCountFromServer(collectionRef);
      const total = countSnap.data().count ?? 0;

      return {
        data: fetchingCards(snapshot),
        total,
        lastDoc: snapshot.docs[snapshot.docs.length - 1] ?? null,
      };
    }

    if (mode === 'query') {
      let q = query(collectionRef);
      if (filters.length) {
        q = query(q, where('name', 'in', filters));
      }
      const snapshot = await getDocs(q);
      return fetchingCards(snapshot);
    }

    if (mode === 'filter') {
      const snapshot = getDocs(query(collectionRef, orderBy('name')));
      const options: DropdownOption[] = (await snapshot).docs.map((doc) => ({
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
