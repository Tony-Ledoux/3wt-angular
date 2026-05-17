using System;
using backend.Entities;

using backend.Models;
using backend.Models.Create;

namespace backend.Mappers;

public class HouseholdMapper : BaseMapper<Household, HouseholdDto>
{
    public override HouseholdDto Map(Household entity)
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

}
