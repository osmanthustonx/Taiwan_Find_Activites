using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace twActivitiest.Models
{
    public class Food
    {

        [Key]
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

        public int Id { get; set; }

        [Display(Name = "類別1")]
        public int CId { get; set; } //? 允許空直

        [ForeignKey("CId")]
        public virtual City City { get; set; }

        [Required(ErrorMessage = "{0}必填")]
        [MaxLength(100)]
        [Display(Name = "餐廳名稱")]
        public string Name { get; set; }

        [MaxLength(100)]
        [Display(Name = "經度")]
        public string Longitude { get; set; }

        [MaxLength(100)]
        [Display(Name = "緯度")]
        public string Latitude { get; set; }

        [MaxLength(100)]
        [Display(Name = "地址")]
        public string Address { get; set; }

        [Display(Name = "營業時間")]

        public string Time { get; set; }


       


        [MaxLength(30)]
        [Display(Name = "電話")]
        public string TEL { get; set; }

        [Display(Name = "照片")]//改欄位名稱
        [MaxLength]//資料型態長度
        public string Image { get; set; }

        [Display(Name = "是否刪除")]
        public bool Isdelete { get; set; }





        [Display(Name = "建立日期")]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        //[DisplayFormat(ApplyFormatInEditMode = true,DataFormatString = "{0:yyyy年MM月dd日}")]
        public DateTime? InitDate { get; set; }





    }
}