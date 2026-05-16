using System;
using backend.Entities;


namespace backend.Contexts;

public class IUserContext
{
    public string? UserId {get;set;}
    public string? Email {get;set;}
    public IEnumerable<HouseholdUser> HouseholdUsers {get;set;}= [];
}
