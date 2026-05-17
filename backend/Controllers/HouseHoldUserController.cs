using System.Security.Claims;
using backend.Contexts;
using backend.Entities;

using backend.Models;
using backend.Models.Create;
using backend.Services;
using Microsoft.AspNetCore.Authorization;

using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/users")]
    [ApiController]
    [Authorize]
    public class HouseHoldUserController(IUserService srv_user, IUserContext context) : ControllerBase
    {
        private readonly IUserService _us = srv_user;
        private readonly IUserContext _uc = context;
        [HttpGet("test")]
        public async Task<IActionResult> Test()
        {
            return Ok(_uc);
        }
        [HttpGet("me")]
        public async Task<ActionResult<IEnumerable<HouseholdUserDto>>> GetMeAndMyHouseHolds()
        {
            return Ok(_uc.HouseholdUsers);

        }

        [HttpGet("households/{id:int}")]
        public async Task<ActionResult<HouseholdUserDto>> PartOfThisHousehold(int id)
        {
            if (_uc.HouseholdUsers == null)
            {
                return BadRequest("Geen gebruikersdata gevonden");
            }
            HouseholdUserDto? isMember = _uc.IsCurrentUserInHouseholdWithId(id);
            if (isMember != null)
            {
                return Ok(isMember);
            }
            else
            {
                return Forbid();
            }
        }

        [HttpPost("setup")]
        public async Task<ActionResult<RequestResponse<HouseholdUserDto>>> CreateNewHouseHold(HouseholdCreationDto request)
        {
            // if no body i got 415 error
            var result = await _us.CreateNewHousholdAndUser(_uc.UserId, _uc.Email, request);
            if (result.Success)
            {
                return Created("", result.Data);
            }
            return BadRequest(result.ErrorMessage);
        }

        [HttpPost("households/join")]
        public async Task<ActionResult<HouseholdUserDto>> JoinWithInviteCode(InviteRequestCodeDto request)
        {
            var result = await _us.JoinByInviteCode(_uc.UserId,_uc.Email, request);
            if (result.Success)
            {
                return Ok(result.Data);
            }
            if(result.IsConflict) return Conflict(result.ErrorMessage);
            if(result.IsNotFound) return NotFound(result.ErrorMessage);
            return BadRequest(result.ErrorMessage);
        }
        [HttpDelete("households/{id:int}")]
        public async Task<IActionResult> LeaveHousehold(int id)
        {
            var entity = _uc.IsCurrentUserInHouseholdWithId(id);
            if(entity == null) return Forbid();
            var result = await _us.DeleteUserFromHousehold(entity.Id, entity.HouseholdId);
            if (result.Success)
            {
                _uc.DeleteFromContext(entity);
                return NoContent();
            }
            return Ok(entity);
        }
    }
}
