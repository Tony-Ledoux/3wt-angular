using System;
using System.Collections;
using backend.Contexts;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository;

public interface IGeneric<T> where T : class
{
    Task<T?> GetByIdAsync(int id);
    Task<IEnumerable<T>> GetAllAsync();
    Task AddAsync(T entity);
    void Update(T entity);
    void Delete(T entity);
    Task<bool> SaveChangesAsync();
}

public class Generic<T>(KitchenDbContext db) : IGeneric<T> where T :class
{
    private readonly KitchenDbContext _db = db;
    protected readonly DbSet<T> _dbSet = db.Set<T>();

    public async Task<T?> GetByIdAsync(int id) => await _dbSet.FindAsync(id);
 
    public async Task<IEnumerable<T>> GetAllAsync() => await _dbSet.ToListAsync();

    public async Task AddAsync(T entity) => await _dbSet.AddAsync(entity);

    public void Update(T entity) => _dbSet.Update(entity);

    public void Delete(T entity) => _dbSet.Remove(entity);

    public async Task<bool> SaveChangesAsync() => await _db.SaveChangesAsync() > 0;
}