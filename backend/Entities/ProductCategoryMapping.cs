using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities;

public class ProductCategoryMapping
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id {get;set;}
    [Column("product_category_id")]
    public int ProductCategoryId {get;set;}
    [Column("product_id")]
    public int ProductId {get;set;}

    public ICollection<ProductCategory> ProductCategories {get;set;}=[];
    public ICollection<Product> Products {get;set;}=[];
}
