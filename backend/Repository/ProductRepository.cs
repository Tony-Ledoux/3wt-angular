using System;
using backend.Contexts;
using backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository;

public interface IProductRespository: IGeneric<Product>
{
    Task<(IEnumerable<Product> Items, int TotalCount)> GetPagedProducsAsync(int page, int pageSize, bool? isGlobel, int? categoryId);
    }

public class ProductRepository(KitchenDbContext db) : Generic<Product>(db), IProductRespository
{
    public async Task<(IEnumerable<Product> Items, int TotalCount)> GetPagedProducsAsync(int page, int pageSize, bool? isGlobel, int? categoryId)
    {
        var query = _dbSet.AsQueryable();
        if (isGlobel.HasValue)
        {
            query = query.Where(p=>p.IsGlobal == isGlobel.Value);
        }
        if (categoryId.HasValue)
        {
            query= query.Where(p=> p.ProductCategories.Any(c=>c.Id == categoryId.Value));
        }
        int totalCount = await query.CountAsync();
        var items = await query
            .Skip((page-1)*pageSize)
            .Take(pageSize)
            .ToListAsync();
        
        return (items, totalCount);
    }
}
