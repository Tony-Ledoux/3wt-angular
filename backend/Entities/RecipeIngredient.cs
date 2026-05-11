using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities;

public class RecipeIngredient: BaseEntity
{
    [Column("recipe_id")]
    public int RecipeId {get;set;}
    [Column("product_id")]
    public int ProductId {get;set;}
    [Column("quantity")]
    public double Quantity {get;set;}
    [Column("unit")]
    public string? Unit {get;set;}

    [ForeignKey(nameof(ProductId))]
    public Product Product {get;set;}
    [ForeignKey(nameof(RecipeId))]
    public Recipe Recipe {get;set;}


}
