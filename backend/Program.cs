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

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDev", policy =>
    {
        policy.WithOrigins("http://localhost:4200","http://localhost:8000","http://192.168.1.21:8000")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddScoped<IUserService, UserService>();


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

app.MapControllers();

app.Run();
