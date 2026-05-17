using System;
using backend.Entities;

using backend.Models;

namespace backend.Mappers;

public class DeviceTypeMapper : BaseMapper<DeviceType, DeviceTypeDto>
{
    public override DeviceTypeDto Map(DeviceType entity)
    {
        return new DeviceTypeDto()
        {
            Id = entity.Id,
            Type = entity.Type
        };
    }
}
