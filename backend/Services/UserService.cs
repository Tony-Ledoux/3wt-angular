
using backend.Entities;
using backend.Mappers;
using backend.Models;
using backend.Models.Create;
using backend.Repository;


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

        // 1. generate a new invitecode
        var inviteCode = await _gen.GenerateAsync();
        // 2. create a new Household
        var household_new = _household_repo.GetNewEmptyInstance();
        household_new.Name = input.Name.Trim();
        household_new.Address = input.Address.Trim();
        household_new.InviteCode = inviteCode;
        // 3. Track the new household
        await _household_repo.AddAsync(household_new);

        // 4. Create a new HouseholdUser
        var u = _repo.GetNewEmptyInstance();
        u.UserId = id;
        u.Household = household_new;
        u.HouseholdOwner = true;
        u.Email = email;
        await _repo.AddAsync(u);
        // 5. save to database
        var result = await _repo.SaveChangesAsync();
        if (result)
        {
            var dto = _mapper.Map(u);
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
