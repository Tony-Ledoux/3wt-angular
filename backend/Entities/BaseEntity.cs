using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities;

public class BaseEntity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id {get;set;}

    [Column("created_at")]
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    
    [Column("updated_at")]
    public DateTime? UpdatedAt {get;set;}

     [Column("deleted_at")]
    public DateTime? DeletedAt {get;set;}

}
