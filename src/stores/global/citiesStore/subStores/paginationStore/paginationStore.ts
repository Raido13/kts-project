import { Range } from '@shared/types/slider';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { action, computed, makeObservable, observable } from 'mobx';

export class PaginationStore {
  private _currentPage: number = 1;
  private _viewPerPage: Range<3, 10> = 3;
  private _totalPaginatedCities: number = 0;
  private _lastDocs: QueryDocumentSnapshot<DocumentData, DocumentData>[] = [];

  constructor() {
    makeObservable<PaginationStore, '_currentPage' | '_viewPerPage' | '_totalPaginatedCities' | '_lastDocs'>(this, {
      _currentPage: observable,
      _viewPerPage: observable,
      _totalPaginatedCities: observable,
      _lastDocs: observable,
      currentPage: computed,
      viewPerPage: computed,
      totalPaginatedCities: computed,
      targetCursor: computed,
      setTotalPaginationCities: action,
      setCurrentPage: action,
      setViewPerPage: action,
      resetPagination: action,
      updateLastDoc: action,
    });
  }

  get currentPage(): number {
    return this._currentPage;
  }

  get viewPerPage(): Range<3, 10> {
    return this._viewPerPage;
  }

  get totalPaginatedCities(): number {
    return this._totalPaginatedCities;
  }

  get targetCursor(): QueryDocumentSnapshot<DocumentData, DocumentData> | null {
    return this._currentPage === 1 ? null : (this._lastDocs[this._currentPage - 2] ?? null);
  }

  setTotalPaginationCities = action((totalCities: number) => {
    this._totalPaginatedCities = totalCities;
  });

  setCurrentPage = action((page: number) => {
    if (this._currentPage !== page) {
      this._currentPage = page;
    }
  });

  setViewPerPage = action((viewPerPage: Range<3, 10>) => {
    this._viewPerPage = viewPerPage;
  });

  resetPagination = action(() => {
    this._lastDocs = [];
    this._currentPage = 1;
  });

  updateLastDoc = action((doc: QueryDocumentSnapshot<DocumentData, DocumentData>, index: number) => {
    if (index > this._lastDocs.length) {
      this._lastDocs.push(doc);
    } else {
      this._lastDocs[index - 1] = doc;
    }
  });
}
