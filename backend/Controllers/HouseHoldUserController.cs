using System.Security.Claims;
using backend.Contexts;
using backend.Entities;
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

        [HttpGet("users/households/{id:int}")]
        public async Task<ActionResult<HouseholdUserDto>> PartOfThisHousehold(int id)
        {
            if (_uc.HouseholdUsers == null)
            {
                return BadRequest("Geen gebruikersdata gevonden");
            }
            HouseholdUser? isMember = _uc.HouseholdUsers.FirstOrDefault(hu => hu.HouseholdId == id);
            if (isMember != null)
            {
                return Ok(isMember.ToDto());
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
            var result = await _us.CreateNewHousholdAndUser(_uc.UserId, request);
            if (result.Success)
            {
                return Created("", result.Data.ToDto());
            }
            return BadRequest(result.ErrorMessage);
        }

        [HttpPost("households/join")]
        public async Task<ActionResult<HouseholdUserDto>> JoinWithInviteCode(InviteRequestCodeDto request)
        {
            var result = await _us.JoinByInviteCode(_uc.UserId, request);
            if (result.Success)
            {
                return Ok(result.Data.ToDto());
            }
            if(result.IsConflict) return Conflict(result.ErrorMessage);
            if(result.IsNotFound) return NotFound(result.ErrorMessage);
            return BadRequest(result.ErrorMessage);
        }
    }
}
