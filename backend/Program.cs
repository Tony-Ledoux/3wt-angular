using System.Security.Claims;
using backend.DbContexts;
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
        NameClaimType= ClaimTypes.Name,
        RoleClaimType= $"{options.Audience}/roles"
    };

});

builder.Services.AddScoped<IUserService, UserService>();


builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

//app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
