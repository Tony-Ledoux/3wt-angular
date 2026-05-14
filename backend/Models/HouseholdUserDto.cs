using System;
using System.Globalization;

namespace backend.Models;

public class HouseholdUserDto
{
    public int HouseholdId {get;set;}
    public string HouseholdName {get;set;}
    public string? Address {get;set;}
    public bool Isowner {get;set;}
}
