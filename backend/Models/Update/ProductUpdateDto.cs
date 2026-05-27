using System;
using System.Text.Json.Serialization;
using backend.Services.Converters;

namespace backend.Models.Update;

public class ProductUpdateDto
{
    public string ProductName {get;set;}
  
    public string? DefaultUnit {get;set;}
    [JsonConverter(typeof(EmptyStringConverter))]
    public int? ShelfLifeClosedMinutes {get;set;}
   [JsonConverter(typeof(EmptyStringConverter))]
    public int? ShelfLifeOpenedMinutes {get;set;}
  
    public bool IsGlobal {get;set;}
   
    public int? HouseholdId {get;set;}
}
