using System;
using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class InviteRequestCodeDto
{
    [Required]
    public string Name {get;set;}
    [Required]
    public string InviteCode {get;set;}
}
