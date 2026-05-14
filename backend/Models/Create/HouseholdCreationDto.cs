using System;
using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography;
using backend.Constants;

namespace backend.Models.Create;

public class HouseholdCreationDto : IValidatableObject
{
    [Required]
    public string Name { get; set; }

    public string? Address { get; set; } = null;

    // if set must be of length of HouseholdConstants.InviteCodeLength, must contain only characters in HouseholdConstants.AllowedInviteCodeChars
    public string? InviteCode { get; set; } = null;

    [Required]
    public bool IsOpenForInvite { get; set; } = false;

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (InviteCode != null)
        {
            // length
            if (InviteCode.Length != HouseholdConstants.InviteCodeLength)
            {
                yield return new ValidationResult($"De invite code moet precies {HouseholdConstants.InviteCodeLength} tekens lang zijn.",
                    [nameof(InviteCode)]);
            }
            // 2. Check toegestane tekens
            if (!InviteCode.All(c => HouseholdConstants.AllowedInviteCodeChars.Contains(c)))
            {
                yield return new ValidationResult(
                    "De invite code bevat ongeldige tekens.",
                    [nameof(InviteCode)]
                );
            }

        }
    }
}
