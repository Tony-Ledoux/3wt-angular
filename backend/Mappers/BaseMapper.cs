using System;

namespace backend.Mappers;

public abstract class BaseMapper<Tentity, TDto> : IMapper<Tentity, TDto>
{
    public abstract TDto Map(Tentity entity);
   

    public virtual IEnumerable<TDto> MapList(IEnumerable<Tentity> entities)
    {
        if (entities == null) return Enumerable.Empty<TDto>();
        
        return [.. entities.Select(Map)];
    }
}
