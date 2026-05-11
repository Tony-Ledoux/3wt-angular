using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities;

public class RecipeIngredient: BaseEntity
{
    
    public int RecipeId {get;set;}
  
    public int ProductId {get;set;}
   
    public double Quantity {get;set;}
   
    public string? Unit {get;set;}

    [ForeignKey(nameof(ProductId))]
    public Product Product {get;set;}
    [ForeignKey(nameof(RecipeId))]
    public Recipe Recipe {get;set;}


}
