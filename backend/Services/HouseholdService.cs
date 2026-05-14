using System;
using backend.DbContexts;

namespace backend.Services;

public class HouseholdService(KitchenDbContext context) : IHouseholdService
{
    private readonly KitchenDbContext _db= context;

}
