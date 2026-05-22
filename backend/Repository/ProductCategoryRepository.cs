using System;
using backend.Contexts;
using backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository;

public interface IProductCategoryRepository: IGeneric<ProductCategory>
{
    Task<IEnumerable<ProductCategory>> GetAllWithStorageRulesAsync();
    Task<bool> ProductCategoryExistsAsync(string name);
    Task<ProductCategory?> GetProductCategoryWithRulesByIdAsync(int id);
}

public class ProductCategoryRepository(KitchenDbContext db) : Generic<ProductCategory>(db), IProductCategoryRepository
{


    public async Task<IEnumerable<ProductCategory>> GetAllWithStorageRulesAsync()
    {
        return await _dbSet.Include(x=>x.StorageRules).ThenInclude(y=>y.DeviceType).ToListAsync();
    }

    public async Task<ProductCategory?> GetProductCategoryWithRulesByIdAsync(int id)
    {
        return  await _dbSet
        .Include(x=>x.StorageRules)
        .ThenInclude(y=>y.DeviceType)
        .FirstOrDefaultAsync(x=>x.Id == id);
    }

    public async Task<bool> ProductCategoryExistsAsync(string name)
    {
        return await _dbSet.AnyAsync(x=>x.Category == name);
    }
}
