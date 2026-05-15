using System;
using backend.Contexts;

namespace backend.Services;

public class HouseholdService(KitchenDbContext context) : IHouseholdService
{
    private readonly KitchenDbContext _db= context;

}
