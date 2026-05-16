using System;
using System.Security.Claims;
using backend.Contexts;
using backend.Services;

namespace backend.Middleware;

public class UserContextMiddleware(RequestDelegate next)
{
    private readonly RequestDelegate _next = next;

    public async Task InvokeAsync(HttpContext context, IUserContext userContext, IUserService _srv)
    {
        var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
        var email = context.User.FindFirstValue(ClaimTypes.Email);
        if (!string.IsNullOrEmpty(userId) && !string.IsNullOrEmpty(email))
        {
            var HouseholdUsers = await _srv.GetHouseholdUsersAsync(userId);
            userContext.UserId = userId;
            userContext.Email = email;
            userContext.HouseholdUsers = HouseholdUsers;
        }
        await _next(context);
    }
}
