using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities;

public class StorageRule: BaseEntity
{
   
    public int DeviceTypeId {get;set;}
  
    public int ProductCategoryId {get;set;}
  
    public double Multiplier {get;set;}


    //navigational properties
    [ForeignKey(nameof(DeviceTypeId))]
    public DeviceType DeviceType {get;set;}
    [ForeignKey(nameof(ProductCategoryId))]
    public ProductCategory ProductCategory {get;set;}
}
