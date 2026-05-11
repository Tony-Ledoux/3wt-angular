using System;
using backend.Entities;

namespace backend.Services;

public interface IUserService
{
    Task<IEnumerable<HouseholdUser>> GetHouseholdUsersAsync(string id);
}
