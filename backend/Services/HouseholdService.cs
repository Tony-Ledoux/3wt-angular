using System;
using backend.Contexts;
using backend.Entities;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class HouseholdService(KitchenDbContext context, IInviteCodeGenerator gen) : IHouseholdService
{
    private readonly KitchenDbContext _db = context;
    private readonly IInviteCodeGenerator _gen = gen;

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

    public async Task<RequestResponse<bool>> DeleteHouseholdWithAllUsersAsync(Household entity)
    {
        try
        {
            foreach (var user in entity.HouseholdUsers)
            {
                _db.Remove(user);
            }
            _db.Remove(entity);
            await _db.SaveChangesAsync();
            return new RequestResponse<bool>().Ok(true);
        } catch (Exception)
        {
            return new RequestResponse<bool>().Failure("Er gebeurde een fout");
        }
    }

    public async Task<RequestResponse<Household>> GenerateNewInviteCode(Household entity)
    {
        try
        {
            var code = await _gen.GenerateAsync();
            entity.InviteCode = code;
            await _db.SaveChangesAsync();
            return new RequestResponse<Household>().Ok(entity);
        } catch
        {
            return new RequestResponse<Household>().Failure("Er gebeurde een fout");
        }
    }

    public async Task<Household?> GetHouseholdWithUsersByIdAsync(int id)
    {
        return await _db.Households.Include(h => h.HouseholdUsers).FirstOrDefaultAsync(h => h.Id == id);
    }

    public async Task<RequestResponse<Household>> ToggleIsOpenForInvite(Household entity)
    {
        try
        {
            entity.IsOpenForInvite = !entity.IsOpenForInvite;
            await _db.SaveChangesAsync();
            return new RequestResponse<Household>().Ok(entity);
        }catch (Exception)
        {
            return new RequestResponse<Household>().Failure("error");
        }
    }
}
