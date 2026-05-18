using backend.Models;
using backend.Models.Create;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Npgsql.EntityFrameworkCore.PostgreSQL.Query.Expressions.Internal;

namespace backend.Controllers
{
    [Route("api/admin")]
    [Authorize(Roles = "Admin")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        public AdminController(IHouseholdService hhSrv, IInventoryService iSrv)
        {
            _hh_srv = hhSrv;
            _i_srv = iSrv;
        }
        private readonly IHouseholdService _hh_srv;
        private readonly IInventoryService _i_srv;

        // huishoudens
        [HttpGet("households")]
        public async Task<ActionResult<IEnumerable<HouseholdDto>>> GetAllHouseholds()
        {
            //get all the households
            var households = await _hh_srv.GetAllHouseholds();
            return Ok(households);
            
        }

        [HttpDelete("households/{id:int}")]
        public async Task<IActionResult> DeleteHouseHoldWithIdAsync(int id)
        {
            //ask service to delete
            var success = await _hh_srv.DeleteHouseholdWithAllUsersAsync(id);
            if(!success) return BadRequest();
            return NoContent();

        }

        // Categoriën
        [HttpGet("product-categories")]
        public async Task<IActionResult> GetAllProductCategoriesAsync()
        {
            var cat = await _i_srv.GetAllProductCategorieWithStorageRulessAsync();
            return Ok(cat);
        }

        [HttpPost("product-categories")]
        public async Task<IActionResult> CreateNewProductCategoryAsync(CategoryCreationDto input)
        {
            var success = await _i_srv.CreateNewProductCategoryAsync(input);
            if(success == null) return BadRequest();
            return Ok(success);
        }
    }
}
