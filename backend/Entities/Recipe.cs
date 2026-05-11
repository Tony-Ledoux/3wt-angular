using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities;

public class Recipe: BaseEntity
{
    [Column("name")]
    public string Name {get;set;}
    [Column("instructions")]
    public string Instructions {get;set;}
    [Column("shelf_life_days")]
    public int? ShelfLifeDays {get;set;}
    [Column("household_id")]
    public int? HouseHoldId {get;set;}
    [Column("is_global")]
    public bool IsGlobal {get;set;}

    public ICollection<RecipeIngredient> RecipeIngredients {get;set;}= [];
    public ICollection<Inventory> Inventories {get;set;}= [];
    public ICollection<RecipeCategory> Categories{get;set;}= [];
}
