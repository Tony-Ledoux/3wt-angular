
using System.ComponentModel.DataAnnotations;

namespace backend.Models.Create;

public class HouseholdCreationDto
{
    [Required]
    public string Name { get; set; }

    public string? Address { get; set; } = null;

    // if set must be of length of HouseholdConstants.InviteCodeLength, must contain only characters in HouseholdConstants.AllowedInviteCodeChars
    public string? InviteCode { get; set; } = null;

    [Required]
    public bool IsOpenForInvite { get; set; } = false;
}
