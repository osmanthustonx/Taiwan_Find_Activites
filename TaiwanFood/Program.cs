using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using twActivitiest.Models;

namespace TaiwanFood
{
    
    class Program
    {
         

        static void Main(string[] args)
        {

            Activivtiest db = new Activivtiest();
            WebClient WebWay = new WebClient();

            //先刪除整筆資料
            db.Foods.RemoveRange(db.Foods.Where(x => x.Isdelete == true).ToList());
                db.SaveChanges();
            //Console.WriteLine("進台南囉");
            //    getTainanFood();
                Console.WriteLine("進高雄囉");
                getKahFood();
               
            

        }

        private static void getTainanFood()
        {
            Activivtiest db = new Activivtiest();
            WebClient WebWay = new WebClient();

            XmlDocument xmlDoc = new XmlDocument();
            StringBuilder sbB = new StringBuilder();
            string xmlString = GetJsonContent("https://www.twtainan.net/data/shops_zh-tw.xml");

            xmlDoc.LoadXml(xmlString);
            XmlNodeList list = xmlDoc.SelectNodes("/shops/shop");
            Food food = new Food();
            int i = 0;
            foreach (XmlNode node in list)
            {
                //sbB.Append(node.ChildNodes[5].InnerText.Substring(4)+"</br>");

                //px 經度  ; py緯度
                food.Name = node.ChildNodes[1].InnerText;//店名
                food.Longitude = node.ChildNodes[9].InnerText;//緯度Longitude
                food.Latitude = node.ChildNodes[8].InnerText;//經度latitude
                food.Address = node.ChildNodes[5].InnerText.Substring(4);//地址
                food.Time = node.ChildNodes[11].InnerText;//營業時間
                food.TEL = node.ChildNodes[6].InnerText;//電話
                food.Isdelete = true;
                //food.Image = "https://art.turn.tw/img/not-available.png";

                string imageString = "NoImage.png";

                Console.WriteLine(i+":"+food.Name);

                //string[] fileNames = imageString.Split('.');
                //string Extension = fileNames[fileNames.Length - 1];
                //string NewFileName =
                //    String.Format("{0:yyyyMMddhhmmsss}-{1}.{2}", DateTime.Now, i,
                //        Extension); //圖片存檔於您的電腦時的新名稱   ※需適時加副檔名       

                //string url = imageString; //圖片的url
                //string FilePath =
                //    Server.MapPath(String.Format("~/upfiles/restaurant/{0}", NewFileName)); //存檔路徑
                //WebWay.DownloadFile(url, FilePath);
                food.Image = imageString;
                i++;
                food.CId = 4;

                db.Foods.Add(food);
                db.SaveChanges();

            }
            Console.WriteLine("台南成功");
           
        }

        private static void getKahFood()
        {
            Activivtiest db = new Activivtiest();
            WebClient WebWay = new WebClient();
            XmlDocument xmlDoc = new XmlDocument();
            StringBuilder sbB = new StringBuilder();
            string xmlString = GetJsonContent("https://khh.travel/foodxml.aspx");
            xmlString = xmlString.Replace("Listname=\"3\" Language=\"C\" Orgname=\"397000000A\" Updatetime=\"2019 / 12 / 02 23:38:13\"", "");
            xmlDoc.LoadXml(xmlString);
            XmlNodeList list = xmlDoc.SelectNodes("/XML_Head/Infos/Info");
            Food food = new Food();
            int i = 0;
            foreach (XmlNode node in list)
            {
                
                //px 經度  ; py緯度
                food.Name = node.Attributes["Name"].Value;//店名
                food.Longitude = node.Attributes["Px"].Value;//緯度Longitude
                food.Latitude = node.Attributes["Py"].Value;//經度latitude
                food.Address = node.Attributes["Add"].Value;//地址
                food.Time = node.Attributes["Opentime"].Value;//營業時間
                food.TEL = node.Attributes["Tel"].Value;//電話
                food.Isdelete = true;

                food.Image = node.Attributes["Picture1"].Value;//照片



                string imageString = node.Attributes["Picture1"].Value; ;


                if (string.IsNullOrEmpty(imageString))
                {
                    imageString = "NoImage.png";
                    food.Image = imageString;
                }
                else
                {

                    string NewFileName =
                        String.Format("{0:yyyyMMddhhmmsss}-{1}.jpg", DateTime.Now,
                            i); //圖片存檔於您的電腦時的新名稱   ※需適時加副檔名       

                    string url = imageString; //圖片的url
                    //string FilePath = "C:/Users/jingrui/source/repos/twActivitiest/twActivitiest/upfiles/restaurant/"+NewFileName;
                    string FilePath = "C:/WebSite/tfa-rocket-coding/upfiles/restaurant/" + NewFileName;
                    WebWay.DownloadFile(url, FilePath);

                    food.Image = NewFileName;

                }
              
                i++;
                Console.WriteLine(i+":"+food.Name);
                food.CId = 5;

                db.Foods.Add(food);
                db.SaveChanges();

            }

             Console.WriteLine("高雄成功");
             Console.ReadKey();


        }
        private static string GetWebContent(string Url)
        {
            try //程式主執行區或可能發生錯誤的地方
            {
                string targetURI = Url;
                var request = System.Net.WebRequest.Create(targetURI); // Create a request for the URL.
                request.ContentType = "application/json; charset=utf-8";
                string text;
                var response = (System.Net.HttpWebResponse)request.GetResponse();
                using (var sr = new StreamReader(response.GetResponseStream()))
                {
                    text = sr.ReadToEnd();
                }

                return text;
            }
            catch (Exception) //例外的處理方法，如秀出警告
            {
                return string.Empty;
            }
        }
        private static string GetJsonContent(string Url)
        {
            try //程式主執行區或可能發生錯誤的地方
            {
                string targetURI = Url;
                var request = System.Net.WebRequest.Create(targetURI);  // Create a request for the URL.
                request.ContentType = "application/json; charset=utf-8";
                string text;
                var response = (System.Net.HttpWebResponse)request.GetResponse();
                using (var sr = new StreamReader(response.GetResponseStream()))
                {
                    text = sr.ReadToEnd();
                }
                return text;
            }
            catch (Exception) //例外的處理方法，如秀出警告
            {
                return string.Empty;
            }
        }

    }
}
