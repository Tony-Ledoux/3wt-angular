using System;
using backend.Entities;

namespace backend.Models;

public class StoragelocationDto
{
    public int Id {get;set;}
    public string Name {get;set;}
    public string DeviceType {get;set;}
    public IEnumerable<object> Storagerules {get;set;}

}
