using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities;

public class Product: BaseEntity
{
    [Column("product_name")]
    public string ProductName {get;set;}
    [Column("default_unit")]
    public string? DefaultUnit {get;set;}
    [Column("shelf_life_closed_days")]
    public int? ShelfLifeClosedDays {get;set;}
    [Column("shelf_life_opened_days")]
    public int? ShelfLifeOpenedDays {get;set;}
    [Column("is_global")]
    public bool IsGlobal {get;set;}
    [Column("household_id")]
    public int? HousholdId {get;set;}

    public ICollection<ProductCategory> ProductCategories {get;set;} = [];
    [ForeignKey(nameof(HousholdId))]
    public Household? Household {get;set;}
    public ICollection<Inventory> Inventories {get;set;}

}
