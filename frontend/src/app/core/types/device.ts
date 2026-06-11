export interface deviceDTO {
    id: number;
    type: string;
}

export interface storageDevice {
    id: number;
    name: string
    deviceTypeId:number;
    deviceType:string;
    numberOfItemsInInventory:number;
}