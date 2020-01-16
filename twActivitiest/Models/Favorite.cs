using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace twActivitiest.Models
{
    public class Favorite
    {
        [Key]
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

        public int Id { get; set; }


        [Display(Name = "類別1")]
        public int MId { get; set; } //? 允許空直
        [JsonIgnore]
        [ForeignKey("MId")]
        public virtual Member Member { get; set; }

        [Display(Name = "類別2")]
        public int EId { get; set; } //? 允許空直
        [JsonIgnore]
        [ForeignKey("EId")]
        public virtual Exhibition Exhibition { get; set; }


        [Display(Name = "建立日期")]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        //[DisplayFormat(ApplyFormatInEditMode = true,DataFormatString = "{0:yyyy年MM月dd日}")]
        public DateTime? InitDate { get; set; }




    }
}