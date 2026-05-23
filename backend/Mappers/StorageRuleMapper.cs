using System;
using backend.Entities;

using backend.Models;

namespace backend.Mappers;

public class StorageRuleMapper : BaseMapper<StorageRule, StorageRuleDto>
{
    public override StorageRuleDto Map(StorageRule entity)
    {
        return new StorageRuleDto
        {
            Id = entity.Id,
            DeviceType = entity.DeviceType?.Type ?? "onbekend",
            Multiplier = entity.Multiplier
        };
    }
}
