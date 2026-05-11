using System.Security.Claims;
using backend.DbContexts;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api")]
    [ApiController]
    [Authorize]
    public class HouseHoldUserController(KitchenDbContext dbContext, IUserService srv_user) : ControllerBase
    {
        private readonly KitchenDbContext _db = dbContext;
        private readonly IUserService _us = srv_user;
        [HttpGet("users/me")]
        public async Task<IActionResult> GetMeAndMyHouseHolds()
        {
            // gM86l7qBcQNIDqW6ARf7Pta2OAWjX1nQ@clients
            var auth0Id = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if(auth0Id == null)
            {
                return Forbid();
            }
            var result = await _us.GetHouseholdUsersAsync(auth0Id);
            return Ok(result);
        }
    }
}
