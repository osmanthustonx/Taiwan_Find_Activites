using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Xml;
using twActivitiest.Models;
using System.Device.Location;
using System.Drawing;
using System.Net;
using Newtonsoft.Json;

namespace twActivitiest.Controllers
{

    public class FoodDataController : Controller
    {
        private Activivtiest db = new Activivtiest();
        WebClient WebWay = new WebClient();
        // GET: FoodData

        #region 爬蟲美食
        public ActionResult saveFood()
        {
            //先刪除整筆資料
            db.Foods.RemoveRange(db.Foods.Where(x=>x.Isdelete==true).ToList());
            db.SaveChanges();

            //getTainanFood();
            getKahFood();
            return Content("成功");
        }


        private ActionResult getTainanFood()
        {
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

            return Content("台南成功");
        }

        private ActionResult getKahFood()
        {
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
                    string FilePath =
                        Server.MapPath(String.Format("~/upfiles/restaurant/{0}", NewFileName)); //存檔路徑
                    WebWay.DownloadFile(url, FilePath);

                    food.Image = NewFileName;

                }

                i++;

                food.CId = 5;

                db.Foods.Add(food);
                db.SaveChanges();

            }

            return Content("高雄成功");


        }
        #endregion





        #region 爬蟲展覽

        public ActionResult saveActivity()
        {
            Exhibition exhibition = new Exhibition();
            StringBuilder sbB = new StringBuilder();

            // From String
            var doc1 = new HtmlDocument();

            //取得首頁第一筆活動的id
            string htmlstring1 = GetWebContent("https://art.turn.tw/events");


            doc1.LoadHtml(htmlstring1);

            HtmlNode indexHtml = doc1.DocumentNode.SelectSingleNode("//h4");
            int Eno = 0;


            Eno = Convert.ToInt32(indexHtml.ParentNode.Attributes["href"].Value.Substring(8));


            //return Content(Eno.ToString())

            var doc2 = new HtmlDocument();
            //for (int i = (db.Exhibitions.OrderByDescending(x => x.iNo).Select(x => x.iNo).FirstOrDefault()) + 1; i <= Eno; i++)//第二次之後就用這個

            for (int i = 1; i <= Eno; i++)  //第一次爬使用這個

            {
                string htmlstring2 = GetWebContent("https://art.turn.tw/events/" + i);



                doc2.LoadHtml(htmlstring2);

                HtmlNodeCollection htmlh5 = doc2.DocumentNode.SelectNodes("//h5");

                string ST = "";
                string ET = "";

                if (htmlh5 != null)
                {
                    foreach (HtmlNode node in htmlh5)
                    {

                        if (node.NextSibling.NextSibling.InnerHtml != "臺南市美術館")
                        {
                            //node.NextSibling.NextSibling.InnerHtml
                            if (db.Places.Where(x => x.Name == node.NextSibling.NextSibling.InnerHtml).Count() > 0)
                            {
                                exhibition.PId = db.Places.Where(x => x.Name == node.NextSibling.NextSibling.InnerHtml)
                                    .Select(x => x.Id).First();

                            }
                            else


                            {
                                exhibition.PId = AddPlace(node.NextSibling.NextSibling.InnerHtml.Trim(), node.ParentNode.ParentNode.PreviousSibling.PreviousSibling.ChildNodes[1].InnerText.Substring(0, 2));
                            }




                            exhibition.Name = node.InnerHtml;


                            ST = node.NextSibling.NextSibling.NextSibling.NextSibling.InnerText.Trim().Substring(0, 10);
                            ET = node.NextSibling.NextSibling.NextSibling.NextSibling.InnerText.Trim().Substring(11)
                                .Trim()
                                .Substring(1);

                            if (!string.IsNullOrEmpty(ST) && !string.IsNullOrEmpty(ET))
                            {
                                exhibition.StartDate = Convert.ToDateTime(ST);
                                exhibition.EndDate = Convert.ToDateTime(ET);
                                exhibition.website = node.NextSibling.NextSibling.NextSibling.NextSibling.NextSibling
                                    .NextSibling
                                    .Element("a").Attributes["href"].Value;
                            }
                            else
                            {
                                exhibition.StartDate = null;
                                exhibition.EndDate = null;
                                exhibition.website = node.NextSibling.NextSibling.NextSibling.NextSibling
                                    .Element("a").Attributes["href"].Value;
                            }






                            //exhibition.Image = node.ParentNode.PreviousSibling.PreviousSibling.Attributes["src"].Value;



                            string imageString = node.ParentNode.PreviousSibling.PreviousSibling.Attributes["src"].Value;

                            if (imageString.IndexOf("&#039") > -1)
                            {
                                imageString = "NoImage.png";
                                exhibition.Image = imageString;
                            }
                            else
                            {
                                string[] fileNames = imageString.Split('.');
                                string Extension = fileNames[fileNames.Length - 1];
                                string NewFileName =
                                    String.Format("{0:yyyyMMddhhmmsss}-{1}.{2}", DateTime.Now, i,
                                        Extension); //圖片存檔於您的電腦時的新名稱   ※需適時加副檔名       

                                string url = imageString; //圖片的url
                                string FilePath =
                                    Server.MapPath(String.Format("~/upfiles/activitiestImage/{0}", NewFileName)); //存檔路徑
                                WebWay.DownloadFile(url, FilePath); //利用WebWay這個方法下載至本機(下載路徑,存檔路徑)


                                exhibition.Image = NewFileName;


                            }












                            exhibition.iNo = i;
                            db.Exhibitions.Add(exhibition);
                            db.SaveChanges();
                        }
                    }
                }

            }

            return Content("成功");

        }
        private int AddPlace(string placeName, string City)
        {

            Place place = new Place();

            place.CId = db.Citys.Where(x => x.Name == City).Select(x => x.Id).FirstOrDefault();
            place.Name = placeName;

            db.Places.Add(place);
            db.SaveChanges();




            return place.Id;



        }





        #endregion


        #region 爬蟲台南美術館

        public ActionResult saveTainan()
        {
            Exhibition exhibition = new Exhibition();
            WebClient WebWay = new WebClient();

            //展覽預告區
            var doc1 = new HtmlDocument();
            string htmlstring1 = GetWebContent("https://www.tnam.museum/exhibition/upcoming");//取得網頁

            doc1.LoadHtml(htmlstring1);//html節點

            HtmlNode htmlUpcoming = doc1.DocumentNode.SelectSingleNode("//figure/a");

            int Upc = 0;


            Upc = Convert.ToInt32(htmlUpcoming.Attributes["href"].Value.Substring(18));


            string a = "";
            string image = "https://www.tnam.museum/";


            var doc2 = new HtmlDocument();
            //for(int i = (db.Exhibitions.OrderByDescending(x => x.TainanNo).Select(x => x.TainanNo).FirstOrDefault())+1; i <= Upc; i++)
            for (int i = 1; i <= Upc; i++)
            {
                image = "https://www.tnam.museum/";
                string htmlstring2 = GetWebContent("https://www.tnam.museum/exhibition/detail/" + i);
                doc2.LoadHtml(htmlstring2);
                //HtmlNode htmlh3= doc2.DocumentNode.SelectSingleNode("//*[@id=\"main\"]/div/div[2]/div[3]/div[1]");
                HtmlNode htmlh3 = doc2.DocumentNode.SelectSingleNode("//div[@class='info']");
                //span[@class='tocnumber']//讓節點位置跑到指定的class name

                if (htmlh3 != null)
                {


                    exhibition.Name = htmlh3.ChildNodes[1].ChildNodes[3].InnerHtml;
                    exhibition.StartDate = Convert.ToDateTime(htmlh3.ChildNodes[5].ChildNodes[3].InnerHtml.Trim()
                        .Substring(0, 10).Trim());
                    exhibition.EndDate = Convert.ToDateTime(htmlh3.ChildNodes[5].ChildNodes[3].InnerHtml.Trim()
                        .Substring(18).Trim().Substring(1).Trim().Substring(0, 10));
                    exhibition.website = "https://www.tnam.museum/exhibition/detail/" + i;
                    string Isplace = htmlh3.ChildNodes[7].ChildNodes[3].InnerHtml.Trim();

                    //判斷是否為新地點
                    if (db.Places.Where(x => x.Name == Isplace).Count() > 0)

                    {
                        if (htmlh3.ChildNodes[7].ChildNodes[3].InnerHtml.IndexOf("1館") > -1)
                        {
                            exhibition.PId = 2127;
                        }
                        else if (htmlh3.ChildNodes[7].ChildNodes[3].InnerHtml.IndexOf("2館") > -1)

                        {
                            exhibition.PId = 2128;
                        }

                        // exhibition.PId = db.Places.Where(x => x.Name == Isplace).Select(x => x.Id).FirstOrDefault();

                    }
                    else
                    {
                        if (htmlh3.ChildNodes[7].ChildNodes[3].InnerHtml.IndexOf("美術館") > -1)
                        {
                            exhibition.PId = 2127;
                        }
                        else
                        {
                            continue;
                            //if (!string.IsNullOrEmpty(htmlh3.ChildNodes[7].ChildNodes[3].InnerHtml.Trim()))
                            //{
                            //    exhibition.PId = AddPlace(htmlh3.ChildNodes[7].ChildNodes[3].InnerHtml.Trim(), "台南");
                            //}
                            //else
                            //{
                            //    continue;
                            //}

                        }




                    }


                    HtmlNode htmlImage = doc2.DocumentNode.SelectSingleNode("//figure[@class='media']");

                    //判斷是否有圖片
                    if (htmlImage != null)
                    {
                        string imageString = htmlImage.ChildNodes[1].Attributes["src"].Value;

                        image += imageString;

                        string[] fileNames = image.Split('.');
                        string Extension = fileNames[fileNames.Length - 1];
                        string NewFileName =
                            String.Format("{0:yyyyMMddhhmmsss}-{1}.{2}", DateTime.Now, i,
                                Extension); //圖片存檔於您的電腦時的新名稱   ※需適時加副檔名       

                        string url = image; //圖片的url
                        string FilePath =
                            Server.MapPath(String.Format("~/upfiles/activitiestImage/{0}", NewFileName)); //存檔路徑
                        WebWay.DownloadFile(url, FilePath); //利用WebWay這個方法下載至本機(下載路徑,存檔路徑)


                        exhibition.Image = NewFileName;

                    }
                    else
                    {
                        image = "NoImage.png";
                        //string[] fileNames = image.Split('.');
                        //string Extension = fileNames[fileNames.Length - 1];
                        //string NewFileName =
                        //    String.Format("{0:yyyyMMddhhmmsss}-{1}.{2}", DateTime.Now, i,
                        //        Extension); //圖片存檔於您的電腦時的新名稱   ※需適時加副檔名       

                        //string url = image; //圖片的url
                        //string FilePath =
                        //    Server.MapPath(String.Format("~/upfiles/activitiestImage/{0}", NewFileName)); //存檔路徑
                        //WebWay.DownloadFile(url, FilePath); //利用WebWay這個方法下載至本機(下載路徑,存檔路徑)
                        exhibition.Image = image;
                    }


                    //images / filesys / images / ch /event/24_.jpg
                    // https://www.tnam.museum/images/filesys/images/ch/event/24_.jpg



                    //從網站儲存圖片




                    exhibition.TainanNo = i;


                    db.Exhibitions.Add(exhibition);
                    db.SaveChanges();


                    //return Content(NewFileName);


                }



                //將圖片轉乘最大多少寬度

            }


            return Content("成功");

        }
        protected void ChangeImageSize(string FileName, string FilePath, int SmallHeight)
        {
            System.Drawing.Image img = System.Drawing.Image.FromFile(FilePath + FileName);
            //絕對路徑，http://wangshifuola.blogspot.com/2011/10/aspnetimage-resize.html
            System.Drawing.Imaging.ImageFormat ThisFormat = img.RawFormat;

            int FixHeight = SmallHeight;
            int FixWidth = FixHeight * img.Width / img.Height;
            Bitmap ImgOutput = new Bitmap(img, FixWidth, FixHeight);
            ImgOutput.Save(FilePath + "s" + FileName, ThisFormat);
            img.Dispose();
            ImgOutput.Dispose();

        }



        #endregion


        #region 爬蟲教學相關
        public ActionResult getXML()
        {
            XmlDocument xmlDoc = new XmlDocument();
            xmlDoc.Load("https://app.ktec.gov.tw/index.php/jobktec/api/worklist?AREA=800&JOBNO=01&type=xml");//載入
            string ss = "";
            var root = xmlDoc.DocumentElement;// 取得root
            foreach (XmlNode node in root.ChildNodes)//取得root的兒子
            {


                ss += node.Name + "</br>";

                //    var json = Newtonsoft.Json.JsonConvert.SerializeObject(node.Name);
                //    return Content(json, "application/json");


            }

            //foreach (XmlNode node in root.FirstChild.ChildNodes)//取得firstchild 為所在的第一個標籤;ChildNodes下一層的子標籤
            //{

            //    //foreach (XmlNode childnode in node.ChildNodes)
            //    //{
            //    //    ss += childnode.InnerText + "</br>";
            //    //}
            //    ss += node.FirstChild.InnerText + "</br>";

            //}




            return Content(ss);

            // xmlDoc.LoadXml("");//抓硬碟,放路徑變數





        }

        public ActionResult getXML_XPATH()//XPath判斷是否需要namespace,須將資料存進字串將第一段string xmlns取代掉
        {


            StringBuilder sbB = new StringBuilder();

            XmlDocument xmlDoc = new XmlDocument();
            string xmlString = GetJsonContent("https://app.ktec.gov.tw/index.php/jobktec/api/worklist?AREA=800&JOBNO=01&type=xml");
            xmlString = xmlString.Replace("xmlns=\"http://tempuri.org/TainanworkService/GetData\"", "");
            xmlDoc.LoadXml(xmlString);
            XmlElement root = xmlDoc.DocumentElement;//找到root節點
            XmlNodeList list = xmlDoc.SelectNodes("//Job_Info");//xpath
                                                                //另一種寫法("/string/Dataset/Company_Info/COMP_NAME")
            foreach (XmlNode node in list)
            {
                sbB.Append(node.ParentNode.ChildNodes[0].InnerText + "</br>");//ParentNode :找爸爸 ;ChildNodes[0] :第一個兒子
                foreach (XmlNode child in node.ChildNodes)
                {
                    sbB.Append(child.Name + ":" + child.InnerText + "</br>");

                }



            }
            return Content(sbB.ToString());
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
        public ActionResult TEST()
        {

            string htmlstring = GetWebContent("http://www.kecc.com.tw/tw/calendarList.asp");//展覽館網址
            StringBuilder sbB = new StringBuilder();                                                                             // From String
            var doc = new HtmlDocument();
            doc.LoadHtml(htmlstring);

            var htmlh3 = doc.DocumentNode.SelectNodes("//h3");



            foreach (HtmlNode node in htmlh3)
            {
                //sbB.Append(node.ParentNode.PreviousSibling.PreviousSibling.ChildNodes[0].FirstChild.OuterHtml);
                //string img = node.ParentNode.PreviousSibling.PreviousSibling.ChildNodes[1].OuterHtml.Replace("../", "http://www.kecc.com.tw/") + "</br>";
                string img = node.ParentNode.PreviousSibling.PreviousSibling.ChildNodes[1].Element("img").Attributes["src"].Value;

                img = img.Replace("../", "http://www.kecc.com.tw/");
                sbB.Append(img + "</br>");
                //sbB.Append(node.ParentNode.PreviousSibling.PreviousSibling.ChildNodes[1].Attributes["src"].Value.Replace("../", "http://www.kecc.com.tw/") +"</br>");

                sbB.Append(node.InnerText + "</br>");
                sbB.Append(node.NextSibling.NextSibling.NextSibling.NextSibling.InnerText + "</br>");//NextSibling代表下一個兄弟
                sbB.Append(node.NextSibling.NextSibling.NextSibling.NextSibling.NextSibling.NextSibling.InnerText + "</br>");

                //foreach (HtmlNode nodechild in node.ChildNodes)
                //{
                //    sbB.Append(nodechild.OuterHtml);
                //}
                //innerTEXT 沒標籤
                //innerHTML 抓標籤
                //OutHtml 修出所有屬性

            }

            return Content(sbB.ToString());




        }









        private static string GetWebContent(string Url)
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


        #endregion


        #region 顯示場地x公里內的美食與顯示距離
        [HttpPost]
        public ActionResult PlaceNearFood(double lat, double lng)
        {

            var coord = new GeoCoordinate(lat, lng);
            var foods = db.Foods.Where(x => !(string.IsNullOrEmpty(x.Latitude)) || !(string.IsNullOrEmpty(x.Longitude))).ToList();
            var Newfoods = foods.Select(x => new
            {
                Id = x.Id,
                Name = x.Name,
                lat = x.Latitude,
                lng = x.Longitude,
                add = x.Address,
                optime = x.Time,
                tel = x.TEL,
                Photo = x.Image,
                Dis = (int)(new GeoCoordinate(double.Parse(x.Latitude), double.Parse(x.Longitude))).GetDistanceTo(coord)
                 ,
                DisView = (int)(new GeoCoordinate(double.Parse(x.Latitude), double.Parse(x.Longitude))).GetDistanceTo(coord) >= 1000
                ? ((double)(new GeoCoordinate(double.Parse(x.Latitude), double.Parse(x.Longitude))).GetDistanceTo(coord) / 1000.0).ToString("0.0") + "KM"
                 : (int)(new GeoCoordinate(double.Parse(x.Latitude), double.Parse(x.Longitude))).GetDistanceTo(coord) + "M"



            }


             );


            return Content(JsonConvert.SerializeObject(Newfoods.Where(x => x.Dis <= 1000).OrderBy(x => x.Dis)), "application/json");


        }


        #endregion






    }
}