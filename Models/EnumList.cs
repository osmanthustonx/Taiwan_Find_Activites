using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace ActiviTW.Models
{
    public class EnumList
    {
        public enum EnableTyoe
        {
            開 = 1,
            關 = 0
        }
        public enum BoolinType
        {
            是 = 1,
            否 = 0
        }
        public enum GenderType
        {
            女,
            男
        }
    }
}