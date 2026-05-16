//KitchenDbContext
using System.Linq.Expressions;
using backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Contexts;

public class KitchenDbContext(DbContextOptions<KitchenDbContext> options) : DbContext(options)
{
    public DbSet<Household> Households { get; set; }
    public DbSet<HouseholdUser> HouseholdUsers {get;set;}
    public DbSet<DeviceType> DeviceTypes {get;set;}
    public DbSet<StorageLocation> StorageLocations {get;set;}
    public DbSet<StorageRule> StorageRules {get;set;}
    public DbSet<ProductCategory> ProductCategories {get;set;}
    public DbSet<Product> Products {get;set;}
    public DbSet<Inventory> Inventories {get;set;}
    public DbSet<RecipeIngredient> RecipeIngredients {get;set;}
    public DbSet<Recipe> Recipes {get;set;}
    public DbSet<RecipeCategory> Categories {get;set;}
    public DbSet<Weekmenu> Weekmenus {get;set;}
    public DbSet<Shoppinglist> Shoppinglists {get;set;}

    public DbSet<SystemSetting> SystemSettings {get;set;}
    
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
        modelBuilder.Entity<ProductCategory>().HasMany(pc=>pc.Products).WithMany(p=>p.ProductCategories).UsingEntity<ProductCategoryMapping>();
        modelBuilder.Entity<Recipe>().HasMany(r=>r.Categories).WithMany(c=>c.Recipes).UsingEntity<RecipeCategoryMapping>();

        modelBuilder.Entity<SystemSetting>().HasData([
            new SystemSetting(){
                Id=1,
                Key="MaxHouseholdsPerUser",
                Value="5",
                Description="The maximum number of households a user can be part of.",
                CreatedAt=new DateTime(2020,1,1,0,0,0).ToUniversalTime()
                },
            new SystemSetting(){
                Id=2,
                Key = "MaxUserOwns",
                Value = "2",
                Description = "The maximum number of households a user can own (this may not be higer than MaxHouseholdsPerUser)",
                CreatedAt=new DateTime(2020,1,1,0,0,0).ToUniversalTime()
            },
            new SystemSetting(){
                Id=3,
                Key = "MaxInviteCodeLenght",
                Value = "6",
                Description = "The max Lenght of a  invite code",
                CreatedAt=new DateTime(2020,1,1,0,0,0).ToUniversalTime()},
            new SystemSetting(){
                Id=4,
                Key = "AllowedCharsInvite",
                Value = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789#?!",
                Description = "The Characters an invite code can consist of",
                CreatedAt=new DateTime(2020,1,1,0,0,0).ToUniversalTime()
            }
        ]);
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
