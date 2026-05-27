import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '@app/core/services/api/api-service';
import { ProductCategory } from '@app/core/types/productCategories';
import { PagedResult, ProductDto } from '@app/core/types/products';
import { PageHeader } from '@app/shared/components/page-header/page-header';
import { LabeledSelectbox } from "@app/shared/components/form/labled-selectbox/labeled-selectbox";
import { SectionCard } from "@app/shared/components/section-card/section-card";
import { Checkbox, CheckboxChanged } from "@app/shared/components/form/checkbox/checkbox";
import { ButtonComponent } from '@app/shared/components/button/button';
import { ModalService } from '@app/core/services/modal/modal-service';
import { NewProductForm } from '../../components/new-product-form/new-product-form';
import { SectionCardHeader } from "@app/shared/directives/section-card-header";
import { NotifyService } from '@app/core/services/notify/notify-service';
import { ModalSelectboxWrapper } from '@app/shared/components/wrappers/modal-selectbox-wrapper/modal-selectbox-wrapper';
import { EditProductForm } from '../../components/edit-product-form/edit-product-form';
import { Pagination } from '@app/shared/components/pagination/pagination';

@Component({
  selector: 'app-admin-product-page',
  imports: [PageHeader, LabeledSelectbox, SectionCard, Checkbox, ButtonComponent, SectionCardHeader, Pagination],
  templateUrl: './admin-product-page.html',
  styleUrl: './admin-product-page.css',
})
export class AdminProductPage implements OnInit {
  private readonly apiSrv = inject(ApiService);
  private readonly modalSrv = inject(ModalService);
  private readonly notifySrv = inject(NotifyService);

  products = signal<ProductDto[]>([]);
  categories = signal<ProductCategory[]>([]);
  pageResults = signal<PagedResult<ProductDto> | null>(null);
  isLoading = signal(false);
  isSaving = signal(false);
  pageSizes = signal([9, 18, 36, 72, 144, 288]);

  currentPage = signal(1);
  pageSize = signal(9);


  filterIsGlobal = signal<boolean | null>(null);
  filterCategoryId = signal<number | null>(null);

  isFirstPage = computed(() => this.currentPage() === 1);

  categorieOptions = computed(() => this.categories().map((x) => {
    return {
      label: x.categorieName,
      value: x.id
    }
  }));
  productsWithCategories = computed(() => {
    const cats = this.categories();
    return this.products().map(p => ({
      ...p,
      categories: p.categoryIds.map(id => cats.find(c => c.id === id))
    }))
  });


  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadProducts();
  }

  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1); // Reset naar eerste pagina bij pageSize wijziging
    this.loadProducts();
  }

  loadCategories() {
    this.apiSrv.get<ProductCategory[]>('/admin/product-categories').subscribe({
      next: (data) => {
        this.categories.set(data);
        console.log(data)
      },
      error: (err) => {
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
        next: (data) => {
          this.products.set(data.items);
          this.pageResults.set(data);
          console.log(data);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.isLoading.set(false);
        }
      });
  }

  onFilterChange(event: CheckboxChanged) {
    this.filterIsGlobal.set(event.checked);
    this.loadProducts();
  }
  onSelectFilterChange(event: any) {
    let val: number | null;
    if (event === "") {
      val = null;
    } else {
      val = event;
    }
    this.filterCategoryId.set(val);
    this.loadProducts();
  }

  onProductCreateClick() {
    this.modalSrv.open("Product toevoegen", NewProductForm)
      .setShowActionButton(false)
      .setCloseBackdropClick(false)
      .setData({
        categories: this.categories()
      })
      .setEventCallback((eventName) => {
        if (eventName == 'created') {
          this.loadProducts();
          this.modalSrv.close()
        }
      })
      .show()
  }


  onCategoryRemoveClick(cat: ProductCategory, product: ProductDto) {
    const question = `Wil jij categorie <br> <strong>${cat.categorieName}</strong> <br> ontkoppelen van product <br> <strong>${product.productName}</strong>?`;
    this.modalSrv.open('ontkoppelen?', question)
      .setIcon('fa fa-link-slash')
      .setConfirmText("ontkoppelen")
      .setType('danger')
      .setConfirmCallback(() => {
        this.apiSrv.delete(`/products/${product.id}/categories/${cat.id}`).subscribe({
          next: () => {
            // create a new array op ProductDto where the product with id product.id doesn't have cat.id in the catagories
            this.products.update(p => p.map(
              p => p.id === product.id ?
                { ...p, categoryIds: p.categoryIds.filter(c => c !== cat.id) }
                : p));
            this.notifySrv.success(`${cat.categorieName} ontkoppeld van ${product.productName}`);
          },
          error: (err) => {
            console.log(err)
            this.notifySrv.error(`Kon ${cat.categorieName} niet ontkoppelen van ${product.productName}`);
          }
        });
      })
      .show()
    console.log(cat, product);
  }
  onCategoryAddClick(product: ProductDto) {
    let selectedCategoryId: number | string | null = null;
    // filter categories already present
    const ids = product.categoryIds;
    // only keep the categories not in ids
    const choises = this.categorieOptions().filter(x => !ids.includes(x.value));
    this.modalSrv.open(`Categorie voor ${product.productName}`, ModalSelectboxWrapper)
      .setData({
        label: 'Kies een categorie',
        choices: choises
      })
      .setEventCallback((name, data) => {
        if (name === 'output') {
          selectedCategoryId = data;
        }
      })
      .setConfirmCallback(() => {
        if (selectedCategoryId === null || selectedCategoryId === "") {
          this.notifySrv.error('U heeft geen categorie gekozen');
          return;
        }

        const category = this.categories().find(x => x.id === parseInt(selectedCategoryId?.toString() || "", 10));
        this.apiSrv.post(`/products/${product.id}/categories/${category?.id}`, {}).subscribe({
          next: () => {
            this.products.update(p => p.map(x => {
              if (x.id !== product.id) {
                return x;
              } else {
                x.categoryIds.push(category?.id!);
                return x;
              }
            }));
            this.notifySrv.success(`Categorie ${category?.categorieName} toegevoegd aan ${product.productName}`);
          },
          error: (err) => {
            this.notifySrv.error(`Categorie ${category?.categorieName} kon niet toegevoegd worden aan ${product.productName}`);
          }
        });


      })
      .setIcon('fa fa-link')
      .setConfirmText('Koppelen')
      .show()
  }

  onProductRemoveClick(product: ProductDto) {
    const question = `Wil je product <strong>${product.productName}</strong> Verwijderen?`
    this.modalSrv.open("Verwijderen?", question)
      .setType("danger")
      .setConfirmCallback(() => {
        this.apiSrv.delete(`/products/${product.id}`).subscribe({
          next: () => {
            this.products.update(p => p.filter(x => x.id !== product.id));
            this.notifySrv.success(`product ${product.productName} is verwijderd!`);
          },
          error: (err) => {
            console.error(err);
            this.notifySrv.error(`kon product ${product.productName} niet verwijderen!`);
          }
        });
      })
      .setIcon('fa fa-dumpster')
      .show();
  }

  onEditProductClick(product: ProductDto) {
    console.log(product);
    this.modalSrv.open(`Bewerk ${product.productName}`, EditProductForm)
      .setData({
        product: product,
        categories: this.categories
      })
      .setEventCallback((name, data) => {
        console.log('returned from form', data);
        if (name === 'productUpdated') {
          this.products.update(p => p.map(p => {
            if (p.id === data.id) {
              return data;
            } else {
              return p;
            }
          }))
        }
        this.modalSrv.close();
      })
      .setCloseBackdropClick(false)
      .setShowActionButton(false)
      .show();
  }

}
