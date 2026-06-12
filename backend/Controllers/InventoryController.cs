using backend.Contexts;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/inventory")]
    [ApiController]
    [Authorize]
    public class InventoryController(IUserContext userContext, IInventoryService Isrv) : ControllerBase
    {
        private readonly IUserContext _user = userContext;
        private readonly IInventoryService _srv = Isrv;

        [HttpGet("household/{householdId:int}")]
        public async Task<IActionResult> GetAllInventoryForHousehold(int householdId)
        {
            // see if user is part of household
            if (!_user.HouseholdUsers.Any(hh => hh.HouseholdId == householdId)) return Forbid();
            var result = await _srv.GetInventoryItemsForHousehold(householdId);
            return Ok(result);
        }
        
    }
}
