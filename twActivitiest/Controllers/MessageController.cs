using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using twActivitiest.Models;

namespace twActivitiest.Controllers
{
    public class MessageController : Controller
    {
        private Activivtiest db = new Activivtiest();
        // GET: Message
        public ActionResult Index()
        {
            return View();
        }
        #region 新增評論留言
        [HttpPost]
        public ActionResult AddMessage(Message message)
        {

            if (ModelState.IsValid)//判斷資料是否有誤
                                   {
                                   //    if (upfile != null)
                                   //    {
                                   //        if (upfile.ContentType.IndexOf("image", System.StringComparison.Ordinal) == -1)
                                   //        {

                //            return Content("檔案型態錯誤");
                //        }
                //        //取得副檔名
                //        string extension = upfile.FileName.Split('.')[upfile.FileName.Split('.').Length - 1];
                //        //新檔案名稱
                //        string fileName = String.Format("{0:yyyyMMddhhmmsss}.{1}", DateTime.Now, extension);
                //        string savedName = Path.Combine(Server.MapPath("~/upfiles/message"), fileName);
                //        upfile.SaveAs(savedName);

                //        message.Image = fileName;

                //    }

                if (message.Score > 5 || message.Score < 1)
                {
                    return Content("評分分數只能1~5分");
                }


                db.Messages.Add(message);
                db.SaveChanges();


                return Content(JsonConvert.SerializeObject(message));


            }
            return Content("輸入的參數與資料庫資料的比對可能有誤或分數不介於1~5分");



        }
        #endregion


        #region 該活動的所有評論(其他人的)get


        public ActionResult ShowMessage(int EId,int memberId)
        {



            return Content(JsonConvert.SerializeObject(db.Messages.Where(x => x.EId == EId && x.MId!=memberId).Select(x => new
            {
                x.Id,
                MemberName=x.Member.Name,
                MemberImage=x.Member.Image,
                x.Main,
                x.Score,
                x.Image,
                x.time





            }



           )));


            #endregion


        }
        #region 顯示該活動是否有被該登入會員評論過

        public ActionResult IsMessage(int MId, int EId)
        {
            Message message = new Message();
            message = db.Messages.Where(x => x.MId == MId && x.EId == EId).FirstOrDefault();
            if (message == null)
            {
                return Content("沒有留言過");
                //return Content("{'Main':'沒有留言過'}", "application/json");
            }

            return Content(JsonConvert.SerializeObject(db.Messages.Where(x => x.MId == MId && x.EId == EId).Select(x => new
            {

                x.Main,
                MemberName = x.Member.Name,
                MemberImage = x.Member.Image,
                x.Image,
                x.Id,
                x.time,
                score=x.Score


            }).FirstOrDefault()));


            #endregion
        }
        #region 該活動計算平均分數(滿分5 )

        public ActionResult ScoreAVG(int EId)
        {
            float sum = 0;
            float count = db.Messages.Where(x => x.EId == EId).Count();
            if (count > 0)
            {
                foreach (Message ss in db.Messages.Where(x => x.EId == EId))
                {
                    sum += ss.Score;
                }

                float avg = sum / count;


                //string score = !string.IsNullOrEmpty(avg.ToString("#0.0")) ? avg.ToString() : "尚未有使用者評論";
                return Content(avg.ToString("#0.0"));
            }
            else
            {
                return Content("尚未有使用者評論");
            }
        }

        #endregion

        #region 編輯評論
        public ActionResult EditMessage(int EId , int MId)
        {
            if (EId == null || MId==null)
            {
                return Content("沒有打id");
            }

            Message message = new Message();
            message = db.Messages.Where(x => x.MId == MId && x.EId == EId).FirstOrDefault();


            if (message == null)
            {
                return Content("沒有這筆資料");
            }

           ;
            return Content(JsonConvert.SerializeObject(message));
        }


        [HttpPost]
        public ActionResult EditMessage([Bind(Include = "Main,Score,MId,EId,Id")] Message message)
        {
            if (ModelState.IsValid)
            {
                //if (upfile != null)
                //{
                //    if (upfile.ContentType.IndexOf("image", System.StringComparison.Ordinal) == -1)
                //    {

                //        return Content("檔案型態錯誤");
                //    }
                //    //取得副檔名
                //    string extension = upfile.FileName.Split('.')[upfile.FileName.Split('.').Length - 1];
                //    //新檔案名稱
                //    string fileName = String.Format("{0:yyyyMMddhhmmsss}.{1}", DateTime.Now, extension);
                //    string savedName = Path.Combine(Server.MapPath("~/upfiles/message"), fileName);
                //    upfile.SaveAs(savedName);

                //    message.Image = fileName;
                //}
                //else
                //{
                //    message.Image = Request["Image"].ToString();
                //}






                    message.time = DateTime.UtcNow.AddHours(23);

                db.Entry(message).State = EntityState.Modified;
                db.SaveChanges();
                return Content(JsonConvert.SerializeObject(message));
            }


            return Content("沒修改");

        }


            #endregion
        }
}
