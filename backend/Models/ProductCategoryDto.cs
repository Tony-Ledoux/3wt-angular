using System;

namespace backend.Models;

public class ProductCategoryDto
{
    public int Id {get;set;}
    public string CategorieName {get;set;}
    public IEnumerable<StorageRuleDto> StorageRules {get;set;}= [];
}
