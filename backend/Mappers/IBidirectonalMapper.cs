using System;

namespace backend.Mappers;

public interface IBidirectonalMapper<Tentity,TDto> : IMapper<Tentity,TDto>
{
    Tentity MapToEntity(TDto dto);
}
