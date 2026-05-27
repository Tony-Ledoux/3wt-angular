using System;

namespace backend.Models.Update;

public class ProductUpdateDto
{
    public string ProductName {get;set;}
  
    public string? DefaultUnit {get;set;}
   
    public string? ShelfLifeClosedMinutes {get;set;}
   
    public string? ShelfLifeOpenedMinutes {get;set;}
  
    public bool IsGlobal {get;set;}
   
    public int? HouseholdId {get;set;}
}
