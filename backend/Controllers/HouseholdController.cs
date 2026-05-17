using backend.Contexts;
using backend.Extentions;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration.UserSecrets;

namespace backend.Controllers
{
    [Route("api/households")]
    [Authorize]
    [ApiController]
    public class HouseholdController(IUserContext userContext, IHouseholdService service) : ControllerBase
    {
        private readonly IUserContext _uc= userContext;
        private readonly IHouseholdService _hs = service;

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteHousehold(int id)
        {
            var householdUser = _uc.HouseholdUsers.FirstOrDefault(hu=>hu.HouseholdId == id);
            var isOwner = householdUser?.HouseholdOwner ?? false;
            if (isOwner)
            {
                var result = await _hs.GetHouseholdWithUsersByIdAsync(id);
                var deleted = await _hs.DeleteHouseholdWithAllUsersAsync(result);
                if(deleted.Success) return NoContent();
                return BadRequest();  
            }
            return Forbid();
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetHouseholdDetails(int id)
        {
            var households = _uc.HouseholdUsers.Any(hu=>hu.HouseholdId == id && hu.HouseholdOwner==true);
            if(!households) return Forbid();
            var details = await _hs.GetHouseholdWithUsersByIdAsync(id);
            return Ok(details.ToDetailsDto());

        }

        [HttpPost("{householdId:int}/generateinvitecode")]
        public async Task<ActionResult<RequestResponse<HouseholdDto>>> GetNewInvitecode(int householdId)
        {
            var household = _uc.HouseholdUsers.FirstOrDefault(hu=>hu.HouseholdId == householdId && hu.HouseholdOwner==true)?.Household;
            if(household == null) return Forbid();
            var result = await _hs.GenerateNewInviteCode(household);
            if(result.Success) return Ok(result.Data.ToDto());
            return BadRequest();
        }

        [HttpPost("{householdId:int}/toggleinvite")]
        public async Task<ActionResult<RequestResponse<HouseholdDto>>> ToggleInvite(int householdId)
        {
            var household = _uc.HouseholdUsers.FirstOrDefault(hu=>hu.HouseholdId == householdId && hu.HouseholdOwner==true)?.Household;
            if(household == null) return Forbid();
            var result = await _hs.ToggleIsOpenForInvite(household);
            if(result.Success) return Ok(result.Data.ToDto());
            return BadRequest();
        }
        [HttpDelete("{householdId:int}/user")]
        public async Task<IActionResult> DeleteUser(int householdId, DeleteUserDto input)
        {
            var owner = _uc.HouseholdUsers.Any(hu=>hu.HouseholdId == householdId && hu.HouseholdOwner == true );
            if(!owner) return Forbid();
            var result = await _hs.DeleteHouseholdUserAsync(input.Id,householdId);
            if(result.Success) return NoContent();
            return BadRequest();
        }
        
    }
}
