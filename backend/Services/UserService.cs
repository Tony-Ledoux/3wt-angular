using System;
using System.Collections.Immutable;
using backend.Contexts;
using backend.Entities;
using backend.Extentions;
using backend.Models;
using backend.Models.Create;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class UserService(KitchenDbContext context, IInviteCodeGenerator gencode) : IUserService
{
    private readonly KitchenDbContext _db = context;
    private readonly IInviteCodeGenerator _gen = gencode;

    public async Task<IEnumerable<HouseholdUser>> GetHouseholdUsersAsync(string id)
    {
        // i want to use a memorycache here
        return await _db.HouseholdUsers.Where(hu => hu.UserId == id).Include(hu => hu.Household).ToListAsync();
    }


    public async Task<RequestResponse<HouseholdUser>> CreateNewHousholdAndUser(string id, HouseholdCreationDto input)
    {
        if(input == null) return new RequestResponse<HouseholdUser>().Failure("Gelieve mij data te geven");

        // create a new Household
        var household_new = input.ToEntity();

        //generate a new invitecode
        household_new.InviteCode = await _gen.GenerateAsync();

        _db.Add(household_new);
        // create a new HousholdUser // this is the owner, Need to insert HouseholdId Here

        var HouseholdUser = new HouseholdUser()
        {
            UserId = id,
            Household = household_new,
            HouseholdOwner = true
        };
        _db.Add(HouseholdUser);
        await _db.SaveChangesAsync();
        return new RequestResponse<HouseholdUser>().Ok(HouseholdUser);
    }

   

    async public Task<RequestResponse<HouseholdUser>> JoinByInviteCode(string id, InviteRequestCodeDto input)
    {
        // find the household
        var houshold = await _db.Households.Include(h=>h.HouseholdUsers).FirstOrDefaultAsync(h => h.Name == input.Name && h.InviteCode == input.InviteCode && h.IsOpenForInvite == true);
        if (houshold == null)
        {
            return new RequestResponse<HouseholdUser>().Failure("Geen huishouden gevonden met deze code dat invites accepteerd").SetIsNotFound();
        }
        //check of gebruiker nog geen lid
        if (houshold.HouseholdUsers.Any(hu=>hu.UserId == id))
        {
            return new RequestResponse<HouseholdUser>().Failure("Je bent al lid van dit huishouden").SetIsConflict();
        }
        var HouseholdUser = new HouseholdUser()
        {
            UserId = id,
            Household = houshold,
            HouseholdOwner = false
        };
        _db.Add(HouseholdUser);
        await _db.SaveChangesAsync();
        return new RequestResponse<HouseholdUser>().Ok(HouseholdUser);

    }
}
