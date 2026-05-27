using backend.Contexts;
using backend.Models.Create;
using backend.Models.Update;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewFeatures;

namespace backend.Controllers
{
    [Route("api/products")]
    [ApiController]
    [Authorize]
    public class ProductController(IUserContext userContext, IInventoryService Isrv) : ControllerBase
    {
        private readonly IUserContext _user = userContext;
        private readonly IInventoryService _srv = Isrv;
        //producten aanmaken
        [HttpPost]
        public async Task<IActionResult> CreateNewProduct(ProductCreationDto input)
        {
            if (_user.IsAdmin) //an admin always does global
            {
                input.IsGlobal=true;
                input.HouseholdId = null;
            } else
            {
                input.IsGlobal = false;
            }
            var result = await _srv.CreateNewProductAsync(input);
            //flip the flags if needed
            return Ok(result);
        }
        // product verwijderen
        [HttpDelete("{pid:int}")]
        public async Task<IActionResult> DeleteProduct(int pid)
        {
            var result = await _srv.RemoveProduct(pid,_user.IsAdmin);
            if(!result) return BadRequest();
            return NoContent();
        }
        //categorie toewijzen aan product
        [HttpPost("{pid:int}/categories/{cid:int}")]
        public async Task<IActionResult> AssignCategoryToProduct(int pid, int cid)
        {
            var result = await _srv.AddCategoryToProduct(pid,cid,_user.IsAdmin);
            if(!result) return BadRequest();
            return NoContent();
        }
        //categorie verwijderen van product
        [HttpDelete("{pid:int}/categories/{cid:int}")]
        public async Task<IActionResult> RemoveCategoryFromProduct(int pid, int cid)
        {
            var result = await _srv.RemoveCategoryFromProductAsync(pid,cid,_user.IsAdmin);
            if(!result) return BadRequest();
            return NoContent();
        }
        [HttpPut("{pid:int}/categories")]
        public async Task<IActionResult> UpdateCategoryFromProduct(int pid, int[] updates)
        {
            throw new NotImplementedException();
        }
        [HttpPut("{pid:int}")]
        public async Task<IActionResult> UpdateProductAsync(int pid, ProductUpdateDto input)
        {
            if (!_user.IsAdmin && input.HouseholdId == null) return BadRequest();
            if(!_user.IsAdmin && !_user.HouseholdUsers.Any(x=>x.HouseholdId == input.HouseholdId)) return BadRequest();
            
            var result = await _srv.UpdateProductAsync(pid,_user.IsAdmin,input);
            if(!result.Success) return BadRequest();
            return Ok(result.Data);
        }
    }
}
