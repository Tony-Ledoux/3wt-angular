using System;
using backend.DbContexts;
using backend.Entities;
using backend.Models.Create;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class UserService(KitchenDbContext context) : IUserService
{
    private readonly KitchenDbContext _db = context;


    public async Task<HouseholdUser> CreateNewHousholdAndUser(string id, string email, HouseholdCreationDto input)
    {
        // create a new Household
        var household_new = new Household()
        {
            Name = input.Name,
            Address = input.Address,
            IsOpenForInvite = input.IsOpenForInvite,
            InviteCode = Guid.NewGuid().ToString()
        };
        _db.Add(household_new); 
        // create a new HousholdUser // this is the owner, Need to insert HouseholdId Here

        var HouseholdUser = new HouseholdUser()
        {
            UserId = id,
            Household = household_new,
            HouseholdOwner = true,
            Email = email
        };
        _db.Add(HouseholdUser);
        await _db.SaveChangesAsync();
        return HouseholdUser;
    }

    async public Task<IEnumerable<HouseholdUser>> GetHouseholdUsersAsync(string id)
    {
        return await _db.HouseholdUsers.Where(hu=>hu.UserId == id).Include(hu=>hu.Household).ToListAsync();
    }
}
