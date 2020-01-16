using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Data.Entity;
using System.Web.Mvc;
using twActivitiest.Models;

namespace twActivitiest.Controllers
{
    public class IndexController : Controller
    {
        private Activivtiest db = new Activivtiest();
        // GET: Index
        public ActionResult Index()
        {
            return View();
        }
        #region 下拉式選單
        public ActionResult ShowPlace()
        {
            return  Content(JsonConvert.SerializeObject(db.Places.OrderBy(p=>p.Id).Select(x => new { 
            
                label = x.Name,
                value= x.Name,
                key=x.Name,
                lng=x.Longitude,
                lat=x.Latitude,
                city=x.City.Name


            }).ToList()));

            
        }

        public ActionResult ShowCity()
        {
            return Content(JsonConvert.SerializeObject(db.Citys.OrderBy(p => p.Id).Select(x => new {

                label = x.Name,
                value = x.Name,
                key=x.Name


            }).ToList()));




        }
        #endregion



 
        #region 顯示展覽資料



        [HttpPost]
        
        public ActionResult ShowData(string place , string city,DateTime date,int MemberID)
        {
            var favorite = db.Favorites.Select(x => new
            {
                x.Id,
                x.EId,
                x.MId
            });


            return Content(JsonConvert.SerializeObject(db.Exhibitions.Where(x => x.StartDate <= date && x.EndDate >= date && (string.IsNullOrEmpty(place) ? (1 == 1) : (x.Place.Name == place)) && (string.IsNullOrEmpty(city) ? (2 == 2) : (x.Place.City.Name == city)) ).Select(x => new
            {
                x.Id,
                Name=x.Name,
                Place=x.Place.Name,
                x.Image,
                x.StartDate,
                x.EndDate,
                x.website,
                x.Place.Latitude,
                x.Place.Longitude,
                IsFavorite = (favorite.Where(y=>y.MId==MemberID &&y.EId==x.Id).Count()>0)?"":"-empty"
                

                

            }
            
            
            
           )));


        }

        [HttpPost]

        public ActionResult SingleActivity(int MId , int EId)
        {
          //  string SD = db.Exhibitions.Where(x => x.Id == EId).Select(x => x.StartDate).FirstOrDefault().ToString();
            //string ED= db.Exhibitions.Where(x => x.Id == EId).Select(x => x.EndDate).FirstOrDefault().ToString();
            var exhibition = db.Exhibitions.Where(x => x.Id == EId).Select(x=>new
            {
                x.Id,x.Name,x.website,x.StartDate,x.EndDate,
                x.Image,lng=x.Place.Longitude,lat=x.Place.Latitude,
                Place=x.Place.Name,
                MessageCount=x.Messages.Count,
                IsFavorite=x.Favorites.Where(y=> y.MId == MId && y.EId == EId).Count()>0? "":"-empty"

            }).FirstOrDefault();


            return Content(JsonConvert.SerializeObject(exhibition));
        }

        //public ActionResult Isfavorite(int MId)
        //{
        //    var favorite = db.Favorites.Select(x => new
        //    {
        //        x.Id,
        //        x.EId,
        //        x.MId
        //    });



            //}








            #endregion
            #region 收藏相關
            //收藏與取消
        [HttpPost]
        public ActionResult AddFavorite(int MId,int EId)
        {
            Favorite favorite = new Favorite();

            favorite = db.Favorites.Where(x => x.MId==MId && x.EId==EId).FirstOrDefault();
                if (favorite!=null)
                {
                    



                    db.Favorites.Remove(favorite);
                    db.SaveChanges();

                   
                    return Json(0);


                }
            Favorite favorite1 = new Favorite();
            favorite1.MId = MId;
                favorite1.EId = EId;

                db.Favorites.Add(favorite1);
                db.SaveChanges();
                return Json(1);


            
        }

        //get 該展覽是否有被該帳號收藏(判斷愛心是否有顏色)
        public ActionResult IsFavorite(int MId, int EId)
        {
            Favorite favorite = db.Favorites.Where(x => x.MId == MId && x.EId == EId).FirstOrDefault();
            if (favorite == null)
            {
                return Content("No");
            }
            else
                return Content("Yes");


        }
        //個人收藏頁面
        //單純只能取消收藏
        [HttpPost]
        public ActionResult CancelFavorite(int MId, int EId)
        {
            Favorite favorite = new Favorite();

            favorite = db.Favorites.Where(x => x.MId == MId && x.EId == EId).FirstOrDefault();
            if (favorite != null)
            {



                db.Favorites.Remove(favorite);
                db.SaveChanges();
                return Content("取消收藏成功");


            }
            
            return Content("原本就沒收藏");



        }


        //收藏頁 取得登入會員的所有收藏

        public ActionResult ShowFavorite(int MId)
        {
           return Content(JsonConvert.SerializeObject(db.Favorites.Where(x => x.MId == MId).Select(x=> new
            {id=x.Exhibition.Id,
               name= x.Exhibition.Name,
               place=x.Exhibition.Place.Name,
               x.Exhibition.StartDate,x.Exhibition.EndDate,
               Image=x.Exhibition.Image,
               lng=x.Exhibition.Place.Longitude,
               lat=x.Exhibition.Place.Latitude
              

            }
                ))); 
            


        }


        #endregion

    }
}