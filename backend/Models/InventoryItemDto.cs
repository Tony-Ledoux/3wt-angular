using System;
using backend.Entities;

namespace backend.Models;

public class ProductMinimalDto
{
    public int Id {get;set;}
    public string ProductName {get;set;}
}
public class StorageLocationMinimal
{
    public int Id {get;set;}
    public string Name {get;set;}
}
public class InventoryItemDto
{
    public int Id {get;set;}
    public ProductMinimalDto? Product {get;set;}
    public StorageLocationMinimal Storagelocation {get;set;}
    public double Quantity {get;set;}
    public string? Unit {get;set;}
    public DateOnly? ExpiryDate {get;set;}
}
