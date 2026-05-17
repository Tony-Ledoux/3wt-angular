export interface HouseholdUserType {
    id:string;
    householdId:number;
    householdName:string;
    address?:string;
    isowner:boolean;
    email:string;
}

export interface Household {
    id:number;
    name:string;
    address:string;
    inviteCode:string;
    isOpenForInvite:boolean;
}


export interface HouseholdWithUsersType {
    id: number
    name:string;
    address:string;
    inviteCode:string;
    isOpenForInvite:boolean;
    users:HouseholdUserType[];
}