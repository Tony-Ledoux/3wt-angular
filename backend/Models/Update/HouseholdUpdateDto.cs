using System;
using System.ComponentModel.DataAnnotations;

namespace backend.Models.Update;

public class HouseholdUpdateDto
{
    [Required]
    
    public string Name { get; set; }
    [Required]
    public string Address { get; set; } = null;
}
