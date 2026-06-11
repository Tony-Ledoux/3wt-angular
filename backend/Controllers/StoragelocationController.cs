using backend.Contexts;
using backend.Models.Create;
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
            if (!_user.HouseholdUsers.Any(hh => hh.HouseholdId == id)) return Forbid();
            var storagelocation = await _is.GetStoragelocationsOfHouseholdsAsync(id);
            return Ok(storagelocation);
        }
        [HttpPost("household/{id:int}")]
        public async Task<IActionResult> CreateNewStorageLocation(int id, StorageLocationCreateDto input)
        {
            if (!_user.CurrentUserOwnsHousehold(id)) return Forbid();
            var result = await _is.CreateStorageLocationForHousehold(id, input);
            if (result == null) return BadRequest();
            return Ok(result);
        }
        [HttpDelete("household/{id:int}")]
        public async Task<IActionResult> DeleteStorageLocation(int id)
        {
            if (!_user.CurrentUserOwnsHousehold(id)) return Forbid();
            var result = await _is.DeleteStorageLocationForHousehold(id);
            if(!result) return BadRequest();
            return NoContent();
        }

    }
}
