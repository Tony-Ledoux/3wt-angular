using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities;

public class StorageLocation : BaseEntity
{

    public string Name {get;set;}
   
    public int DeviceTypeId {get;set;}
  
    public int HouseholdId {get;set;}

    //navigation properties
    
    [ForeignKey(nameof(DeviceTypeId))]
    public DeviceType DeviceType {get;set;}
    [ForeignKey(nameof(HouseholdId))]
    public Household Household {get;set;}
}
