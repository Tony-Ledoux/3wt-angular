import { Component, computed, inject, model, signal } from '@angular/core';
import { ApiService } from '@app/core/services/api/api-service';
import { HouseholdService } from '../../services/household-service';
import { SectionCard } from "@app/shared/components/section-card/section-card";
import { Pagination } from "@app/shared/components/pagination/pagination";
import { JsonPipe } from '@angular/common';
import { Checkbox } from "@app/shared/components/form/checkbox/checkbox";
import { LabeledInput } from "@app/shared/components/form/labeled-input/labeled-input";
import { ProductDto } from '@app/core/types/products';
import { ButtonComponent } from '@app/shared/components/button/button';
import { SectionCardHeader } from "@app/shared/directives/section-card-header";
import { PillComponent } from '@app/shared/components/pill-component/pill-component';
import { InventoryService } from '../../services/inventory-service';
import { LabeledSelectbox, SelectOptions } from '@app/shared/components/form/labled-selectbox/labeled-selectbox';
import { ModalService } from '@app/core/services/modal/modal-service';
import { AddInventoryItem } from '../../components/add-inventory-item/add-inventory-item';
import { InventoryItem } from '@app/core/types/inventory-item';
import { PageHeader } from '@app/shared/components/page-header/page-header';
import { Router } from '@angular/router';
import { Menu } from '@app/shared/components/wrappers/menu/menu';

@Component({
  selector: 'app-products',
  imports: [Menu,SectionCard, Pagination, JsonPipe, Checkbox, LabeledInput, ButtonComponent, PillComponent, SectionCardHeader, LabeledSelectbox, PageHeader],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  private readonly apiSrv = inject(ApiService);
  inventorySrv = inject(InventoryService);
  router = inject(Router);
  readonly householdSrv = inject(HouseholdService)
  private modalSrv = inject(ModalService);
  products = computed(() => this.inventorySrv.products())
  inventory = computed<InventoryItem[]>(() => this.inventorySrv.inventory())
  categories = computed(() => this.inventorySrv.categories())
  categoriesOptions = computed<SelectOptions[]>(() => this.categories().map((x) => ({ label: x.categorieName, value: x.id })).sort((a, b) => a.label.localeCompare(b.label)));
  selected_household = computed(() => this.householdSrv.selected_household())
  devices_available = computed<boolean>(() => {
    const devices = this.inventorySrv.household_devices();
    return !!devices && devices.length > 0;
  });
  // Filter
  filterQuery = signal<string>('');
  filterCategorie = signal<number | null>(null);
  filterToggles = signal<boolean | null>(null);

  filteredProducts = computed(() => {
    let products = this.products();
    const categorie = this.filterCategorie();
    console.log('selected_categorie', categorie)
    const query = this.filterQuery().toLowerCase();
    const onlySelf = this.filterToggles();
    if (categorie) {
      console.log('categoriefilter run')
      products = products.filter(x => x.categoryIds.includes(categorie));
      console.log(products)
    }
    if (onlySelf !== null) {
      products = products.filter(x => x.isGlobal === onlySelf)
    }
    if (query) {
      products = products.filter(x => x.productName.toLowerCase().includes(query));
    }
    return products;
  });


  current_page = signal(1);
  page_size = signal(10);
  pageSizes = [10, 20, 30, 40, 50, 100]


  pagedProducts = computed(() => {
    const startIndex = (this.current_page() - 1) * this.page_size();
    const endIndex = startIndex + this.page_size();
    return this.filteredProducts().slice(startIndex, endIndex);
  });

  totalProducts = computed(() => this.products().length);
  totalPages = computed(() => Math.ceil(this.filteredProducts().length / this.page_size()));

  onPageChange(event: any) {
    this.current_page.set(event);
  }
  onPageSizeChange(event: any) {
    this.page_size.set(event);
    this.current_page.set(1)
  }

  onSectorChange(event: any) {
    this.filterToggles.set(event.checked)
    this.current_page.set(1)
  }
  onFilterChange(event: any) {
    this.filterQuery.set(event);
    this.current_page.set(1)
  }
  onFilterCategorieChange(event: any) {
    // Convert to number, but keep null for empty/unselected states
    const value = event === "" || event === null ? null : Number(event);
    this.filterCategorie.set(value);
    this.current_page.set(1);
  }
  handleClickAddToInventory(product: ProductDto) {
    this.modalSrv.open("Toevoegen aan inventaris", AddInventoryItem)
      .setData({
        product,
        categories: this.categories().filter(x => product.categoryIds.includes(x.id)),
        devices: this.inventorySrv.household_devices(),
        household_id: this.selected_household()?.householdId!
      })
      .setEventCallback((name, data) => {
        if (name === "submitted") {
          this.inventorySrv.addInventoryItem(data);
          this.modalSrv.close();
        }
      })
      .setShowActionButton(false)
      .setCloseBackdropClick(false)
      .show()
    console.log(product);
  }
  inInventory(product: ProductDto): boolean {
    const exists = this.inventory().filter(x => x.product.productName === product.productName);
    return exists.length > 0
  }
  handleProductDeleteClick(prod: ProductDto) {
    alert('clicked_delete');
  }
  handleInventoryClick() {
    this.router.navigate(['app', 'inventory']);
  }

  get_category_from_id(id: number) {
    return this.categories().find(x => x.id === id) ?? null;
  }
}
