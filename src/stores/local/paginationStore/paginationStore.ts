import { Range } from '@shared/types/slider';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import { action, computed, makeObservable, observable } from 'mobx';

export class PaginationStore {
  private _currentPage: number = 1;
  private _viewPerPage: Range<3, 10> = 3;
  private _totalPaginatedCities: number = 0;
  private _lastDocs: Record<number, QueryDocumentSnapshot> = {};

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
      setLastDoc: action,
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

  get targetCursor(): QueryDocumentSnapshot | null {
    return this._currentPage === 1 ? null : (this._lastDocs[this._currentPage - 1] ?? null);
  }

  setTotalPaginationCities = action((totalCities: number) => {
    this._totalPaginatedCities = totalCities;
  });

  setCurrentPage = action((page: number) => {
    if (this._currentPage !== page) {
      this._currentPage = page;
    }
  });

  setViewPerPage = action((viewPerPage: Range<3, 10>, init?: boolean) => {
    if (this._viewPerPage !== viewPerPage) {
      this._viewPerPage = viewPerPage;
      if (init) return;
      this.resetPagination();
    }
  });

  resetPagination = action(() => {
    this._lastDocs = {};
    this._currentPage = 1;
  });

  setLastDoc = action((doc: QueryDocumentSnapshot) => {
    this._lastDocs[this._currentPage] = doc;
  });
}
