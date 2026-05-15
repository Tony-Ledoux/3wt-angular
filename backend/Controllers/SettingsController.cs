using backend.Contexts;
using backend.Extentions;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
namespace backend.Controllers
{
    [Route("api")]
    [ApiController]
    public class SettingsController(ISystemSettingsServce service) : ControllerBase
    {
        private readonly ISystemSettingsServce _srv= service;

        [HttpGet("settings")]
        public IActionResult GetSettings()
        {
            var result = _srv.GetAllSettings();
            return Ok(result);
        }
    }
}
