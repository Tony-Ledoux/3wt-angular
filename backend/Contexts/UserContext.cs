using System;
using backend.Models;

namespace backend.Contexts;

public interface IUserContext
{
    public string? UserId {get;set;}
    public string? Email {get;set;}
    public bool IsAdmin {get;set;}
    public IEnumerable<HouseholdUserDto> HouseholdUsers {get;set;}

    public HouseholdUserDto? IsCurrentUserInHouseholdWithId(int id);
    public void DeleteFromContext(HouseholdUserDto user);

    public bool CurrentUserOwnsHousehold(int householdId);
    
}
public class UserContext : IUserContext
{
    public string? UserId { get ; set; }
    public string? Email { get ; set; }
    public IEnumerable<HouseholdUserDto> HouseholdUsers { get; set ; }= [];
    public bool IsAdmin { get; set; }

    public bool CurrentUserOwnsHousehold(int householdId)
    {
        return HouseholdUsers.Any(hu=>hu.HouseholdId==householdId && hu.Isowner == true);
    }

    public void DeleteFromContext(HouseholdUserDto user)
    {
        HouseholdUsers = HouseholdUsers.Where(x=>x.Id != user.Id && x.HouseholdId != user.HouseholdId);
    }

    public HouseholdUserDto? IsCurrentUserInHouseholdWithId(int id)
    {
        return HouseholdUsers.FirstOrDefault(hu => hu.HouseholdId == id);
    }
    
    
}
