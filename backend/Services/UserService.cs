using System;
using backend.DbContexts;
using backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class UserService(KitchenDbContext context) : IUserService
{
    private readonly KitchenDbContext _db = context;

    async public Task<IEnumerable<HouseholdUser>> GetHouseholdUsersAsync(string id)
    {
        return await _db.HouseholdUsers.Where(hu=>hu.UserId == id).ToListAsync();
    }
}
