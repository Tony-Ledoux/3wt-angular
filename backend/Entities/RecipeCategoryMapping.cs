using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities;

public class RecipeCategoryMapping: BaseEntity
{

    public int RecipeId {get;set;}
  
    public int RecipeCategoryId {get;set;}

    [ForeignKey(nameof(RecipeId))]
    public Recipe Recipe {get;set;}
    [ForeignKey(nameof(RecipeCategoryId))]
    public RecipeCategory RecipeCategory {get;set;}
}
