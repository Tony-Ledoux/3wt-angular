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

@Component({
  selector: 'app-products',
  imports: [SectionCard, Pagination, JsonPipe, Checkbox, LabeledInput, ButtonComponent, PillComponent, SectionCardHeader, LabeledSelectbox],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  private readonly apiSrv = inject(ApiService);
  private inventorySrv = inject(InventoryService);
  readonly householdSrv = inject(HouseholdService)
  //products = signal<ProductDto[]>([]);
  products = computed(() => this.inventorySrv.products())
  categories = computed(() => this.inventorySrv.categories())
  categoriesOptions = computed<SelectOptions[]>(() => this.categories().map((x) => ({ label: x.categorieName, value: x.id })).sort((a, b) => a.label.localeCompare(b.label)));
  selected_household = computed(() => this.householdSrv.selected_household())

  // Filter
  filterQuery = signal<string>('');
  filterCategorie = signal<number | null>(null);
  filterToggles = signal<boolean | null>(null);
  filteredProducts = computed(() => {
    let products = this.products();
    const categorie = this.filterCategorie();
    const query = this.filterQuery().toLowerCase();
    const onlySelf = this.filterToggles();
    if (categorie !== null) {
      products = products.filter(x => x.categoryIds.includes(categorie));
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
    if (event === "") {
      event = null;
    }
    this.filterCategorie.set(event);
    this.current_page.set(1)
  }
}
