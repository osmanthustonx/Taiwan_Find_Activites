using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace twActivitiest.Models
{
    public class Exhibition
    {
        [Key]
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }



        [Display(Name = "類別1")]
        public int PId { get; set; } //? 允許空直

        [ForeignKey("PId")]
        public virtual Place Place { get; set; }



        [Required(ErrorMessage = "{0}必填")]
        [MaxLength]
        [Display(Name = "活動名稱")]
        public string Name { get; set; }


        [Display(Name = "開始日期")]
       
        public DateTime? StartDate { get; set; }


        [Display(Name = "結束日期")]

        public DateTime? EndDate { get; set; }

        [Display(Name = "照片")]//改欄位名稱
        [MaxLength]//資料型態長度
        public string Image { get; set; }


        [Display(Name = "官網連結")]//改欄位名稱
        [MaxLength]//資料型態長度
        public string website { get; set; }





        [Display(Name = "小藝網址參數")]//改欄位名稱
      
        public int iNo{ get; set; }


        [Display(Name = "台南美術館網址參數")]//改欄位名稱
  
        public int TainanNo { get; set; }


      


        [Display(Name = "建立日期")]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        //[DisplayFormat(ApplyFormatInEditMode = true,DataFormatString = "{0:yyyy年MM月dd日}")]
        public DateTime? InitDate { get; set; }

        public virtual ICollection<Favorite> Favorites { get; set; }
        public virtual ICollection<Message> Messages { get; set; }


    }
}