//KitchenDbContext
using System.Linq.Expressions;
using backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.DbContexts;

public class KitchenDbContext(DbContextOptions<KitchenDbContext> options) : DbContext(options)
{
    public DbSet<Household> Households { get; set; }
    public DbSet<HouseholdUser> HouseholdUsers {get;set;}

    public override int SaveChanges()
    {
        var entries = ChangeTracker
            .Entries().Where(e => e.Entity is BaseEntity && (e.State == EntityState.Added || e.State == EntityState.Modified || e.State == EntityState.Deleted));
        foreach (var entry in entries)
        {
            var entity = (BaseEntity)entry.Entity;
            if (entry.State == EntityState.Added)
            {
                entity.CreatedAt = DateTime.UtcNow;
            }
            else if (entry.State == EntityState.Modified)
            {
                entity.UpdatedAt = DateTime.UtcNow;
            }
            else if (entry.State == EntityState.Deleted)
            {
                entry.State = EntityState.Modified;
                entity.DeletedAt = DateTime.UtcNow;
            }
        }
        return base.SaveChanges();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (typeof(BaseEntity).IsAssignableFrom(entityType.ClrType))
            {
                modelBuilder.Entity(entityType.ClrType).HasQueryFilter(
                    GenerateIsNotNullFilter(entityType.ClrType)
                );
            }
        }
    }

    private static LambdaExpression GenerateIsNotNullFilter(Type type)
    {
        var parameter = Expression.Parameter(type, "e");
        var property = Expression.Property(parameter, nameof(BaseEntity.DeletedAt));
        var compare = Expression.Equal(property, Expression.Constant(null));
        return Expression.Lambda(compare, parameter);
    }
}
