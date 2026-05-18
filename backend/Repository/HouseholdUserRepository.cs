using System;
using backend.Contexts;
using backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository;

public interface IHouseholdUserRepository: IGeneric<HouseholdUser>
{
    Task<IEnumerable<HouseholdUser>> GetHouseholdUsersForTokenId(string token);
    Task<HouseholdUser?> FindUserByIdAndHouseholdId(string id, int householdId);
    Task<HouseholdUser?> FindUserByIdAndHouseholdIdWithhousehold(string id, int householdId);
}

public class HouseholdUserRepository(KitchenDbContext db) : Generic<HouseholdUser>(db), IHouseholdUserRepository
{
    public async Task<HouseholdUser?> FindUserByIdAndHouseholdId(string id, int householdId)
    {
       return await _dbSet.FirstOrDefaultAsync(u=>u.UserId == id && u.HouseholdId == householdId);
    }

    public async Task<HouseholdUser?> FindUserByIdAndHouseholdIdWithhousehold(string id, int householdId)
    {
        return await _dbSet.Include(hu=>hu.Household).FirstOrDefaultAsync(u=>u.UserId == id && u.HouseholdId == householdId);
    }
    

    public async Task<IEnumerable<HouseholdUser>> GetHouseholdUsersForTokenId(string token)
    {
        return await _dbSet.Where(hu=>hu.UserId == token).Include(hu=>hu.Household).ToListAsync();
    }
}
