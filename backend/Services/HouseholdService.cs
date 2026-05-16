using System;
using backend.Contexts;
using backend.Entities;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class HouseholdService(KitchenDbContext context) : IHouseholdService
{
    private readonly KitchenDbContext _db = context;

    public async Task<RequestResponse<bool>> DeleteHouseholdWithAllUsersAsync(Household entity)
    {
        try
        {
            foreach (var user in entity.HouseholdUsers)
            {
                _db.Remove(user);
            }
            _db.Remove(entity);
            await _db.SaveChangesAsync();
            return new RequestResponse<bool>().Ok(true);
        } catch (Exception)
        {
            return new RequestResponse<bool>().Failure("Er gebeurde een fout");
        }
    }

    public async Task<Household?> GetHouseholdWithUsersByIdAsync(int id)
    {
        return await _db.Households.Include(h => h.HouseholdUsers).FirstOrDefaultAsync(h => h.Id == id);
    }
}
