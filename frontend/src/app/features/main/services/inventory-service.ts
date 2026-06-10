import { computed, inject, Injectable, signal } from "@angular/core";
import { ApiService } from "@app/core/services/api/api-service";
import { HouseholdService } from "./household-service";
import { ProductDto } from "@app/core/types/products";
import { ProductCategory } from "@app/core/types/productCategories";
import { deviceDTO, deviceWithInventory } from "@app/core/types/device";

@Injectable({
    providedIn: 'root',
})
export class InventoryService {
    private readonly apiSrv = inject(ApiService);
    private readonly householdSrv = inject(HouseholdService);
    devices = signal<deviceDTO[]>([]);
    categories = signal<ProductCategory[]>([]);
    inventory = signal<deviceWithInventory[]>([]);
    products = signal<ProductDto[]>([]);

    private readonly household_id = computed(() => this.householdSrv.selected_household()?.householdId);

    constructor() {
        this.load_data();
    }

    private load_data() {
        const household_id = this.household_id() ?? 0;
        // get devicetypes
        this.apiSrv.get<deviceDTO[]>("/devicetypes").subscribe({
            next: (data) => {
                this.devices.set(data);
            },
            error: (err) => {
                console.error(err);
            }
        });
        // get categories
        this.apiSrv.get<ProductCategory[]>("/products/categories").subscribe({
            next: (data) => {
                this.categories.set(data);
            },
            error: (err) => {
                console.error(err);
            }
        });
        this.apiSrv.get<ProductDto[]>(`/products/houshold/${household_id}`).subscribe({
            next: (data) => {
                this.products.set(data);
            },
            error: (err) => {
                console.error(err)
            }
        });
        //get inventory
        this.apiSrv.get<deviceWithInventory[]>(`/storagelocations/household/${household_id}`).subscribe({
            next: (data) => {
                console.log(data);
                this.inventory.set(data);
            },
            error: (err) => {
                console.error(err)
            }
        });
    }

}