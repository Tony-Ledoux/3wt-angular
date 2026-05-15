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
        if (!string.IsNullOrEmpty(userId))
        {
            userContext.UserId = userId;
            userContext.HouseholdUsers = await _srv.GetHouseholdUsersAsync(userId);
        }
        await _next(context);
    }
}
