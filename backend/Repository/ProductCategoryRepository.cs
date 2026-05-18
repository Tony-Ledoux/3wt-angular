using System;
using backend.Contexts;
using backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository;

public interface IProductCategoryRepository: IGeneric<ProductCategory>
{
    Task<IEnumerable<ProductCategory>> GetAllWithStorageRulesAsync();
}

public class ProductCategoryRepository(KitchenDbContext db) : Generic<ProductCategory>(db), IProductCategoryRepository
{
    public async Task<IEnumerable<ProductCategory>> GetAllWithStorageRulesAsync()
    {
        return await _dbSet.Include(x=>x.StorageRules).ToListAsync();
    }
}
