using backend.Contexts;
using backend.Models;
using backend.Models.Update;
using backend.Services;
using Microsoft.AspNetCore.Authorization;

using Microsoft.AspNetCore.Mvc;

//TODO Rework the routes to use -->services-->repos
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
            var householdUser = _uc.IsCurrentUserInHouseholdWithId(id);
            if(householdUser == null) return Forbid();
            if(!householdUser.Isowner) return Forbid();
            var result = await _hs.DeleteHouseholdWithAllUsersAsync(id);
            if(!result) return BadRequest();
            _uc.DeleteFromContext(householdUser);
            return Ok(householdUser);

        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetHouseholdDetails(int id)
        {
            var isOwner = _uc.CurrentUserOwnsHousehold(id);
            if(!isOwner) return Forbid();
            var details = await _hs.GetHouseholdWithUsersByIdAsync(id);
            return Ok(details);

        }
        [HttpPut("{id:int}")]
        public async Task<ActionResult<HouseholdUserDto>> UpdateHouseholdDetails(int id, HouseholdUpdateDto input)
        {
            var isOwner = _uc.CurrentUserOwnsHousehold(id);
            if(!isOwner) return Forbid();
            var result = await _hs.UpdateHouseholdWithUser(input,id,_uc.UserId);
            if(result== null) return BadRequest();
            return Ok(result);
        }


        [HttpPost("{householdId:int}/generateinvitecode")]
        public async Task<ActionResult<RequestResponse<HouseholdDto>>> GetNewInvitecode(int householdId)
        {
            var isOwner = _uc.CurrentUserOwnsHousehold(householdId);
            if(!isOwner) return Forbid();
            var result = await _hs.GenerateNewInviteCode(householdId);
            if(result.Success) return Ok(result.Data);
            return BadRequest();
        }

        [HttpPost("{householdId:int}/toggleinvite")]
        public async Task<ActionResult<RequestResponse<HouseholdDto>>> ToggleInvite(int householdId)
        {
            var isOwner = _uc.CurrentUserOwnsHousehold(householdId);
            if(!isOwner) return Forbid();
            var result = await _hs.ToggleIsOpenForInvite(householdId);
            if(result.Success) return Ok(result.Data);
            return BadRequest();
        }
        
        [HttpDelete("{householdId:int}/user")]
        public async Task<IActionResult> DeleteUser(int householdId, DeleteUserDto input)
        {
            var isOwner = _uc.CurrentUserOwnsHousehold(householdId);
            if(!isOwner) return Forbid();
            var result = await _hs.DeleteHouseholdUserAsync(input.Id,householdId);
            if(result.Success) return NoContent();
            return BadRequest();
        }
        
    }
}
