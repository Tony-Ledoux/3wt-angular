using System;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace backend.Entities;

[Index(nameof(ServingDate), nameof(HouseholdId), IsUnique = true)]
public class Weekmenu: BaseEntity
{
  
    public DateOnly ServingDate {get;set;}

    public int RecipeId {get;set;}

    public int HouseholdId {get;set;}

    [ForeignKey(nameof(HouseholdId))]
    public Household Household {get;set;}
    [ForeignKey(nameof(RecipeId))]
    public Recipe Recipe {get;set;}
}
