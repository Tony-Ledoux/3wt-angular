using System;
using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography;

namespace backend.Models.Create;

public class HouseholdCreationDto
{
    [Required]
    public string Name {get;set;}
    [Required]
    public string Address {get;set;}

    [Required]
    public bool IsOpenForInvite {get;set;}=false;
}
