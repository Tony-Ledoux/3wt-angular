import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ApiService } from '@app/core/services/api/api-service';
import { NotifyService } from '@app/core/services/notify/notify-service';
import { ProductCategoryForm } from "../../components/product-category-form/product-category-form";
import { AccordionItem } from "@app/shared/components/Accordion/accordion-item/accordion-item";
import { PageHeader } from "@app/shared/components/page-header/page-header";
import { ButtonComponent } from '@app/shared/components/button/button';
@Component({
  selector: 'app-admin-product-categories',
  imports: [JsonPipe, ProductCategoryForm, AccordionItem, PageHeader, ButtonComponent],
  templateUrl: './admin-product-categories.html',
  styleUrl: './admin-product-categories.css',
})
export class AdminProductCategories {
  apiSrv = inject(ApiService);
  notifySrc = inject(NotifyService);
  

  categories = signal<any[]>([]);


  

  constructor() {
    this.loadData();
  }

  private loadData() {
    this.apiSrv.get<any[]>('/admin/product-categories').subscribe({
      next: (data) => {
        this.categories.set(data);
      }
    });
  }

  onCategoryAdded(newCategory: any) {
    // Update de signal lijst zonder een nieuwe API call te doen
    this.categories.update(p => [...p, newCategory]);
  }

  RuleDeleteClick(id:number){
    console.log(id);
  }

  RuleAddClick(categoryId:number){
    console.log(categoryId);
  }

  CategoryDeleteClick(id:number){
    console.log(id)
  }



 

}
