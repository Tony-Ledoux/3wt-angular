using System;
using backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Contexts;

public static class Seeder
{

    public static async Task SeedDevicesAsync(KitchenDbContext context)
    {
        if(await context.DeviceTypes.AnyAsync()) return;
        var deviceTypes = new List<DeviceType>
        {
            new() {Type = "Diepvries"},
            new() {Type = "Koelkast"},
            new() {Type = "Voorraadkast"},
        };
        context.DeviceTypes.AddRange(deviceTypes);
        await context.SaveChangesAsync();
    }

    public static async Task SeedSystemSettings(KitchenDbContext context)
    {
        if(await context.SystemSettings.AnyAsync()) return;
        var settings = new List<SystemSetting>
        {
            new() {Key="MaxHouseholdsPerUser" , Value="5" , Description="The maximum number of households a user can be part of."},
            new() {Key="MaxUserOwns" , Value="2" , Description="The maximum number of households a user can own (this may not be higer than MaxHouseholdsPerUser)"},
            new() {Key="MaxInviteCodeLenght" , Value="6" , Description="The max Lenght of a  invite code"},
            new() {Key="AllowedCharsInvite" , Value="ABCDEFGHJKLMNPQRSTUVWXYZ23456789#?!" , Description="The Characters an invite code can consist of"},
        };
        context.SystemSettings.AddRange(settings);
        await context.SaveChangesAsync();
    }

    public static async Task SeedProductCategoriesAsync(KitchenDbContext context)
    {
        if(await context.ProductCategories.AnyAsync()) return; // als er al data is sla seeding over
        var categories = new List<ProductCategory>
        {
            new() {Category = "Groenten"},
            new() {Category = "Fruit"},
            new() {Category = "Zuivel"},
            new() {Category = "Schoonmaak"},
            new() {Category = "Dranken"},
            new() {Category = "Vlees"}
        }; 
        context.ProductCategories.AddRange(categories);
        await context.SaveChangesAsync();
    }

    public static async Task SeedProductsAsync(KitchenDbContext context)
    {
        if(await context.Products.AnyAsync()) return;
        var categories = await context.ProductCategories.ToListAsync();
        // 2. Helper functie die alleen een categorie teruggeeft als deze echt bestaat
        // We gebruiken een List om de koppelingen veilig op te bouwen
        List<ProductCategory> GetCategories(params string[] names)
        {
            return categories
                .Where(c => names.Contains(c.Category))
                .ToList();
        }
        var products = new List<Product>
        {
            new(){ProductName="Melk", IsGlobal=true, ProductCategories=GetCategories("Zuivel")},
            new(){ProductName="Eieren", IsGlobal=true, ProductCategories=GetCategories("Zuivel")},
            new(){ProductName="Allesreiniger", IsGlobal=false, ProductCategories=GetCategories("Schoonmaak")},
            new(){ProductName="Gehakt", IsGlobal=true, ProductCategories=GetCategories("Vlees")},
        };
        for (int i = 0; i < 2000; i++)
        {
            products.Add(new Product{ProductName=$"product{i}", IsGlobal=true});
        }
        context.Products.AddRange(products);
        await context.SaveChangesAsync();
    }
}
