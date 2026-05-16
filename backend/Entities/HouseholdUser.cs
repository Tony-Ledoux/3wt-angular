using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities;

public class HouseholdUser: BaseEntity
{

    public string UserId {get;set;}

    public int HouseholdId {get;set;}

    public bool HouseholdOwner {get;set;}
    public string Email {get;set;}

    
    [ForeignKey(nameof(HouseholdId))]
    public Household Household {get;set;}
}
