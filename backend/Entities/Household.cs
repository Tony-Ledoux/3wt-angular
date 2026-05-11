using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities;

public class Household : BaseEntity
{

    public string Name {get;set;}
    
    public string? Address {get;set;}
    
    public string? InviteCode {get;set;}
   
    public bool IsOpenForInvite {get;set;}

    // navigation properties
    public ICollection<HouseholdUser> HouseholdUsers {get;set;} = [];
    public ICollection<StorageLocation> StorageLocations {get;set;}= [];
    public ICollection<Recipe> Recipes {get;set;}= [];
    public ICollection<Product> Products {get;set;}=[];



}
