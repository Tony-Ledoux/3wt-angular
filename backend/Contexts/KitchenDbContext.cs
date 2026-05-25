//KitchenDbContext
using System.Linq.Expressions;
using backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Contexts;

public class KitchenDbContext(DbContextOptions<KitchenDbContext> options) : DbContext(options)
{
    public DbSet<Household> Households { get; set; }
    public DbSet<HouseholdUser> HouseholdUsers { get; set; }
    public DbSet<DeviceType> DeviceTypes { get; set; }
    public DbSet<StorageLocation> StorageLocations { get; set; }
    public DbSet<StorageRule> StorageRules { get; set; }
    public DbSet<ProductCategory> ProductCategories { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<ProductCategoryMapping> ProductCategoryMappings {get;set;}
    public DbSet<Inventory> Inventories { get; set; }
    public DbSet<RecipeIngredient> RecipeIngredients { get; set; }
    public DbSet<Recipe> Recipes { get; set; }
    public DbSet<RecipeCategory> Categories { get; set; }
    public DbSet<Weekmenu> Weekmenus { get; set; }
    public DbSet<Shoppinglist> Shoppinglists { get; set; }

    public DbSet<SystemSetting> SystemSettings { get; set; }

    // Automatic states for softDelete
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
    // Model
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        // Null Query Filter
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (typeof(BaseEntity).IsAssignableFrom(entityType.ClrType))
            {
                modelBuilder.Entity(entityType.ClrType).HasQueryFilter(
                    GenerateIsNotNullFilter(entityType.ClrType)
                );
            }
        }
        modelBuilder.Entity<Product>()
            .HasMany(p => p.ProductCategories)
            .WithMany(pc => pc.Products)
            .UsingEntity<ProductCategoryMapping>(
                l=>l.HasOne(pm=>pm.ProductCategorie).WithMany().HasForeignKey(pm=>pm.ProductCategoryId).IsRequired(false),
                r=>r.HasOne(pm=>pm.Product).WithMany().HasForeignKey(pm=>pm.ProductId).IsRequired(false).OnDelete(DeleteBehavior.Cascade),
                j =>
                {
                    j.HasKey(pm=>new {pm.ProductId, pm.ProductCategoryId});
                    j.ToTable("product_category_mapping");
                }
            );
        modelBuilder.Entity<Recipe>()
            .HasMany(r => r.Categories)
            .WithMany(c => c.Recipes)
            .UsingEntity<RecipeCategoryMapping>(
                l=>l.HasOne(rm=>rm.RecipeCategory).WithMany().HasForeignKey(rm=>rm.RecipeCategoryId).IsRequired(false),
                r=>r.HasOne(rm=>rm.Recipe).WithMany().HasForeignKey(rm=>rm.RecipeId).IsRequired(false).OnDelete(DeleteBehavior.Cascade),
                j =>
                {
                    j.HasKey(rm=>new {rm.RecipeId, rm.RecipeCategoryId});
                    j.ToTable("recipe_category_mapping");
                }
            );

    }

    // Helper function for the Query Filter
    private static LambdaExpression GenerateIsNotNullFilter(Type type)
    {
        var parameter = Expression.Parameter(type, "e");
        var property = Expression.Property(parameter, nameof(BaseEntity.DeletedAt));
        var compare = Expression.Equal(property, Expression.Constant(null));
        return Expression.Lambda(compare, parameter);
    }
}
