using System;

namespace backend.Models.Create;

public class ProductCreationDto
{
    public string ProductName {get;set;}
  
    public string? DefaultUnit {get;set;}
   
    public int? ShelfLifeClosedMinutes {get;set;}
   
    public int? ShelfLifeOpenedMinutes {get;set;}
  
    public bool IsGlobal {get;set;}
   
    public int? HouseholdId {get;set;}

    public ICollection<int> CategoryIds {get;set;}=[];
}
