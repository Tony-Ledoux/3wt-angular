using System;
using backend.Contexts;
using backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository;

public interface IStoragelocationRepository
{
    Task<IEnumerable<StorageLocation>> GetStorageLocationsByHouseholdIdAsync(int householdId);
}
public class StoragelocationRepository(KitchenDbContext db) : Generic<StorageLocation>(db), IStoragelocationRepository
{
    public async Task<IEnumerable<StorageLocation>> GetStorageLocationsByHouseholdIdAsync(int householdId)
    {
        return await _dbSet.Where(sl=>sl.HouseholdId == householdId).Include(sl=>sl.DeviceType).Include(x=>x.InventoryItems).ToListAsync();
    }
}
