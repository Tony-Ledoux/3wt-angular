using System;
using backend.Entities;

namespace backend.Models;

public class StoragelocationDto
{
    public int Id {get;set;}
    public string Name {get;set;}
    public int DeviceTypeId {get;set;}
    public string DeviceType {get;set;}
    public int NumberOfItemsInInventory {get;set;} = 0;

}
