using backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/storagelocations")]
    [ApiController]
    public class StoragelocationController(IInventoryService inventoryService) : ControllerBase
    {
        public readonly IInventoryService _is = inventoryService;

        [HttpGet("household/{id:int}")]
        public async Task<IActionResult> GetStoragelocationsForHousehold(int id)
        {
            // see if user is part of household

            // get al storagelocations
            var storagelocation = await _is.GetStoragelocationsOfHouseholdsAsync(id);
            return Ok(storagelocation);
        }
    }
}
