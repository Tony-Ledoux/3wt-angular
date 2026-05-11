using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities;

public class Shoppinglist: BaseEntity
{
   
    public int HouseholdId {get;set;}

    public int ProductId {get;set;}
  
    public double Quantity {get;set;}

    public string? Unit {get;set;}

    public DateTime? PurchasedOn {get;set;}

    public int? AddedByUserId {get;set;}

    
    [ForeignKey(nameof(HouseholdId))]
    public Household Household {get;set;}
    [ForeignKey(nameof(ProductId))]
    public Product Product {get;set;}
    [ForeignKey(nameof(AddedByUserId))]
    public HouseholdUser? User {get;set;}


}
