
namespace backend.Mappers;

public interface IMapper<Tentity, TDto>
{
    TDto Map(Tentity entity);
    IEnumerable<TDto> MapList(IEnumerable<Tentity> entities);

}
