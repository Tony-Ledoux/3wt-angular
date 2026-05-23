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
        }; 
        context.ProductCategories.AddRange(categories);
        await context.SaveChangesAsync();
    }

    public static async Task SeedProductsAsync(KitchenDbContext context)
    {
        if(await context.Products.AnyAsync()) return;
        var products = new List<Product>
        {
            new(){ProductName="Melk", IsGlobal=true},
            new(){ProductName="Eieren", IsGlobal=true},
            new(){ProductName="Allesreiniger", IsGlobal=false},
            new(){ProductName="Gehakt", IsGlobal=true},
        };
        context.Products.AddRange(products);
        await context.SaveChangesAsync();
    }
}
