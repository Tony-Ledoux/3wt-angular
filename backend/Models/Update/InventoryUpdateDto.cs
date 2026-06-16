
using System.ComponentModel.DataAnnotations;

namespace backend.Models.Update;

public class InventoryUpdateDto
{
    [Required]
    public int Id {get;set;}
    [Required]
    public double Quantity {get;set;}
}
