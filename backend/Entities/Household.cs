using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities;

public class Household : BaseEntity
{

    [Column("name")]
    public string Name {get;set;}
    [Column("adress")]
    public string? Adress {get;set;}
    [Column("invite_code")]
    public string? InviteCode {get;set;}
    [Column("is_open_for_invite")]
    public bool IsOpenForInvite {get;set;}

    // navigation properties
    public ICollection<HouseholdUser> HouseholdUsers {get;set;} = [];
    public ICollection<StorageLocation> StorageLocations {get;set;}= [];



}
