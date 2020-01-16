using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace twActivitiest.Models
{
    public class City
    {
        [Key]
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

        public int Id { get; set; }

        [Required(ErrorMessage = "{0}必填")]
        [MaxLength(100)]
        [Display(Name = "城市")]
        public string Name { get; set; }



        [Display(Name = "建立日期")]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        //[DisplayFormat(ApplyFormatInEditMode = true,DataFormatString = "{0:yyyy年MM月dd日}")]
        public DateTime? InitDate { get; set; }

        public virtual ICollection<Place> Places { get; set; }
        public virtual ICollection<Food> Foods { get; set; }


    }
}