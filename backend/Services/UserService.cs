using System;
using System.Collections.Immutable;
using backend.Contexts;
using backend.Entities;
using backend.Mappers;
using backend.Models;
using backend.Models.Create;
using backend.Repository;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public interface IUserService
{
    Task<IEnumerable<HouseholdUserDto>> GetHouseholdUsersAsync(string id);
    Task<RequestResponse<HouseholdUserDto>> CreateNewHousholdAndUser(string id, string email, HouseholdCreationDto input);

    Task<RequestResponse<HouseholdUserDto>> JoinByInviteCode(string id, string email, InviteRequestCodeDto input);
    Task<RequestResponse<bool>> DeleteUserFromHousehold(string id, int householdId);
    
}

public class UserService(
    IHouseholdUserRepository repo,
    IHouseholdRepository hur,
     IInviteCodeGenerator gencode,
      IMapper<HouseholdUser, HouseholdUserDto> mapper
      ) : IUserService
{
    private readonly IHouseholdUserRepository _repo = repo;
    private readonly IHouseholdRepository _household_repo = hur;
    private readonly IInviteCodeGenerator _gen = gencode;
    private readonly IMapper<HouseholdUser, HouseholdUserDto> _mapper = mapper;

    public async Task<IEnumerable<HouseholdUserDto>> GetHouseholdUsersAsync(string id)
    {
        // i want to use a memorycache here

        var users = await _repo.GetHouseholdUsersForTokenId(id);
        return _mapper.MapList(users);

    }


    public async Task<RequestResponse<HouseholdUserDto>> CreateNewHousholdAndUser(string id, string email, HouseholdCreationDto input)
    {
        if (input == null) return new RequestResponse<HouseholdUserDto>().Failure("Gelieve mij data te geven");

        //generate a new invitecode
        var inviteCode = await _gen.GenerateAsync();
        // create a new Household
        var household_new = new Household(input.Name,input.Address,inviteCode);
        await _household_repo.AddAsync(household_new);
        // create a new HousholdUser // this is the owner, Need to insert HouseholdId Here

        var HouseholdUser = new HouseholdUser()
        {
            UserId = id,
            Household = household_new,
            HouseholdOwner = true,
            Email = email
        };
        await _repo.AddAsync(HouseholdUser);
        var result = await _repo.SaveChangesAsync();
        if (result)
        {
            var dto = _mapper.Map(HouseholdUser);
         return new RequestResponse<HouseholdUserDto>().Ok(dto);
        }
        return new RequestResponse<HouseholdUserDto>().Failure("");
    }



    async public Task<RequestResponse<HouseholdUserDto>> JoinByInviteCode(string id, string email, InviteRequestCodeDto input)
    {
        // find the household
        var houshold = await _household_repo.FindInviteOpenHouseholdByNameAndInviteCodeWithUsersAsync(input.Name,input.InviteCode);
        if (houshold == null)
        {
            return new RequestResponse<HouseholdUserDto>().Failure("Geen huishouden gevonden met deze code dat invites accepteerd").SetIsNotFound();
        }
        //check of gebruiker nog geen lid
        if (houshold.HouseholdUsers.Any(hu => hu.UserId == id))
        {
            return new RequestResponse<HouseholdUserDto>().Failure("Je bent al lid van dit huishouden").SetIsConflict();
        }
        var HouseholdUser = new HouseholdUser()
        {
            UserId = id,
            Household = houshold,
            HouseholdOwner = false,
            Email = email
        };
        await _repo.AddAsync(HouseholdUser);
        var success = await _repo.SaveChangesAsync();
        if(!success) return new RequestResponse<HouseholdUserDto>().Failure("");
        return new RequestResponse<HouseholdUserDto>().Ok(_mapper.Map(HouseholdUser));

    }

    public async Task<RequestResponse<bool>> DeleteUser(HouseholdUser entity)
    {

        _repo.Delete(entity);
        var result = await _repo.SaveChangesAsync();
        if (result) return new RequestResponse<bool>().Ok(true);
        return new RequestResponse<bool>().Failure("false");

    }

    public async Task<RequestResponse<bool>> DeleteUserFromHousehold(string id, int householdId)
    {
        var entity = await _repo.FindUserByIdAndHouseholdId(id,householdId);
        if(entity == null) return new RequestResponse<bool>().Failure("");
        _repo.Delete(entity);
        var result = await _repo.SaveChangesAsync();
        if(!result) return new RequestResponse<bool>().Failure("");
        return new RequestResponse<bool>().Ok(true);
    }
}
