using System.Security.Claims;
using backend.Contexts;
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
    public class HouseHoldUserController(IUserService srv_user, IUserContext context) : ControllerBase
    {
        private readonly IUserService _us = srv_user;
        private readonly IUserContext _uc = context;
        [HttpGet("users/me")]
        public async Task<ActionResult<IEnumerable<HouseholdUserDto>>> GetMeAndMyHouseHolds()
        {
            return Ok(_uc.HouseholdUsers.ToDtoList());   

        }

        [HttpPost("setup")]
        public async Task<ActionResult<RequestResponse<HouseholdUserDto>>> CreateNewHouseHold(HouseholdCreationDto request)
        {
            // if no body i got 415 error
            var result = await _us.CreateNewHousholdAndUser(_uc.UserId,request);
            if (result.Success)
            {
                return Created("",result.Data.ToDto());
            }
            return BadRequest(result.ErrorMessage);
        }

        [HttpPost("households/join")]
        public async Task<ActionResult<HouseholdUserDto>> JoinWithInviteCode(InviteRequestCodeDto request)
        {
            var id = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _us.JoinByInviteCode(id,request);
            if (result == null)
            {
                return Forbid("Je kan niet toetreden tot dit huishouden");
            }
            return Ok(result.Data.ToDto());
        }
    }
}
