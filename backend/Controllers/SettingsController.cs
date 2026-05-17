using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace backend.Controllers
{
    [Route("api/settings")]
    [ApiController]
    public class SettingsController(ISystemSettingsServce service) : ControllerBase
    {
        private readonly ISystemSettingsServce _srv = service;

        [HttpGet]
        public IActionResult GetSettings()
        {
            var result = _srv.GetAllSettings();
            return Ok(result);
        }

        [HttpPut("update")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateSettings(List<SettingDto> settings)
        {

            if (settings == null || settings.Count == 0)
            {
                return BadRequest("Geen instellingen opgegeven om bij te werken.");
            }
            try
            {

                var success = await _srv.UpdateSettingsAsync(settings);
                if (success)
                {
                    await _srv.RefreshAsync();
                    return NoContent();
                }
                return BadRequest();
            }
            catch (Exception)
            {
                return BadRequest();
            }

        }


    }
}
