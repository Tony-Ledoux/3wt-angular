using System.Security.Claims;

using backend.Extentions;
using backend.Models;
using backend.Models.Create;
using backend.Services;
using Microsoft.AspNetCore.Authorization;

using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api")]
    [ApiController]
    [Authorize]
    public class HouseHoldUserController(IUserService srv_user) : ControllerBase
    {
        private readonly IUserService _us = srv_user;
        [HttpGet("users/me")]
        public async Task<ActionResult<IEnumerable<HouseholdUserDto>>> GetMeAndMyHouseHolds()
        {
            var auth0Id = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _us.GetHouseholdUsersAsync(auth0Id);
            return Ok(result.ToDtoList());
        }

        [HttpPost("setup")]
        public async Task<ActionResult<HouseholdUserDto>> CreateNewHouseHold(HouseholdCreationDto request)
        {
            var result = await _us.CreateNewHousholdAndUser(User.FindFirstValue(ClaimTypes.NameIdentifier),request);
            return Created("",result.ToDto());
        }
    }
}
