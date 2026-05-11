using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities;

public class StorageRule: BaseEntity
{
    [Column("device_type_id")]
    public int DeviceTypeId {get;set;}
    [Column("product_category_id")]
    public int ProductCategoryId {get;set;}
    [Column("multiplier")]
    public double Multiplier {get;set;}


    //navigational properties
    [ForeignKey(nameof(DeviceTypeId))]
    public DeviceType DeviceType {get;set;}
    [ForeignKey(nameof(ProductCategoryId))]
    public ProductCategory ProductCategory {get;set;}
}
