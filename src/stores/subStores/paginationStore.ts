import { Range } from '@shared/types/slider';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { computed, makeAutoObservable } from 'mobx';

export class PaginationStore {
  currentPage: number = 1;
  viewPerPage: Range<3, 10> = 3;
  totalCities: number = 0;
  lastDocs: QueryDocumentSnapshot<DocumentData, DocumentData>[] = [];

  constructor() {
    makeAutoObservable(this, {
      targetCursor: computed,
    });
  }

  get targetCursor() {
    return this.currentPage === 1 ? null : (this.lastDocs[this.currentPage - 2] ?? null);
  }

  setCurrentPage = (page: number) => {
    if (this.currentPage !== page) {
      this.currentPage = page;
    }
  };

  setViewPerPage = (viewPerPage: Range<3, 10>) => {
    this.viewPerPage = viewPerPage;
  };

  resetPagination = () => {
    this.lastDocs = [];
    this.currentPage = 1;
  };

  updateLastDoc(doc: QueryDocumentSnapshot<DocumentData, DocumentData>, index: number) {
    if (index > this.lastDocs.length) {
      this.lastDocs.push(doc);
    } else {
      this.lastDocs[index - 1] = doc;
    }
  }
}
