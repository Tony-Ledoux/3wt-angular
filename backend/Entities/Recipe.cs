

using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities;

public class Recipe : BaseEntity
{

    public string Name { get; set; }
    public string Instructions { get; set; }

    public int? ShelfLifeDays { get; set; }

    public int? HouseholdId { get; set; }

    public bool IsGlobal { get; set; }

    public ICollection<RecipeIngredient> RecipeIngredients { get; set; } = [];
    public ICollection<Inventory> Inventories { get; set; } = [];
    public ICollection<RecipeCategory> Categories { get; set; } = [];
    [ForeignKey(nameof(HouseholdId))]
    public Household Household {get;set;}
}
