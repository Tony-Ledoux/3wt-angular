using System;
using backend.Contexts;
using backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository;

public interface IHouseholdRepository: IGeneric<Household>
{
   Task<Household?> FindInviteOpenHouseholdByNameAndInviteCodeWithUsersAsync(string naam, string invitercode);
   Task<Household?> GetHouseholdAndUsersByHouseholdIdAsync(int id);
}

public class HouseholdRepository(KitchenDbContext db) : Generic<Household>(db), IHouseholdRepository
{
    public async Task<Household?> FindInviteOpenHouseholdByNameAndInviteCodeWithUsersAsync(string naam, string invitercode)
    {
       var result = await _dbSet.Include(h => h.HouseholdUsers).FirstOrDefaultAsync(h => h.Name == naam && h.InviteCode == invitercode && h.IsOpenForInvite == true);
       return result;
    }

    public async Task<Household?> GetHouseholdAndUsersByHouseholdIdAsync(int id)
    {
        return await _dbSet.Include(x=>x.HouseholdUsers).FirstOrDefaultAsync(h=>h.Id==id);
    }
}
