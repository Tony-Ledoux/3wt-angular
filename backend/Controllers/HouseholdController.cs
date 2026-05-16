using backend.Contexts;
using backend.Extentions;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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
    }
}
