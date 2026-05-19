using System;
using backend.Entities;

using backend.Models;

namespace backend.Mappers;

public class ProductCategoryMapper(IMapper<StorageRule,StorageRuleDto> m) : BaseMapper<ProductCategory, ProductCategoryDto>
{
    private readonly IMapper<StorageRule,StorageRuleDto> _mapper = m;

    public override ProductCategoryDto Map(ProductCategory entity)
    {
        return new ProductCategoryDto()
        {
            Id = entity.Id,
            CategorieName = entity.Category,
            StorageRules = _mapper.MapList(entity.StorageRules)
        };
    }
}
