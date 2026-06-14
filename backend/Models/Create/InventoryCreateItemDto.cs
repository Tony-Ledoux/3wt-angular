using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using backend.Services.Converters;


namespace backend.Models.Create;

public class InventoryCreateItemDto
{
    [Required]
    public int StorageLocationId {get;set;}
    [Required]
    public int ProductId {get;set;}
    [Required]
    public double Quantity {get;set;}
    
    public string? Unit {get;set;}
   
    public string? ExpiryDate {get;set;}
}
