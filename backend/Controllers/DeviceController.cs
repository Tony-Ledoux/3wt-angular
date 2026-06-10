using System.Collections;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/devicetypes")]
    [ApiController]
    public class DeviceController(IInventoryService inventoryService) : ControllerBase
    {
        private readonly IInventoryService _srv= inventoryService;
        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DeviceTypeDto>>> GetDevices()
        {
            var devices = await _srv.GetAllDeviceTypesAsync();
            return Ok(devices);
        }
    }
}
