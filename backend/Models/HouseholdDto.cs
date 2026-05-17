using System;

namespace backend.Models;

public class HouseholdDto
{
    public int Id {get;set;}
    public string Name {get;set;}
    public string? Address {get;set;}
    public string? InviteCode {get;set;}
    public bool IsOpenForInvite {get;set;}
}
public class HouseholdWithUsersDto: HouseholdDto
{
    public IEnumerable<HouseholdUserDto> Users {get;set;} = [];
}
