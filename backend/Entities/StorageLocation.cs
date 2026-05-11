using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities;

public class StorageLocation : BaseEntity
{
    [Column("name")]
    public string Name {get;set;}
    [Column("device_type_id")]
    public int DeviceTypeId {get;set;}
    [Column("household_id")]
    public int HouseholdId {get;set;}

    //navigation properties
    
    [ForeignKey(nameof(DeviceTypeId))]
    public DeviceType DeviceType {get;set;}
    [ForeignKey(nameof(HouseholdId))]
    public Household Household {get;set;}
}
