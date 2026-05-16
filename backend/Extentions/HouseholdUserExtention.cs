using System;
using backend.Entities;
using backend.Models;

namespace backend.Extentions;

public static class HouseholdUserExtention
{
    public static HouseholdUserDto ToDto(this HouseholdUser entity)
    {
        if (entity == null) return null;
        return new HouseholdUserDto
        {
            Id = entity.UserId,
            HouseholdId = entity.HouseholdId,
            HouseholdName = entity.Household.Name,
            Address = entity.Household.Address,
            Isowner = entity.HouseholdOwner,
            Email = entity.Email
        };
    }

    public static IEnumerable<HouseholdUserDto> ToDtoList(this IEnumerable<HouseholdUser> list)
    {
        return list.Select(hu => hu.ToDto());
    }
}
