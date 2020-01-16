using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using twActivitiest.Models;
using System.Data.Linq.SqlClient;
using System.Net.Mail;


namespace twActivitiest.Controllers
{
    public class MemberController : Controller
    {

        private Activivtiest db = new Activivtiest();
        // GET: sys/Member
        public ActionResult Index()
        {
            return View();
        }



        [HttpPost]
        public ActionResult AddMember(Member member)
        {

            if (ModelState.IsValid)//判斷資料是否有誤
            {



                if (db.Members.Where(x => x.Email == member.Email).Count() > 0)//判斷信箱是否有重複
                {



                    return Content("信箱重複申請過了");



                }

                DateTime nowTime = DateTime.Now;
                string source = nowTime.ToString("yyyyMMddhhmmsss");
                MD5 md5Hash = MD5.Create();

                string hash = Utility.GetMd5Hash(md5Hash, source);

                Console.WriteLine("The MD5 hash of " + source + " is: " + hash + ".");

                Console.WriteLine("Verifying the hash...");

                if (Utility.VerifyMd5Hash(md5Hash, source, hash))
                {
                    Console.WriteLine("The hashes are the same.");
                }
                else
                {
                    Console.WriteLine("The hashes are not same.");
                }

                member.MD5 = hash;

                member.PasswordSalt = Utility.CreateSalt();
                member.Password = Utility.GenerateHashWithSalt(member.Password, member.PasswordSalt);
                member.permission = false;
                member.Image = member.Gender == EnumList.GenderType.男 ? "boyAvatar.png" : "girlAvatar.png";
                string sex = member.Gender == EnumList.GenderType.男 ? "先生" : "女士";
                db.Members.Add(member);
                db.SaveChanges();
                sendGMail(member.Email, member.Name, hash, sex);


                return Content("成功");
            }

            return Content("應該有欄位沒有寫唷");



        }

        //確認有沒有重複帳號
        [HttpPost]
        public ActionResult IsReMail(string Mail)
        {
            Member member = db.Members.SingleOrDefault(x => x.Email == Mail);

            if (member == null)
            {
                return Json(1);
            }
            return Json(0);


        }

        //發送驗證信
        private void sendGMail(string tomail, string name, string hash, string sex)
        {




            sendMail mail = new sendMail();
            //mail.fromAddress = "rocketcoding123@gmail.com";
            //mail.fromAddress = "rocketcodingiscool@gmail.com";
            mail.fromAddress = "iloverocketcode@gmail.com";//遠端
            mail.toAddress = tomail;
            mail.Subject = "系統信請勿回覆:" + name + " " + sex + "您好,這是您TFA的會員開通驗證確認信 ";
            mail.MailBody = $"{name} {sex}您好:<br>請進行郵箱驗證來完成您註冊的最後一步,點擊下面連結開通您TFA的會員認證：<br><a target='_blank' rel='nofollow' style='color: #0041D3; text-decoration: underline' href=\"https://tfa.rocket-coding.com/Member/CheckPermission?hash={hash}\">請點我開通認證</a>";
            //郵件內容 （一般是一個網址鏈接，生成隨機數加驗證id參數，點擊去網站驗證。）
            // mail.password = "rocketcoding456";
            //mail.password = "codingiscool";
            mail.password = "rocketcoding";//遠端
            SendGmailMail(mail.fromAddress, mail.toAddress, mail.Subject, mail.MailBody, mail.password);


        }

        public ActionResult CheckPermission(string hash)
        {

            Member member = db.Members.SingleOrDefault(x => x.MD5 == hash);

            if (member == null)
            {
                return Json(false, JsonRequestBehavior.AllowGet);

            }

            member.permission = true;

            db.Entry(member).State = EntityState.Modified;//要被動作的是這個資料庫
            db.SaveChanges();//資料庫更新

            return Json("您的會員驗證成功,請回TFA登入確認,謝謝!", JsonRequestBehavior.AllowGet);


        }





        public class sendMail
        {
            public string fromAddress { get; set; }
            public string toAddress { get; set; }

            public string Subject { get; set; }

            public string MailBody { get; set; }
            public string password { get; set; }
        }

        public static void SendGmailMail(string fromAddress, string toAddress, string Subject, string MailBody, string password)
        {

            MailMessage mailMessage = new MailMessage(fromAddress, toAddress);

            mailMessage.Subject = Subject;//郵件標題
            mailMessage.IsBodyHtml = true;
            mailMessage.Body = MailBody;
            mailMessage.Priority = MailPriority.High;//郵件優先級
            // SMTP Server
            SmtpClient mailSender = new SmtpClient("smtp.gmail.com");
            NetworkCredential basicAuthenticationInfo = new NetworkCredential(fromAddress, password);
            mailSender.Credentials = basicAuthenticationInfo;
            mailSender.Port = 587;
            mailSender.EnableSsl = true;//配合gmail預設開啟驗證

            try
            {

                mailSender.Send(mailMessage);
                mailMessage.Dispose();
            }
            catch
            {
                return;
            }
            mailSender = null;
        }





        public ActionResult EditMember(int? Id)
        {
            if (Id == null)
            {
                return Content("沒有打id");
            }

            Member member = db.Members.Find(Id);

            if (member == null)
            {
                return Content("沒有這筆資料");
            }

            string json = Newtonsoft.Json.JsonConvert.SerializeObject(member);
            return Content(json, "application/json");
        }

        [HttpPost]
        public ActionResult EditMember(Member member, HttpPostedFileBase upfile)
        {

            if (ModelState.IsValid)
            {
                member.Password = (!string.IsNullOrEmpty(member.NewPassword)) ? Utility.GenerateHashWithSalt(member.NewPassword, member.PasswordSalt) : (member.Password);
                if (upfile != null)
                {
                    if (upfile.ContentType.IndexOf("image", System.StringComparison.Ordinal) == -1)
                    {

                        return Content("檔案型態錯誤");
                    }
                    //取得副檔名
                    string extension = upfile.FileName.Split('.')[upfile.FileName.Split('.').Length - 1];
                    //新檔案名稱
                    string fileName = String.Format("{0:yyyyMMddhhmmsss}.{1}", DateTime.Now, extension);
                    string savedName = Path.Combine(Server.MapPath("~/upfiles/images"), fileName);
                    upfile.SaveAs(savedName);



                    member.Image = fileName;



                }
                else
                {
                    member.Image = member.Image;
                }


                member.permission = true;
                db.Entry(member).State = EntityState.Modified;//要被動作的是這個資料庫
                db.SaveChanges();//資料庫更新

                string member1 = JsonConvert.SerializeObject(member);
                return Content(member1);
            }


            return Content("有錯誤");
        }
        [HttpPost]
        public ActionResult EditPhoto(HttpPostedFileBase upfile, int Id)
        {
            if (upfile != null)
            {
                if (upfile.ContentType.IndexOf("image", System.StringComparison.Ordinal) == -1)
                {

                    return Content("檔案型態錯誤");
                }
                //取得副檔名
                string extension = upfile.FileName.Split('.')[upfile.FileName.Split('.').Length - 1];
                //新檔案名稱
                string fileName = String.Format("{0:yyyyMMddhhmmsss}.{1}", DateTime.Now, extension);
                string savedName = Path.Combine(Server.MapPath("~/upfiles/images"), fileName);
                upfile.SaveAs(savedName);

                Member member = db.Members.Find(Id);

                member.Image = fileName;

                db.Entry(member).State = EntityState.Modified;//要被動作的是這個資料庫
                db.SaveChanges();//資料庫更新
                return Content("修改成功");

            }
            return Content("沒修改");


        }





        [HttpPost]
        public ActionResult EditPassword(int Id, string password)
        {
            Member member = db.Members.Find(Id);//取得id
            if (member == null)
            {
                return Content("沒有這筆資料");
            }

            if (!string.IsNullOrEmpty(password))
            {

                member.Password = Utility.GenerateHashWithSalt(password, member.PasswordSalt);
                
                db.Entry(member).State = EntityState.Modified;//要被動作的是這個資料庫
                db.SaveChanges();//資料庫更新
                return Content("修改成功");
            }
            else
                return Content("pls write password");

        }
        [HttpPost]


        public ActionResult Login(string userName, string password)
        {

            Member member = ValidateUser(userName, password);



            if (member != null && member.permission!=false )
            {

                return Content(JsonConvert.SerializeObject(db.Members.Where(x => x.Email == userName && x.Password == member.Password).Select(x => new
                {
                    x.Id,
                    x.Name,
                    x.Birth,
                    x.Gender,
                    x.Email,
                    x.Password,
                    x.PasswordSalt,
                    x.Image


                }).FirstOrDefault()));
            }

            return Content("登入失敗");




        }

        void SetAuthenTicket(string userData, string userId)
        {
            //宣告一個驗證票
            FormsAuthenticationTicket ticket = new FormsAuthenticationTicket(1, userId, DateTime.Now, DateTime.Now.AddHours(2), false, userData);
            //加密驗證票
            string encryptedTicket = FormsAuthentication.Encrypt(ticket);
            //建立Cookie
            HttpCookie authenticationcookie = new HttpCookie(FormsAuthentication.FormsCookieName, encryptedTicket);
            authenticationcookie.Expires = DateTime.Now.AddHours(2);
            //將Cookie寫入回應
            Response.Cookies.Add(authenticationcookie);
        }


        private Member ValidateUser(string userName, string password)
        {
            Member member = db.Members.SingleOrDefault(o => o.Email == userName);
            if (member == null)
            {
                return null;
            }
            string saltPassword = Utility.GenerateHashWithSalt(password, member.PasswordSalt);
            return saltPassword == member.Password ? member : null;
        }

        //忘記密碼
        [HttpPost]
        public ActionResult forgetPassword(string mail, string name)
        {
            var isMail = db.Members.SingleOrDefault(x => x.Email == mail && x.Name == name);

            if (isMail == null)
            {
                return Content("輸入有誤");

            }
            else
            {
                DateTime nowTime = DateTime.Now;
                string source = nowTime.ToString("yyyyMMddhhmmss");
                MD5 md5Hash = MD5.Create();
                string sex = isMail.Gender == EnumList.GenderType.男 ? "先生" : "女士";
                string hash = Utility.GetMd5Hash(md5Hash, source);
                hash = hash.Substring(0, 6);
                isMail.Password = Utility.GenerateHashWithSalt(hash, isMail.PasswordSalt);

                db.Entry(isMail).State = EntityState.Modified;//要被動作的是這個資料庫
                db.SaveChanges();//資料庫更新

                sendforgetGMail(mail, isMail.Name, hash, sex);




            }




            return Content("已寄臨時密碼到您信箱,請收信並更改密碼");

        }
        private void sendforgetGMail(string tomail, string name, string hash, string sex)
        {




            sendMail mail = new sendMail();
            mail.fromAddress = "iloverocketcode@gmail.com";//server端用
            //mail.fromAddress = "rocketcodingstyle@gmail.com";//本地端
            mail.toAddress = tomail;
            mail.Subject = "系統信請勿回覆:" + name + " " + sex + "您好,這是您新密碼 ";
            mail.MailBody = $"{name} {sex}您好:<br>以下是您的新密碼:<br>{hash}" + "<br>請登入TFA後並再修改為新密碼";
            //郵件內容 （一般是一個網址鏈接，生成隨機數加驗證id參數，點擊去網站驗證。）
            mail.password = "rocketcoding";//server端用
            //mail.password = "rockrock123";//本地端用
            SendGmailMail(mail.fromAddress, mail.toAddress, mail.Subject, mail.MailBody, mail.password);


        }






















    }
}