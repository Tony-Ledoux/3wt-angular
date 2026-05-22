using backend.Entities;
using backend.Models;
using backend.Models.Create;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
        public async Task<ActionResult<ProductCategoryDto>> CreateNewProductCategoryAsync(CategoryCreationDto input)
        {
            var success = await _i_srv.CreateNewProductCategoryAsync(input);
            if(success.Success) return Ok(success.Data);
            if(success.IsConflict) return Conflict(success.ErrorMessage);
            return BadRequest(success.ErrorMessage);
        }
        [HttpDelete("product-categories/{id:int}")]
        public async Task<IActionResult> DeleteProductCategoryWithAllStorageRules(int id)
        {
            var result = await _i_srv.DeleteCategoryWithRules(id);
            if(result.Success) return NoContent();
            if(result.IsNotFound) return NotFound(result.ErrorMessage);
            return BadRequest();
        }

        [HttpDelete("storage-rule/{id:int}")]
        public async Task<IActionResult> DeleteStorageRule(int id)
        {
            var result = await _i_srv.DeleteStorageRuleAsync(id);
            if(result.Success) return NoContent();
            if(result.IsNotFound) return NotFound(result.ErrorMessage);
            return BadRequest();
        }

        [HttpPost("storage-rule/{categotyId:int}")]
        public async Task<ActionResult<StorageRuleDto>> AddNewStorageRuleToCategory(int categotyId, StorageRuleCreationDto input)
        {
            var result = await _i_srv.CreateNewStorageRuleinCategoryIdAsync(categotyId,input);
            if(result.Success) return Ok(result.Data);
            if(result.IsConflict) return Conflict(result.ErrorMessage);
            return BadRequest(result.ErrorMessage);
        }
    }
}
