using System;
using System.Text.Json.Serialization;

namespace backend.Models;

public class SettingDto
{
    
    public int Id {get;set;}
    public string Key {get;set;}
    public string Value {get;set;}
    public string Description {get;set;}
}
