using System;
using System.Globalization;
using backend.Entities;
using backend.Models;
using backend.Models.Create;

namespace backend.Services;

public interface IUserService
{
    Task<IEnumerable<HouseholdUser>> GetHouseholdUsersAsync(string id);
    Task<RequestResponse<HouseholdUser>> CreateNewHousholdAndUser(string id, string email, HouseholdCreationDto input);

    Task<RequestResponse<HouseholdUser>> JoinByInviteCode(string id, string email, InviteRequestCodeDto input);
    Task<RequestResponse<bool>> DeleteUser(HouseholdUser entity);
}
