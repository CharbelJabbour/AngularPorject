import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PageStateService {
  private cachedPageNumber: number | null = null;


  setPageNumber(pageNumber: number): void {
    this.cachedPageNumber = pageNumber;
  }

  getPageNumber(): number | null {
    return this.cachedPageNumber;
  }
}
