using System;
using backend.Entities;
using backend.Models;
using backend.Models.Create;

namespace backend.Extentions;

public static class HouseholdExtention
{
    public static HouseholdDto ToDto(this Household entity)
    {
        return new HouseholdDto
        {
            Id = entity.Id,
            Name = entity.Name,
            Address = entity.Address,
            InviteCode = entity.InviteCode,
            IsOpenForInvite = entity.IsOpenForInvite
        };
    }
    public static HouseholdWithUsersDto ToDetailsDto(this Household entity)
    {
        return new HouseholdWithUsersDto
        {
            Id = entity.Id,
          Name=entity.Name,
          Address = entity.Address,
          InviteCode = entity.InviteCode,
          IsOpenForInvite = entity.IsOpenForInvite,
          Users = entity.HouseholdUsers.ToDtoList() 
        };
    }
    public static Household ToEntity(this HouseholdCreationDto input)
    {
        string? inviteCode = null;
        if( input == null) return null;
        inviteCode = input.InviteCode ?? null;
        bool open = input.IsOpenForInvite;
        
        return new Household(input.Name.Trim(),input.Address,inviteCode,open);
    }
}
