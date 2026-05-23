import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ApiService } from '@app/core/services/api/api-service';
import { NotifyService } from '@app/core/services/notify/notify-service';
import { ProductCategoryForm } from "../../components/product-category-form/product-category-form";
import { AccordionItem } from "@app/shared/components/Accordion/accordion-item/accordion-item";
import { PageHeader } from "@app/shared/components/page-header/page-header";
import { ButtonComponent } from '@app/shared/components/button/button';
import { ModalService } from '@app/core/services/modal/modal-service';
import { SectionCard } from "@app/shared/components/section-card/section-card";

import { ProductCategory } from '@app/core/types/productCategories';
import { StorageRuleForm } from '../../components/storage-rule-form/storage-rule-form';
import { FullScreenLoadSpinner } from '@app/layout/shared/full-screen-load-spinner/full-screen-load-spinner';
import { FullscreenSpinnerService } from '@app/core/services/spinner/fullscreen-spinner-service';
import { delay, finalize } from 'rxjs';
@Component({
  selector: 'app-admin-product-categories',
  imports: [ PageHeader, ButtonComponent, SectionCard],
  templateUrl: './admin-product-categories.html',
  styleUrl: './admin-product-categories.css',
})
export class AdminProductCategories {
  apiSrv = inject(ApiService);
  notifySrc = inject(NotifyService);
  modalSrv = inject(ModalService)
  spinner = inject(FullscreenSpinnerService);
  categories = signal<ProductCategory[]>([]);

  deviceTypes = signal<any[]>([]);



  

  constructor() {
    this.loadData();
  }

  private loadData() {
    this.apiSrv.get<any[]>('/admin/product-categories').subscribe({
      next: (data) => {
        this.categories.set(data);
      }
    });
this.apiSrv.get<any[]>('/devicetypes').subscribe({
      next: (data) => {
        this.deviceTypes.set(data);
        console.log(data)
      }
    });
  }

  onCategoryAdded(newCategory: any) {
    // Update de signal lijst zonder een nieuwe API call te doen
    this.categories.update(p => [...p, newCategory]);
  }

  onClickAddCategory(){
    const options = this.deviceTypes().map(dt=>({
      label: dt.type,
      value: dt.id
    }))
    console.log(options)
    this.modalSrv.open("categorie toevoegen",ProductCategoryForm)
    .setData({
      choices:options
    })
    .setEventCallback((eventName,data)=>{
        console.log(eventName);
        if(eventName === 'categoryAdded'){
          this.onCategoryAdded(data)
          this.modalSrv.close();
        }
      })
    .setShowActionButton(false)
    .show()
  }

  RuleDeleteClick(id:number){
    const categorie = this.categories().find(x=>x.storageRules.some((y: { id: number; })=>y.id === id));
    const rule = categorie!.storageRules.find((x)=>x.id == id);
    this.modalSrv.open("verwijderen",`Ben je zeker dat je ${rule!.deviceType} wil wissen uit ${categorie!.categorieName}?`)
    .setType('danger')
    .setIcon("fa fa-file-circle-xmark")
    .setConfirmCallback(()=>{
      console.log(categorie,rule)
      this.spinner.show()
      this.apiSrv.delete(`/admin/storage-rule/${id}`).pipe(delay(2000),finalize(()=>this.spinner.hide())).subscribe({
        complete: ()=>{
          // only runs if request is successful!
          this.notifySrc.success(`regel ${rule?.deviceType} is verwijderd uit categorie ${categorie?.categorieName}`);
        },
        next:()=>{
          this.categories.update( cat => 
            cat.map(cat => ({
              ...cat,
              storageRules: cat.storageRules.filter(rule=>rule.id !== id)
            }))
          );
        },
        error:(err)=>{
this.notifySrc.error(`regel ${rule?.deviceType} kan niet verwijderd worden uit categorie ${categorie?.categorieName}`);
        }
      });
    })
    .show()
  }

  RuleAddClick(categoryId:number){
    const category = this.categories().find(x=>x.id === categoryId);
    const existingTypes = category?.storageRules.map(x=>x.deviceType) ?? [];
    const missing = this.deviceTypes().filter(x=> !existingTypes.includes(x.type));
    const missingOptions = missing.map(x=>({value:x.id, label:x.type}));
    
    this.modalSrv.open('Regel toevoegen',StorageRuleForm)
    .setCloseBackdropClick(false)
    .setData({
      options:missingOptions,
      category:category
    })
    .setEventCallback((name,data)=>{
      console.log(name, data);
      if(name ==='ruleAdded'){
        console.log(data);
        this.categories.update(p=>{
          return p.map(x=>{
            if(x.id == category?.id){
              return {...x, storageRules: [...x.storageRules, data]}
            }
            return x;
          })
        })
        this.notifySrc.success(`${data.deviceType} toegevoegd aan ${category?.categorieName}`)
      }
      this.modalSrv.close();
    })
    .setShowActionButton(false)
    .show();
    console.log(categoryId, missing);
  }

  CategoryDeleteClick(id:number){
    const categorie = this.categories().find(x=>x.id ===id);
    this.modalSrv.open("categorie verwijderen?",`Ben je zeker dat je <br><strong>${categorie!.categorieName}</strong><br> wil verwijderen?`)
    .setType('danger')
    .setIcon('fa fa-folder-minus')
    .setConfirmCallback(()=>{
      this.spinner.show()
      this.apiSrv.delete(`/admin/product-categories/${id}`).pipe(delay(2000), finalize(()=>this.spinner.hide())).subscribe({
        next: ()=>{
          this.categories.update((p) =>p.filter(x=>x.id !== id));
        },
        error:(err)=>{
          this.notifySrc.error(`kon categorie ${categorie?.categorieName} niet verwijderen`)
        },
        complete: ()=> this.notifySrc.success(`categorie: ${categorie?.categorieName} is verwijderd`)
      })
    })
    .show()
    console.log(id)
  }



 

}
