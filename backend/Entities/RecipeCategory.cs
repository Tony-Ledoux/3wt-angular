using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities;

public class RecipeCategory: BaseEntity
{
  
    public string Category {get;set;}
    public ICollection<Recipe> Recipes {get;set;} = []; 
}
