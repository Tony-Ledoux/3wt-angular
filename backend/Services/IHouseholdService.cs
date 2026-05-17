using System;
using backend.Entities;
using backend.Models;

namespace backend.Services;

public interface IHouseholdService
{
    public Task<Household?> GetHouseholdWithUsersByIdAsync(int id);
    public Task<RequestResponse<bool>> DeleteHouseholdWithAllUsersAsync(Household entity);

    public Task<RequestResponse<Household>> GenerateNewInviteCode(Household entity);
    public Task<RequestResponse<Household>> ToggleIsOpenForInvite(Household entity);
    public Task<RequestResponse<bool>> DeleteHouseholdUserAsync(string userid, int householdId);
    
}
