using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities;

public class ProductCategoryMapping:BaseEntity
{
    
    
    public int ProductCategoryId {get;set;}
    
    public int ProductId {get;set;}

    [ForeignKey(nameof(ProductCategoryId))]
    public ProductCategory ProductCategorie {get;set;}
    [ForeignKey(nameof(ProductId))]
    public Product Product {get;set;}
}
