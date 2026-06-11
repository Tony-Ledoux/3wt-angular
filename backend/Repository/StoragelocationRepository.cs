using System;
using System.Security.Cryptography;
using backend.Contexts;
using backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository;

public interface IStoragelocationRepository : IGeneric<StorageLocation>
{
    Task<IEnumerable<StorageLocation>> GetStorageLocationsByHouseholdIdAsync(int householdId);
    Task<bool> DoesStorageLocationExists(int householdId, string storagelocationName);
}
public class StoragelocationRepository(KitchenDbContext db) : Generic<StorageLocation>(db), IStoragelocationRepository
{
    public async Task<bool> DoesStorageLocationExists(int householdId, string storagelocationName)
    {
        return await _dbSet.AnyAsync(sl => sl.HouseholdId == householdId && sl.Name == storagelocationName);
    }

    public async Task<IEnumerable<StorageLocation>> GetStorageLocationsByHouseholdIdAsync(int householdId)
    {
        return await _dbSet.Where(sl => sl.HouseholdId == householdId).Include(sl => sl.DeviceType).Include(x => x.InventoryItems).ToListAsync();
    }
}
