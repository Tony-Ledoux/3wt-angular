export interface StorageRule {
    id:number;
    deviceType:string;
    multiplier:number
}

export interface ProductCategory {
    id:number;
    categorieName:string;
    storageRules:StorageRule[];
}