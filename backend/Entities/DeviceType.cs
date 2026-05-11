using System;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace backend.Entities;


public class DeviceType : BaseEntity
{

    public string Type {get;set;}
    //navigational Properties
    public ICollection<StorageLocation> StorageLocations {get;set;}= [];
    public ICollection<StorageRule> StorageRules {get;set;}= [];
}
