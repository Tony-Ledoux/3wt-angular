using System;
using backend.Constants;

namespace backend.Services;

public static class InviteCodeGenerator
{
    public static string Generate()
    {
        const string chars = HouseholdConstants.AllowedInviteCodeChars;
        var random = new Random();
        return new string([.. Enumerable.Repeat(chars, HouseholdConstants.InviteCodeLength).Select(s => s[random.Next(s.Length)])]);
    }
}
