export interface ProductMinimal {
    id:number;
    productName:string;
}
export interface StoragelocationMinimal {
    id:number;
    name:string;
}

export interface InventoryItem {
    id:number;
    product:ProductMinimal;
    storagelocation: StoragelocationMinimal;
    quantity:number;
    unit?:string;
    expiryDate?:string
}