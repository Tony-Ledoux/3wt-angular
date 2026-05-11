using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities;

public class RecipeCategoryMapping
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id {get;set;}
    [Column("recipe_id")]
    public int RecipeId {get;set;}
    [Column("recipe_category_id")]
    public int RecipeCategoryId {get;set;}

    [ForeignKey(nameof(RecipeId))]
    public Recipe Recipe {get;set;}
    [ForeignKey(nameof(RecipeCategoryId))]
    public RecipeCategory RecipeCategory {get;set;}
}
