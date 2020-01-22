using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Net;
using System.Security.Policy;
using HtmlAgilityPack;
using twActivitiest.Models;

namespace paBug
{
    class Program
    {
        static void Main(string[] args)
        {
        Activivtiest db = new Activivtiest();
        WebClient WebWay = new WebClient();


        //string config = ConfigurationManager.ConnectionStrings["ActivitiestConnectionString"]
        //    .ConnectionString;
        //SqlConnection conn1 =new SqlConnection(config);
        //SqlCommand command1 = new SqlCommand("Select * from Places", conn1);
        //SqlDataAdapter dataAdapter = new SqlDataAdapter(command1);//從Command取得資料存入dataAdapter

        //DataTable datatable = new DataTable();//創一個dataset的記憶體資料集

        //dataAdapter.Fill(datatable);//將dataAdapter資料存入dataset


        //WebClient WebWay = new WebClient();
        //var doc1 = new HtmlDocument();

        ////取得首頁第一筆活動的id
        //string htmlstring1 = GetWebContent("https://art.turn.tw/events");

        //doc1.LoadHtml(htmlstring1);

        //HtmlNode indexHtml = doc1.DocumentNode.SelectSingleNode("//h4");
        //int Eno = 0;


        //Eno = Convert.ToInt32(indexHtml.ParentNode.Attributes["href"].Value.Substring(8));

        //var doc2 = new HtmlDocument();


        //for (int i = 1; i <= Eno; i++) //第一次爬使用這個

        //{
        //    string htmlstring2 = GetWebContent("https://art.turn.tw/events/" + i);


        //    doc2.LoadHtml(htmlstring2);

        //    HtmlNode htmlh5 = doc2.DocumentNode.SelectSingleNode("//h5");

        //    string ST = "";
        //    string ET = "";

        //    if (htmlh5 != null)
        //    {


        //        if (htmlh5.NextSibling.NextSibling.InnerHtml != "臺南市美術館")
        //        {
        //            DataRow[] dr = datatable.Select("Name =" + htmlh5.NextSibling.NextSibling.InnerHtml);

        //            if (dr.Length > 0)
        //            {
        //                 = db.Places.Where(x => x.Name == node.NextSibling.NextSibling.InnerHtml)
        //                    .Select(x => x.Id).First();

        //            }
        //            else


        //            {
        //                exhibition.PId = AddPlace(node.NextSibling.NextSibling.InnerHtml.Trim(), node.ParentNode.ParentNode.PreviousSibling.PreviousSibling.ChildNodes[1].InnerText.Substring(0, 2));
        //            }




        //        }
















        //        string sql = File.ReadAllText("~/AddpaBug.sql");


        //        SqlConnection connection = new SqlConnection(config);
        //        SqlCommand command = new SqlCommand(sql, connection);

        //        connection.Open();
        //        command.ExecuteNonQuery();
        //        connection.Close();

        //    }






        //}





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
            Console.WriteLine("目前最新的編號" + Eno);


            int a = (db.Exhibitions.OrderByDescending(x => x.iNo).Select(x => x.iNo).FirstOrDefault()) + 1;
            Console.WriteLine(a);
            //for (int i = 1; i <= Eno; i++)  //第一次爬使用這個
            for (int i = a; i <= Eno; i++)//第二次之後就用這個
            {
                Console.WriteLine("進迴圈囉");
                string htmlstring2 = GetWebContent("https://art.turn.tw/events/" + i);



                doc2.LoadHtml(htmlstring2);

                HtmlNodeCollection htmlh5 = doc2.DocumentNode.SelectNodes("//h5");
                Console.WriteLine("知道node位置");
                string ST = "";
                string ET = "";

                if (htmlh5 != null)
                {
                    Console.WriteLine("node有資料");
                    foreach (HtmlNode node in htmlh5)
                    {
                        Console.WriteLine("進來foreach了");

                        if (node.NextSibling.NextSibling.InnerHtml != "臺南市美術館")
                        {
                            Console.WriteLine("如果沒遇到台南美術館就進來");
                            //node.NextSibling.NextSibling.InnerHtml
                            if (db.Places.Where(x => x.Name == node.NextSibling.NextSibling.InnerHtml).Count() > 0)
                            {
                                Console.WriteLine("地點原本就有了");

                                exhibition.PId = db.Places.Where(x => x.Name == node.NextSibling.NextSibling.InnerHtml)
                                    .Select(x => x.Id).First();

                            }
                            else


                            {
                                Console.WriteLine("地點沒有要新增");
                                exhibition.PId = AddPlace(node.NextSibling.NextSibling.InnerHtml.Trim(), node.ParentNode.ParentNode.PreviousSibling.PreviousSibling.ChildNodes[1].InnerText.Substring(0, 2));
                            }


                            Console.WriteLine("存其他資料");

                            exhibition.Name = node.InnerHtml;


                            ST = node.NextSibling.NextSibling.NextSibling.NextSibling.InnerText.Trim().Substring(0, 10);
                            ET = node.NextSibling.NextSibling.NextSibling.NextSibling.InnerText.Trim().Substring(11)
                                .Trim()
                                .Substring(1);

                            if (!string.IsNullOrEmpty(ST) && !string.IsNullOrEmpty(ET))
                            {
                                Console.WriteLine("有展期時間");
                                exhibition.StartDate = Convert.ToDateTime(ST);
                                exhibition.EndDate = Convert.ToDateTime(ET);
                                exhibition.website = node.NextSibling.NextSibling.NextSibling.NextSibling.NextSibling
                                    .NextSibling
                                    .Element("a").Attributes["href"].Value;
                            }
                            else
                            {
                                Console.WriteLine("沒展期時間");
                                exhibition.StartDate = null;
                                exhibition.EndDate = null;
                                exhibition.website = node.NextSibling.NextSibling.NextSibling.NextSibling
                                    .Element("a").Attributes["href"].Value;
                            }



                            Console.WriteLine("存連結");


                            //exhibition.Image = node.ParentNode.PreviousSibling.PreviousSibling.Attributes["src"].Value;



                            string imageString = node.ParentNode.PreviousSibling.PreviousSibling.Attributes["src"].Value;

                            if (imageString.IndexOf("&#039") > -1)
                            {
                                Console.WriteLine("遇到039");
                                imageString = "NoImage.png";
                                exhibition.Image = imageString;
                            }
                            else
                            {
                                Console.WriteLine("沒遇到039");
                                string[] fileNames = imageString.Split('.');
                                string Extension = fileNames[fileNames.Length - 1];
                                string NewFileName =
                                    String.Format("{0:yyyyMMddhhmmsss}-{1}.{2}", DateTime.Now, i,
                                        Extension); //圖片存檔於您的電腦時的新名稱   ※需適時加副檔名       

                                string url = imageString; //圖片的url
                                string FilePath = $"C:/WebSite/tfa-rocket-coding/upfiles/activitiestImage/{NewFileName}";
                                   // Server.MapPath(String.Format("~/upfiles/activitiestImage/{0}", NewFileName)); //存檔路徑
                                WebWay.DownloadFile(url, FilePath); //利用WebWay這個方法下載至本機(下載路徑,存檔路徑)


                                exhibition.Image = NewFileName;


                            }










                            Console.WriteLine("存iNo編號");

                            exhibition.iNo = i;
                            Console.WriteLine("準備存檔囉");
                            db.Exhibitions.Add(exhibition);
                            Console.WriteLine("存檔囉");
                            db.SaveChanges();
                        }
                    }
                }
                Console.WriteLine(i+"/"+Eno+":"+ exhibition.Name);

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
