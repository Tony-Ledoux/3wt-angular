using System;

namespace backend.Services;

public interface IInviteCodeGenerator
{
    Task<string> GenerateAsync();
}
