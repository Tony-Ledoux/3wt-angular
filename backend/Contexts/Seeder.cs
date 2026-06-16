using System;
using backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Contexts;

public static class Seeder
{

    public static async Task SeedDevicesAsync(KitchenDbContext context)
    {
        if (await context.DeviceTypes.AnyAsync()) return;
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
        if (await context.SystemSettings.AnyAsync()) return;
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
        if (await context.ProductCategories.AnyAsync()) return; // als er al data is sla seeding over
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
        if (await context.Products.AnyAsync()) return;
        var categories = await context.ProductCategories.ToListAsync();
        // 2. Helper functie die alleen een categorie teruggeeft als deze echt bestaat
        // We gebruiken een List om de koppelingen veilig op te bouwen
        List<ProductCategory> GetCategories(params string[] names)
        {
            return [.. categories.Where(c => names.Contains(c.Category))];
        }
        var products = new List<Product>
        {
            new(){ProductName="Melk", IsGlobal=true, ProductCategories=GetCategories("Zuivel")},
            new(){ProductName="Eieren", IsGlobal=true, ProductCategories=GetCategories("Zuivel"), ShelfLifeClosedMinutes=40320,ShelfLifeOpenedMinutes=15},
            new(){ProductName="Allesreiniger", IsGlobal=false, ProductCategories=GetCategories("Schoonmaak")},
            new(){ProductName="Gehakt", IsGlobal=true, ProductCategories=GetCategories("Vlees"), ShelfLifeOpenedMinutes=30, ShelfLifeClosedMinutes=120},
        };

        context.Products.AddRange(products);
        await context.SaveChangesAsync();
    }
    public static async Task SeedStorageRulesAsync(KitchenDbContext context)
    {
        if (await context.StorageRules.AnyAsync()) return;

        // 1. Haal de types en categorieën op uit de database om de ID's te kunnen koppelen
        var devices = await context.DeviceTypes.ToListAsync();
        var categories = await context.ProductCategories.ToListAsync();

        // Helper functies om snel het ID te vinden op basis van de naam
        // We gebruiken .FirstOrDefault() om crashes te voorkomen als een type mist
        int? GetDeviceId(string name) => devices.FirstOrDefault(d => d.Type == name)?.Id;
        int? GetCategoryId(string name) => categories.FirstOrDefault(c => c.Category == name)?.Id;

        // 2. Definieer de regels: Welke categorie hoort in welk apparaat en wat is de multiplier?
        // De multiplier kan bijvoorbeeld betekenen: 0.1 = gaat 10x langer mee (vriezer), 1.0 = normaal.
        var ruleDefinitions = new List<(string Device, string Category, double Multiplier)>
    {
            ("Diepvries", "Vlees", 1080),
            ("Diepvries", "Groenten", 10.0),
            ("Diepvries", "Fruit", 12.0),
            ("Diepvries", "Zuivel", 0.01),
            ("Diepvries", "Schoonmaak", 1.0),
            ("Diepvries", "Dranken", 1.0),
            ("Koelkast", "Vlees", 32),
            ("Koelkast", "Groenten", 1.2),
            ("Koelkast", "Fruit", 1.2),
            ("Koelkast", "Zuivel", 2.5),
            ("Koelkast", "Schoonmaak", 1.0),
            ("Koelkast", "Dranken", 1.0),
            ("Voorraadkast", "Groenten", 0.5),
            ("Voorraadkast", "Fruit", 0.8),
            ("Voorraadkast", "Zuivel", 1.0) ,
            ("Voorraadkast", "Vlees", 0.1),
            ("Voorraadkast", "Schoonmaak", 1.0),
            ("Voorraadkast", "Dranken", 1.0),
    };

        var storageRules = new List<StorageRule>();

        foreach (var def in ruleDefinitions)
        {
            var deviceId = GetDeviceId(def.Device);
            var catId = GetCategoryId(def.Category);

            // Alleen toevoegen als beide ID's daadwerkelijk gevonden zijn in de DB
            if (deviceId.HasValue && catId.HasValue)
            {
                storageRules.Add(new StorageRule
                {
                    DeviceTypeId = deviceId.Value,
                    ProductCategoryId = catId.Value,
                    Multiplier = def.Multiplier
                });
            }
        }

        context.StorageRules.AddRange(storageRules);
        await context.SaveChangesAsync();
    }

}
