using backend.Entities;

using backend.Models;

namespace backend.Mappers;

public class HouseholdUserMapper : BaseMapper<HouseholdUser, HouseholdUserDto>
{
    public override HouseholdUserDto Map(HouseholdUser entity)
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
}
