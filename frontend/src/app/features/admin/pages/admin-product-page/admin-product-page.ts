import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '@app/core/services/api/api-service';
import { ProductCategory } from '@app/core/types/productCategories';
import { PagedResult, ProductDto } from '@app/core/types/products';
import { PageHeader } from '@app/shared/components/page-header/page-header';
import { LabeledSelectbox, SelectOptions } from "@app/shared/components/form/labled-selectbox/labeled-selectbox";
import { SectionCard } from "@app/shared/components/section-card/section-card";
import { Checkbox, CheckboxChanged } from "@app/shared/components/form/checkbox/checkbox";
import { ButtonComponent } from '@app/shared/components/button/button';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-admin-product-page',
  imports: [PageHeader, LabeledSelectbox, SectionCard, Checkbox, ButtonComponent, JsonPipe],
  templateUrl: './admin-product-page.html',
  styleUrl: './admin-product-page.css',
})
export class AdminProductPage implements OnInit {
  apiSrv = inject(ApiService);
  products = signal<ProductDto[]>([]);
  categories = signal<ProductCategory[]>([]);
  pageResults = signal<PagedResult<ProductDto> | null>(null);
  isLoading = signal(false);
  isSaving = signal(false);

  currentPage = signal(1);
  pageSize = signal(20);

  filterIsGlobal = signal<boolean | null>(null);
  filterCategoryId = signal<number | null>(null);

  isFirstPage = computed(() => this.currentPage() === 1);
  categorieOptions = computed(()=> this.categories().map((x)=>{
    return {
      label: x.categorieName,
      value:x.id
    }
  }));
  numberOfPages = [{label:"10", value:10}]

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadCategories(){
    this.apiSrv.get<ProductCategory[]>('/admin/product-categories').subscribe({
      next: (data)=>{
        this.categories.set(data);
        console.log(data)
      },
      error: (err)=> {
        console.error(err);
      }
    });
  }

  loadProducts() {
    this.isLoading.set(true);
    this.apiSrv.get<PagedResult<ProductDto>>('/admin/products',
       { 
        page: this.currentPage(), 
        pageSize: this.pageSize(), 
        isGlobal: this.filterIsGlobal(), 
        categoryId: this.filterCategoryId() 
      })
      .subscribe({
        next:(data)=>{
          this.products.set(data.items);
          this.pageResults.set(data);
          console.log(data);
          this.isLoading.set(false);
        },
        error: (err)=>{
          console.error(err);
          this.isLoading.set(false);
        }
      });
  }

 onFilterChange(event: CheckboxChanged){
  this.filterIsGlobal.set(event.checked);
  this.loadProducts();
 }

}
