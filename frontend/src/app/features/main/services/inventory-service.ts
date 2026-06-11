import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { ApiService } from "@app/core/services/api/api-service";
import { HouseholdService } from "./household-service";
import { ProductDto } from "@app/core/types/products";
import { ProductCategory } from "@app/core/types/productCategories";
import { deviceDTO, storageDevice } from "@app/core/types/device";
import { SelectOptions } from "@app/shared/components/form/labled-selectbox/labeled-selectbox";

@Injectable({
    providedIn: 'root',
})
export class InventoryService {
    private readonly apiSrv = inject(ApiService);
    private readonly householdSrv = inject(HouseholdService);
    private devices = signal<deviceDTO[]>([]);
    categories = signal<ProductCategory[]>([]);
    household_devices = signal<storageDevice[]>([]);
    products = signal<ProductDto[]>([]);

    private readonly household_id = computed(() => {
        const hh = this.householdSrv.selected_household();
        return hh ? hh.householdId : null;
    });
    isowner = computed(() => this.householdSrv.selected_household()?.isowner ?? false)
    
    
    public get deviceOptionList() : SelectOptions[] {
        return this.devices().map(x=>({label:x.type,value:x.id})).sort((a,b)=>a.label.localeCompare(b.label));
    }
    
    
    constructor() {

        effect(() => {
            if (this.household_id() != null) {
                this.load_data(this.household_id()!);
            }
        });
    }

    private load_data(household_id: number) {

        // get devicetypes
        this.load_device_types();
        // get categories
        this.load_categories();
        // load products
        this.load_products_for_household(household_id);
        //get inventory
        this.load_inventory(household_id);

    }

    private load_device_types() {
        this.apiSrv.get<deviceDTO[]>("/devicetypes").subscribe({
            next: (data) => {
                this.devices.set(data);
            },
            error: (err) => {
                console.error(err);
            }
        });
    }

    private load_categories() {
        this.apiSrv.get<ProductCategory[]>("/products/categories").subscribe({
            next: (data) => {
                this.categories.set(data);
            },
            error: (err) => {
                console.error(err);
            }
        });
    }

    private load_products_for_household(id: number) {
        this.apiSrv.get<ProductDto[]>(`/products/houshold/${id}`).subscribe({
            next: (data) => {
                this.products.set(data);
            },
            error: (err) => {
                console.error(err)
            }
        });
    }

    private load_inventory(id: number) {
        this.apiSrv.get<storageDevice[]>(`/storagelocations/household/${id}`).subscribe({
            next: (data) => {
                console.log(data);
                this.household_devices.set(data);
            },
            error: (err) => {
                console.error(err)
            }
        });
    }

}