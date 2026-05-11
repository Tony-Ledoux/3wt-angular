using System;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace backend.Entities;

[Index(nameof(Category), IsUnique = true)]
public class ProductCategory : BaseEntity
{
    [Column("category")]
    public string Category {get;set;}

    // navigatonal Properties
    public ICollection<StorageRule> StorageRules {get;set;}= [];
    public ICollection<Product> Products {get;set;}= [];
}
