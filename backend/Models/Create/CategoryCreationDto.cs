using System;

namespace backend.Models.Create;

public class CategoryCreationDto
{
    public string CategorieName {get;set;}
    public IEnumerable<StorageRuleCreationDto> StorageRules {get; set;}
}

public class StorageRuleCreationDto
{
    public int DeviceType {get;set;}
    public double Multiplier {get;set;} 
}
