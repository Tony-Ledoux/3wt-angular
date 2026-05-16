export interface HouseholdUserType {
    id:string;
    householdId:number;
    householdName:string;
    address?:string;
    isowner:boolean;
    email:string;
}


export interface HouseholdWithUsersType {
    name:string;
    address:string;
    inviteCode:string;
    isOpenForInvite:boolean;
    users:HouseholdUserType[];
}