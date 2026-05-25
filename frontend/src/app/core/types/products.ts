export interface ProductDto {
    id: number;
    productName:string;
    defaultUnit?:string;
    shelfLifeClosedMinutes?:number;
    shelfLifeOpenedMinutes?:number;
    isGlobal: boolean;
    householdId?:number;
    categoryIds:number[];
}

export interface PagedResult<T> {
    items:T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}