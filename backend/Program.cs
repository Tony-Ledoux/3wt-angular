using System.Security.Claims;
using backend.Contexts;
using backend.Entities;
using backend.Mappers;
using backend.Middleware;
using backend.Models;
using backend.Repository;
using backend.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<KitchenDbContext>(DbContextOptions =>
{
    DbContextOptions.UseNpgsql(builder.Configuration.GetConnectionString("Default"));
    DbContextOptions.UseSnakeCaseNamingConvention();
});

builder.Services.AddAuthentication().AddJwtBearer(options =>
{
    var auth0 = builder.Configuration.GetSection("Auth0");
    options.Authority = $"https://{auth0.GetValue<string>("domain")}/";
    options.Audience = auth0.GetValue<string>("audience");
    options.TokenValidationParameters = new TokenValidationParameters
    {
        NameClaimType = ClaimTypes.Name,
        RoleClaimType = $"{options.Audience}/roles"
    };

});

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDev", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "http://localhost:8000", "http://localhost")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddSingleton<ISystemSettingsServce, SystemSettingsService>();
// Repos
builder.Services.AddScoped(typeof(IGeneric<>),typeof(Generic<>));
builder.Services.AddScoped<IStoragelocationRepository, StoragelocationRepository>();
builder.Services.AddScoped<IHouseholdUserRepository, HouseholdUserRepository>();
builder.Services.AddScoped<IHouseholdRepository, HouseholdRepository>();

//Mappers
builder.Services.AddSingleton<IMapper<DeviceType,DeviceTypeDto>,DeviceTypeMapper>();
builder.Services.AddSingleton<IHouseholdMapper,HouseholdMapper>();
builder.Services.AddSingleton<IMapper<HouseholdUser,HouseholdUserDto>,HouseholdUserMapper>();

//Services
builder.Services.AddScoped<IUserContext, UserContext>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IHouseholdService, HouseholdService>();
builder.Services.AddScoped<IInviteCodeGenerator, InviteCodeGenerator>();
builder.Services.AddScoped<IInventoryService, InventoryService>();

builder.Services.AddControllers().AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    }

    );
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

//app.UseHttpsRedirection();
app.UseCors("AllowAngularDev");

app.UseAuthentication();

app.UseAuthorization();

app.UseMiddleware<UserContextMiddleware>();

app.MapControllers();

// 1. Voer migrations uit
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<KitchenDbContext>();
        
        // Forceer een check
        var pendingMigrations = context.Database.GetPendingMigrations().ToList();
        
        if (pendingMigrations.Any())
        {
            Console.WriteLine($"Found {pendingMigrations.Count} pending migrations. Applying...");
            context.Database.Migrate();
            Console.WriteLine("Database migrations applied successfully.");
        }
        else
        {
            Console.WriteLine("No pending migrations found in the assembly.");
        }
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "CRITICAL: Migration failed.");
        throw; // Stop de app als de DB niet klaar is
    }
}

// 2. LAAD DE SETTINGS BIJ STARTUP
// We doen dit in een aparte scope om zeker te weten dat de migratie-scope is afgesloten
using (var scope = app.Services.CreateScope())
{
    try 
    {
        var settingsService = scope.ServiceProvider.GetRequiredService<ISystemSettingsServce>();
        await settingsService.RefreshAsync();
        Console.WriteLine("System settings loaded successfully.");
    }
    catch (Exception ex)
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Could not load system settings. Table might be missing.");
        // Beslis hier: moet de app crashen of doorgaan? 
        // Meestal wil je dat hij crasht als settings essentieel zijn:
        throw; 
    }
}



app.Run();
