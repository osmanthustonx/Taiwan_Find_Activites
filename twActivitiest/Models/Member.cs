using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using static twActivitiest.Models.EnumList;

namespace twActivitiest.Models
{
    public class Member
    {
        [Key]
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

        public int Id { get; set; }

        [Required(ErrorMessage = "{0}必填")]
        [MaxLength(50)]
        [Display(Name = "姓名")]
        public string Name { get; set; }


        [Display(Name = "生日")]
        public DateTime Birth { get; set; }


        [Display(Name = "性別")]
        public GenderType Gender { get; set; }

        [Required(ErrorMessage = "{0}必填")]
        [EmailAddress(ErrorMessage = "{0}格式錯誤")]
        [MaxLength(200)]
        [DataType(DataType.EmailAddress)]
        [Display(Name = "E-mail")]
        public string Email { get; set; }

        [Required(ErrorMessage = "{0}必填")]
        [DataType(DataType.Password)]
        [StringLength(100, ErrorMessage = "{0} 長度至少必須為 {2} 個字元。", MinimumLength = 4)]
        [Display(Name = "密碼")]
        public string Password { get; set; }

        [MaxLength(100)]
        [Display(Name = "密碼鹽")]
        public string PasswordSalt { get; set; }


        [Display(Name = "照片")]//改欄位名稱
        [MaxLength]//資料型態長度
        public string Image { get; set; }

        [Display(Name = "是否認證")]
        public bool permission { get; set; }

        [Display(Name = "MD5")]
        [MaxLength]
        public string MD5 { get; set; }

      

 




        [Display(Name = "建立日期")]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        //[DisplayFormat(ApplyFormatInEditMode = true,DataFormatString = "{0:yyyy年MM月dd日}")]
        public DateTime? InitDate { get; set; } = DateTime.UtcNow.AddHours(23);

        [NotMapped]
        public string NewPassword { get; set; }


        [JsonIgnore]
        public virtual ICollection<Favorite> Favorites { get; set; }

        [JsonIgnore]
        public virtual ICollection<Message> Messages { get; set; }
    }
}