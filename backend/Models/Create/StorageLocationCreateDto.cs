using System;
using System.ComponentModel.DataAnnotations;

namespace backend.Models.Create;

public class StorageLocationCreateDto
{
    [Required]
    public string Naam { get; set; }
    [Required]
    public int DeviceType { get; set; }
}
