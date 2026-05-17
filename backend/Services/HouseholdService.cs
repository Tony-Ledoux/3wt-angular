using System;
using backend.Contexts;
using backend.Entities;
using backend.Mappers;
using backend.Models;
using backend.Repository;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;
public interface IHouseholdService
{
    public Task<Household?> GetHouseholdWithUsersByIdAsync(int id);
    public Task<bool> DeleteHouseholdWithAllUsersAsync(int householdId);

    public Task<RequestResponse<HouseholdDto>> GenerateNewInviteCode(Household entity);
    public Task<RequestResponse<HouseholdDto>> ToggleIsOpenForInvite(Household entity);
    public Task<RequestResponse<bool>> DeleteHouseholdUserAsync(string userid, int householdId);
    
}

public class HouseholdService(KitchenDbContext context,
 IInviteCodeGenerator gen,
  IMapper<Household, HouseholdDto> mapper,
   IHouseholdRepository hh_repo,
   IHouseholdUserRepository hu_repo) : IHouseholdService
{
    private readonly KitchenDbContext _db = context;
    private readonly IInviteCodeGenerator _gen = gen;
    private readonly IMapper<Household, HouseholdDto> _mapper = mapper;
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

    public async Task<RequestResponse<HouseholdDto>> GenerateNewInviteCode(Household entity)
    {
        try
        {
            var code = await _gen.GenerateAsync();
            entity.InviteCode = code;
            await _db.SaveChangesAsync();
            return new RequestResponse<HouseholdDto>().Ok(_mapper.Map(entity));
        } catch
        {
            return new RequestResponse<HouseholdDto>().Failure("Er gebeurde een fout");
        }
    }

    public async Task<Household?> GetHouseholdWithUsersByIdAsync(int id)
    {
        return await _db.Households.Include(h => h.HouseholdUsers).FirstOrDefaultAsync(h => h.Id == id);
    }

    public async Task<RequestResponse<HouseholdDto>> ToggleIsOpenForInvite(Household entity)
    {
        try
        {
            entity.IsOpenForInvite = !entity.IsOpenForInvite;
            await _db.SaveChangesAsync();
            var dto = _mapper.Map(entity);
            return new RequestResponse<HouseholdDto>().Ok(dto);
        }catch (Exception)
        {
            return new RequestResponse<HouseholdDto>().Failure("error");
        }
    }
}
