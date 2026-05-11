using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities;

public class Inventory: BaseEntity
{
    [Column("storage_location_id")]
    public int StorageLocationId {get;set;}
    [Column("product_id")]
    public int? ProductId {get;set;}
    [Column("recipe_id")]
    public int? RecipeId {get;set;}
    [Column("quantity")]
    public double Quantity {get;set;}
    [Column("unit")]
    public string? Unit {get;set;}
    [Column("expiry_date")]
    public DateOnly? ExpiryDate {get;set;}
    [Column("date_in")]
    public DateTime DateIn {get;set;}
    [Column("date_opened")]
    public DateTime? DateOpened {get;set;}
    [ForeignKey(nameof(ProductId))]
    public Product? Product {get;set;}
    [ForeignKey(nameof(RecipeId))]
    public Recipe? Recipe {get;set;}
}
