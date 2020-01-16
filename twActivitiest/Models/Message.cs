using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace twActivitiest.Models
{
    public class Message
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


        [Required(ErrorMessage = "{0}必填")]
        [MaxLength]
        [Display(Name = "內容")]
        public string Main { get; set; }


        [Display(Name = "留言時間")]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime? time { get; set; } = DateTime.UtcNow.AddHours(23);

        [Range(1, 5)]
        [Display(Name = "評分")]
        public int Score { get; set; }

        [Display(Name = "照片")]//改欄位名稱
        [MaxLength]//資料型態長度
        public string Image { get; set; }

        

    }
}