using System;
using backend.Entities;
using backend.Models;
using backend.Models.Create;

namespace backend.Services;

public interface IUserService
{
    Task<IEnumerable<HouseholdUser>> GetHouseholdUsersAsync(string id);
    Task<RequestResponse<HouseholdUser>> CreateNewHousholdAndUser(string id, HouseholdCreationDto input);

    Task<RequestResponse<HouseholdUser>> JoinByInviteCode(string id, InviteRequestCodeDto input);
}
