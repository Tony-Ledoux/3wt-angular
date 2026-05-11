using System;
using backend.Entities;
using backend.Models.Create;

namespace backend.Services;

public interface IUserService
{
    Task<IEnumerable<HouseholdUser>> GetHouseholdUsersAsync(string id);
    Task<HouseholdUser> CreateNewHousholdAndUser(string id,string email, HouseholdCreationDto input);
}
