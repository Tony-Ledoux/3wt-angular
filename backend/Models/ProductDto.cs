using System;

namespace backend.Models;

public class ProductDto
{
    public int Id {get;set;}
    public string ProductName {get;set;} = string.Empty;
    public string DefaultUnit {get;set;}
    public int? ShelfLifeClosedDays {get;set;}
    public int? ShelfLifeOpenedDays {get;set;}
    public bool IsGlobal {get;set;}
    public int? HouseholdId {get;set;}
    public List<int> CategoryIds {get;set;}= [];

}
