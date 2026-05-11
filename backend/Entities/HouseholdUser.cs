using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities;

public class HouseholdUser: BaseEntity
{
    [Column("user_id")]
    public string UserId {get;set;}
    [Column("household_id")]
    public int HouseholdId {get;set;}
    [Column("household_owner")]
    public bool HouseholdOwner {get;set;}
    [Column("email")]
    public string? Email{get;set;}

    
    [ForeignKey(nameof(HouseholdId))]
    public Household Household {get;set;}
}
