using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities;

public class Inventory: BaseEntity
{

    public int StorageLocationId {get;set;}
   
    public int? ProductId {get;set;}
   
    public int? RecipeId {get;set;}
    
    public double Quantity {get;set;}
   
    public string? Unit {get;set;}
    
    public DateOnly? ExpiryDate {get;set;}
   
    public DateTime DateIn {get;set;}
   
    public DateTime? DateOpened {get;set;}
    [ForeignKey(nameof(ProductId))]
    public Product? Product {get;set;}
    [ForeignKey(nameof(RecipeId))]
    public Recipe? Recipe {get;set;}
    [ForeignKey(nameof(StorageLocationId))]
    public StorageLocation StorageLocation {get;set;}
}
