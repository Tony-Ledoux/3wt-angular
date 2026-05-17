using System;
using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class DeleteUserDto
{
    [Required]
    [MinLength(1, ErrorMessage = "Het id is minimaal 1 karakter lang")]
    public string Id {get;set;}
}
