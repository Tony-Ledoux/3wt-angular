using System;
using backend.Contexts;
using backend.Entities;
using backend.Mappers;
using backend.Models;
using backend.Models.Update;
using backend.Repository;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;
public interface IHouseholdService
{
    public Task<HouseholdWithUsersDto?> GetHouseholdWithUsersByIdAsync(int id);
    public Task<bool> DeleteHouseholdWithAllUsersAsync(int householdId);

    public Task<HouseholdUserDto?> UpdateHouseholdWithUser(HouseholdUpdateDto input, int householdId, string userId);

    public Task<RequestResponse<HouseholdDto>> GenerateNewInviteCode(int householdId);
    public Task<RequestResponse<HouseholdDto>> ToggleIsOpenForInvite(int householdId);
    public Task<RequestResponse<bool>> DeleteHouseholdUserAsync(string userid, int householdId);
    
}

public class HouseholdService(KitchenDbContext context,
 IInviteCodeGenerator gen,
  IHouseholdMapper mapper,
   IHouseholdRepository hh_repo,
   IMapper<HouseholdUser, HouseholdUserDto> hu_mapper,
   IHouseholdUserRepository hu_repo) : IHouseholdService
{
    private readonly KitchenDbContext _db = context;
    private readonly IInviteCodeGenerator _gen = gen;
    private readonly IHouseholdMapper _mapper = mapper;
    private readonly IMapper<HouseholdUser, HouseholdUserDto> _usermapper= hu_mapper;
    private readonly IHouseholdRepository repo= hh_repo;
    private readonly IHouseholdUserRepository repo_hu = hu_repo;


    public async Task<RequestResponse<bool>> DeleteHouseholdUserAsync(string userid, int householdId)
    {
        var user = await _db.HouseholdUsers.FirstOrDefaultAsync(hu=>hu.UserId == userid && hu.HouseholdId == householdId );
        if (user == null) return new RequestResponse<bool>().Failure("Not found").SetIsNotFound();
        try
        {
            _db.Remove(user);
            await _db.SaveChangesAsync();
            return new RequestResponse<bool>().Ok(true);
        } catch (Exception)
        {
            return new RequestResponse<bool>().Failure("");
        }
    }

    public async Task<bool> DeleteHouseholdWithAllUsersAsync(int householdId)
    {
        var householdAndUsers = await repo.GetHouseholdAndUsersByHouseholdIdAsync(householdId);
        if(householdAndUsers == null) return false;
        foreach (var user in householdAndUsers.HouseholdUsers)
        {
            repo_hu.Delete(user);
        }
        repo.Delete(householdAndUsers);
        return await repo.SaveChangesAsync();

    }

    public async Task<RequestResponse<HouseholdDto>> GenerateNewInviteCode(int householdId)
    {
        var h = await repo.GetByIdAsync(householdId);
        if(h == null) return new RequestResponse<HouseholdDto>().SetIsNotFound().Failure("Niet gevonden");
        var code = await _gen.GenerateAsync();
        h.InviteCode = code;
        var success = await repo.SaveChangesAsync();
        if(!success) return new RequestResponse<HouseholdDto>().Failure("");
        return new RequestResponse<HouseholdDto>().Ok(_mapper.Map(h));
    }

    public async Task<HouseholdWithUsersDto?> GetHouseholdWithUsersByIdAsync(int id)
    {
        var entity = await _db.Households.Include(h => h.HouseholdUsers).FirstOrDefaultAsync(h => h.Id == id);
        if(entity == null) return null;
        return _mapper.MapWithUsers(entity);
    }

    public async Task<RequestResponse<HouseholdDto>> ToggleIsOpenForInvite(int householdId)
    {
        var h = await repo.GetByIdAsync(householdId);
        if(h == null) return new RequestResponse<HouseholdDto>().SetIsNotFound().Failure("");
        h.IsOpenForInvite = !h.IsOpenForInvite;
        var success = await repo.SaveChangesAsync();
        if(!success) return new RequestResponse<HouseholdDto>().Failure("");
        return new RequestResponse<HouseholdDto>().Ok(_mapper.Map(h));

    }

    public async Task<HouseholdUserDto?> UpdateHouseholdWithUser(HouseholdUpdateDto input, int householdId, string userId)
    {
        // get the user and household
       var user = await repo_hu.FindUserByIdAndHouseholdIdWithhousehold(userId, householdId);
       if(user == null) return null;
       //update the household
       user.Household.Name = input.Name;
       user.Household.Address = input.Address;
       var success = await repo_hu.SaveChangesAsync();
       if(!success) return null;
       return _usermapper.Map(user);
    }
}
