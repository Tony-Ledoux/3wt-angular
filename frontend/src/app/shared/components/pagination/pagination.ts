import { Component, computed, input, output, Type } from '@angular/core';

export interface PaginationPage {
  type: 'page';
  page: number;
}

export interface PaginationEllipsis {
  type: 'ellipsis';
}

export type PageItem = PaginationPage | PaginationEllipsis;

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class Pagination {
  currentPage = input.required<number>();
  totalPages = input.required<number>();
  totalItems = input<number>();
  pageSize = input<number>();
  pageSizes = input<number[]>();

  pageChange = output<number>();
  pageSizeChange = output<number>();

  private readonly adjacentCount = 2;

  pages = computed<PageItem[]>(() => {
    const total = this.totalPages();
    if (total <= 1) {
      return [];
    }
    const current = this.currentPage();
    const result: PageItem[] = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        result.push({ type: 'page', page: i });
      }
    } else {
      result.push({ type: 'page', page: 1 });
      if (current > this.adjacentCount + 2) {
        result.push({ type: 'ellipsis' })
      }
      const start = Math.max(2, current - this.adjacentCount);
      const end = Math.min(total - 1, current + this.adjacentCount);
      for (let i = start; i <= end; i++) {
        result.push({ type: 'page', page: i });
      }
      if (current < total - this.adjacentCount - 1) {
        result.push({ type: 'ellipsis' });
      }
      result.push({ type: 'page', page: total });
    }
    return result;
  });

  isFirstPage = computed(()=>this.currentPage() === 1);
  isLastPage = computed(()=>this.currentPage()=== this.totalPages());

  onPageClick(page: number):void {
    if(page !== this.currentPage()){
      this.pageChange.emit(page);
    }
  }

  onPageKeyDown(event: KeyboardEvent, page:PageItem):void {
    if(event.key === 'Enter'|| event.key ===' '){
      event.preventDefault();
      if(page.type === 'page'){
        this.onPageClick(page.page);
      }
    }
  }

  onPageSizeChange(event:Event):void {
    const target = event.target as HTMLSelectElement;
    const newSize = parseInt(target.value,10);
    if(!isNaN(newSize)){
      this.pageSizeChange.emit(newSize);
    }
  }

  formatTotal():string {
    const total = this.totalItems();
    if(total === undefined){
      return '';
    }
    return total.toLocaleString('nl-NL');
  }

}
