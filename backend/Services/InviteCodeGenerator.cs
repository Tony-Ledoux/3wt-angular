namespace backend.Services;

public class InviteCodeGenerator(ISystemSettingsServce settings) : IInviteCodeGenerator
{
    
    public async Task<string> GenerateAsync()
    {
        var allowed_chars = settings.GetValue("AllowedCharsInvite","ABCDEFGHJKLMNPQRSTUVWXYZ23456789#?!");
        var max_length = settings.GetIntValue("MaxInviteCodeLenght",4);
        // create the string
        var random = new Random();
        return new string([.. Enumerable.Repeat(allowed_chars, max_length).Select(s => s[random.Next(s.Length)])]);
    }
}
