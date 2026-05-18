using System;
using backend.Entities;

using backend.Models;
using backend.Models.Create;

namespace backend.Mappers;
public interface IHouseholdMapper : IMapper<Household, HouseholdDto>
{
    public HouseholdWithUsersDto MapWithUsers(Household entity);
}

public class HouseholdMapper(IMapper<HouseholdUser, HouseholdUserDto> userMapper) :  BaseMapper<Household, HouseholdDto>, IHouseholdMapper
{
    private readonly IMapper<HouseholdUser, HouseholdUserDto> _usermapper = userMapper;
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


    public HouseholdWithUsersDto MapWithUsers(Household entity)
    {
        var dto = new HouseholdWithUsersDto
        {
            Id = entity.Id,
            Name = entity.Name,
            Address = entity.Address,
            InviteCode = entity.InviteCode,
            IsOpenForInvite = entity.IsOpenForInvite,
            Users = _usermapper.MapList(entity.HouseholdUsers)

        };
        return dto;
    }
}
