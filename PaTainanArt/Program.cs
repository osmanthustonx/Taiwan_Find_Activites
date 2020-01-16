using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using HtmlAgilityPack;
using twActivitiest.Models;

namespace PaTainanArt
{
    class Program
    {
        static void Main(string[] args)
        {
            Activivtiest db = new Activivtiest();
           


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
            int t = (db.Exhibitions.OrderByDescending(x => x.TainanNo).Select(x => x.TainanNo).FirstOrDefault()) + 1;
            Console.WriteLine("目前最大的編號為:"+Upc);
            for(int i =t ; i <= Upc; i++)
            //for (int i = 1; i <= Upc; i++)
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
                    //if (db.Places.Where(x => x.Name == Isplace).Count() > 0)

                    //{
                        if (htmlh3.ChildNodes[7].ChildNodes[3].InnerHtml.IndexOf("1館") > -1)
                        {
                            exhibition.PId = 2127;
                        }
                        else if (htmlh3.ChildNodes[7].ChildNodes[3].InnerHtml.IndexOf("2館") > -1)

                        {
                            exhibition.PId = 2128;
                        }

                        // exhibition.PId = db.Places.Where(x => x.Name == Isplace).Select(x => x.Id).FirstOrDefault();

                   // }
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
                        string FilePath = $"C:/WebSite/tfa-rocket-coding/upfiles/activitiestImage/{NewFileName}";
                        //存檔路徑

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



                Console.WriteLine(i + "/" + Upc + ":" + exhibition.Name);

            }

            Console.WriteLine("成功");
            Console.ReadKey();
        }


        private static int AddPlace(string placeName, string City)
        {
            Activivtiest db = new Activivtiest();
            Place place = new Place();

            place.CId = db.Citys.Where(x => x.Name == City).Select(x => x.Id).FirstOrDefault();
            place.Name = placeName;

            db.Places.Add(place);
            db.SaveChanges();




            return place.Id;



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
    }
}
