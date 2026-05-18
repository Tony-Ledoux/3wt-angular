using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities;

public class Household : BaseEntity
{
    protected Household(){} //used by for EF core
    public Household(string name, string? address, string? inviteCode, bool isOpenForInvite=false){
        if(string.IsNullOrWhiteSpace(name)) throw new ArgumentException("Naam is verplicht");
        Name = name?.Trim();
        IsOpenForInvite = isOpenForInvite;
        Address = address?.Trim();
        InviteCode = inviteCode?.Trim();
    }


    public string Name {get; set;}
    
    public string? Address {get;set;}
    
    public string? InviteCode {get;set;}
   
    public bool IsOpenForInvite {get;set;}

    // navigation properties
    public ICollection<HouseholdUser> HouseholdUsers {get;set;} = [];
    public ICollection<StorageLocation> StorageLocations {get;set;}= [];
    public ICollection<Recipe> Recipes {get;set;}= [];
    public ICollection<Product> Products {get;set;}=[];





}
