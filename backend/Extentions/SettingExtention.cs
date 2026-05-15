using System;
using backend.Entities;
using backend.Models;

namespace backend.Extentions;

public static class SettingExtention
{
    public static SettingDto ToDto(this SystemSetting entity)
    {
        if(entity == null) return null;
        return new SettingDto()
        {
            Id = entity.Id,
            Key = entity.Key,
            Value = entity.Value,
            Description = entity.Description
        };
    }

    public static IEnumerable<SettingDto> ToDtoList( this IEnumerable<SystemSetting> list)
    {
        return list.Select(i=> i.ToDto());
    }
}
