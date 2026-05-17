using System;
using System.Collections.Concurrent;
using backend.Contexts;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public record SystemSettingDto(string Key, string Value, string Description);

public interface ISystemSettingsServce
{
    string GetValue(string key, string defaultValue = "");
    int GetIntValue(string key, int defaultValue = 0);
    string GetDescription(string key, string defaultValue = "");
    IEnumerable<SystemSettingDto> GetAllSettings();
    Task RefreshAsync();

    Task<bool> UpdateSettingsAsync(List<SettingDto> updatedSettings);
}

public class SystemSettingsService(IServiceProvider serviceProvider) : ISystemSettingsServce
{
    private readonly IServiceProvider _serviceProvider = serviceProvider;
    private ConcurrentDictionary<string, SystemSettingDto> _cache = new();

    public async Task RefreshAsync()
    {
        using var scope = _serviceProvider.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<KitchenDbContext>();

        var settings = await db.SystemSettings.ToListAsync();
        var newCache = new ConcurrentDictionary<string, SystemSettingDto>(
            settings.Select(s => new KeyValuePair<string, SystemSettingDto>(s.Key, new SystemSettingDto(s.Key,s.Value, s.Description)))
        );
        _cache = newCache;
    }
    public string GetValue(string key, string defaultValue = "")
       => _cache.TryGetValue(key, out var setting) ? setting.Value : defaultValue;

    public int GetIntValue(string key, int defaultValue = 0)
    {
        if (_cache.TryGetValue(key, out var setting) && int.TryParse(setting.Value, out int result))
            return result;
        return defaultValue;
    }

    public string GetDescription(string key, string defaultValue = "") => _cache.TryGetValue(key, out var setting) ? setting.Description : defaultValue;

    public IEnumerable<SystemSettingDto> GetAllSettings()
    {
        return _cache.Values;
    }

    public async Task<bool> UpdateSettingsAsync(List<SettingDto> updatedSettings)
    {
         using var scope = _serviceProvider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<KitchenDbContext>();
        if (updatedSettings == null || updatedSettings.Count == 0) return false;
        var existingSettings = await db.SystemSettings.ToListAsync();
        foreach (var dto in updatedSettings)
        {
            var setting = existingSettings.FirstOrDefault(s=>s.Key == dto.Key);
            if(setting != null)
            {
                setting.Value = dto.Value;
                setting.Description = dto.Description;
            }
        }

        return await db.SaveChangesAsync() > 0;
    }
}
