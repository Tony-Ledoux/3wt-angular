using backend.Contexts;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/storagelocations")]
    [ApiController]
    [Authorize]
    public class StoragelocationController(IInventoryService inventoryService, IUserContext userContext) : ControllerBase
    {
        public readonly IInventoryService _is = inventoryService;
        public readonly IUserContext _user = userContext;

        [HttpGet("household/{id:int}")]
        public async Task<IActionResult> GetStoragelocationsForHousehold(int id)
        {
            // see if user is part of household
            if(!_user.HouseholdUsers.Any(hh=>hh.HouseholdId == id)) return Forbid();
            var storagelocation = await _is.GetStoragelocationsOfHouseholdsAsync(id);
            return Ok(storagelocation);
        }
    }
}
