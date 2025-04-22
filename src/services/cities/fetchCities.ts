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
import { CityType } from '@shared/types/city';
import { FirebaseError } from 'firebase/app';
import { FetchModeType } from '@shared/types/fetchMode';
import { Option } from '@shared/types/options';
import { capitalizeFirst } from '@shared/utils/utils';

interface FetchCitiesOptions {
  mode?: FetchModeType;
  viewPerPage?: number;
  searchQuery?: string;
  dropdownFilters?: string[];
  currentPage?: number;
  lastDoc?: QueryDocumentSnapshot<DocumentData, DocumentData> | null;
  relatedCities?: number;
  currentCityId?: string;
}

interface FetchCitiesPaginatedResult {
  data: CityType[];
  total: number;
  lastRequest: 'search' | 'filter';
  lastDoc: QueryDocumentSnapshot | null;
}

export const fetchCities = async ({
  mode = 'all',
  viewPerPage = 3,
  searchQuery = '',
  dropdownFilters = [],
  currentPage = 1,
  lastDoc = null,
  relatedCities,
  currentCityId,
}: FetchCitiesOptions): Promise<CityType[] | CityType | FetchCitiesPaginatedResult | Option[] | string> => {
  try {
    const collectionRef = collection(db, COLLECTION);

    const fetchingCities = (snapshot: QuerySnapshot<DocumentData, DocumentData>) => {
      const cities: CityType[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as CityType[];

      return cities;
    };

    if (mode === 'all') {
      const snapshot = await getDocs(collectionRef);
      return fetchingCities(snapshot);
    }

    if (mode === 'paginate') {
      let q: Query<DocumentData> = collectionRef;
      let countQuery: Query<DocumentData> = collectionRef;
      const conditions = [];
      const orderField = dropdownFilters.length > 0 ? 'country' : 'name';

      if (dropdownFilters.length > 0) {
        conditions.push(where('country', 'in', dropdownFilters));
      } else if (searchQuery) {
        const capitalizedSearchQuery = capitalizeFirst(searchQuery);
        conditions.push(
          where('name', '>=', capitalizedSearchQuery),
          where('name', '<', capitalizedSearchQuery + '\uf8ff')
        );
      }

      q = query(collectionRef, ...conditions, orderBy(orderField), limit(viewPerPage));
      countQuery = query(countQuery, ...conditions);

      if (lastDoc) {
        q = query(collectionRef, ...conditions, orderBy(orderField), startAfter(lastDoc), limit(viewPerPage));
      } else if (currentPage > 1) {
        const tempQ = query(collectionRef, ...conditions, orderBy(orderField), limit((currentPage - 1) * viewPerPage));
        const snapshot = await getDocs(tempQ);
        const docs = snapshot.docs;
        if (docs.length > 0) {
          q = query(q, startAfter(docs[docs.length - 1]), limit(viewPerPage));
        }
      }

      q = query(q, limit(viewPerPage));

      const [snapshot, countSnapshot] = await Promise.all([getDocs(q), getCountFromServer(countQuery)]);

      let total = countSnapshot.data().count ?? 0;
      const docs = snapshot.docs;
      const lastVisibleDoc = docs.length ? docs[docs.length - 1] : null;
      let data = fetchingCities(snapshot);

      if (dropdownFilters.length > 0 && searchQuery) {
        const normalizedQuery = searchQuery.toLowerCase();
        data = data.filter((city) => city.name.toLowerCase().includes(normalizedQuery));
        total = data.length;
      }

      return {
        data,
        lastRequest: searchQuery ? 'search' : 'filter',
        total,
        lastDoc: lastVisibleDoc,
      };
    }

    if (mode === 'options') {
      const snapshot = await getDocs(query(collectionRef, orderBy('name')));
      const options = [
        ...new Map(
          snapshot.docs.map((doc) => [
            doc.data().country,
            {
              key: doc.id,
              value: doc.data().country,
            },
          ])
        ).values(),
      ];
      return options as Option[];
    }

    if (mode === 'related' && relatedCities) {
      const countSnapshot = await getCountFromServer(collectionRef);
      const collectionLength = countSnapshot.data().count ?? 0;
      const indexes = new Set<number>();
      while (indexes.size < relatedCities + (currentCityId ? 1 : 0))
        indexes.add(Math.floor(Math.random() * collectionLength));

      const snapshot = await getDocs(query(collectionRef, where('index', 'in', Array.from(indexes))));

      const cities = fetchingCities(snapshot);

      const filtered = currentCityId
        ? cities.filter((cities) => cities.id !== currentCityId).slice(0, relatedCities)
        : cities;
      return filtered.sort(() => 0.5 - Math.random());
    }

    if (mode === 'single' && currentCityId) {
      const snapshot = await getDoc(doc(collectionRef, currentCityId));

      if (!snapshot.exists()) return 'City not found';

      return {
        id: snapshot.id,
        ...snapshot.data(),
      } as CityType;
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
      return errorMessages[e.code] ?? 'Failed to fetch cities. Please try again later.';
    }
    return 'Unexpected error. Please try again.';
  }
};
