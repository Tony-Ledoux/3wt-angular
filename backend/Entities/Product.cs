using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities;

public class Product: BaseEntity
{

    public string ProductName {get;set;}
  
    public string? DefaultUnit {get;set;}
   
    public int? ShelfLifeClosedDays {get;set;}
   
    public int? ShelfLifeOpenedDays {get;set;}
  
    public bool IsGlobal {get;set;}
   
    public int? HouseholdId {get;set;}

    public ICollection<ProductCategory> ProductCategories {get;set;} = [];
    [ForeignKey(nameof(HouseholdId))]
    public Household? Household {get;set;}
    public ICollection<Inventory> Inventories {get;set;}

}
