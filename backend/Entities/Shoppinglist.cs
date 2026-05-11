using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities;

public class Shoppinglist: BaseEntity
{
    [Column("household_id")]
    public int HouseholdId {get;set;}
    [Column("product_id")]
    public int ProductId {get;set;}
    [Column("quantity")]
    public double Quantity {get;set;}
    [Column("unit")]
    public string? Unit {get;set;}
    [Column("purchased_on")]
    public DateTime? PurchasedOn {get;set;}
    [Column("added_by_user_id")]
    public int? AddedByUserId {get;set;}

    
    [ForeignKey(nameof(HouseholdId))]
    public Household Household {get;set;}
    [ForeignKey(nameof(ProductId))]
    public Product Product {get;set;}
    [ForeignKey(nameof(AddedByUserId))]
    public HouseholdUser? User {get;set;}


}
