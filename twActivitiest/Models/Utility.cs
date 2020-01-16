using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Entity;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using System.Xml;

namespace twActivitiest.Models
{
    public class Utility
    {

        #region "密碼加密"
        public const int DefaultSaltSize = 5;
        /// <summary>
        /// 產生Salt
        /// </summary>
        /// <returns>Salt</returns>
        public static string CreateSalt()
        {
            RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider();
            byte[] buffer = new byte[DefaultSaltSize];
            rng.GetBytes(buffer);
            return Convert.ToBase64String(buffer);
        }
        ///// <summary>
        ///// 密碼加密
        ///// </summary>
        ///// <param name="password">密碼明碼</param>
        ///// <returns>Hash後密碼</returns>
        //public static string CreateHash(string password)
        //{
        //    string salt = CreateSalt();
        //    string saltAndPassword = String.Concat(password, salt);
        //    string hashedPassword = FormsAuthentication.HashPasswordForStoringInConfigFile(saltAndPassword, "SHA1");
        //    hashedPassword = string.Concat(hashedPassword, salt);
        //    return hashedPassword;
        //}

        /// <summary>
        /// Computes a salted hash of the password and salt provided and returns as a base64 encoded string.
        /// </summary>
        /// <param name="password">The password to hash.</param>
        /// <param name="salt">The salt to use in the hash.</param>
        public static string GenerateHashWithSalt(string password, string salt)
        {
            // merge password and salt together
            string sHashWithSalt = password + salt;
            // convert this merged value to a byte array
            byte[] saltedHashBytes = Encoding.UTF8.GetBytes(sHashWithSalt);
            // use hash algorithm to compute the hash
            HashAlgorithm algorithm = new SHA256Managed();
            // convert merged bytes to a hash as byte array
            byte[] hash = algorithm.ComputeHash(saltedHashBytes);
            // return the has as a base 64 encoded string
            return Convert.ToBase64String(hash);
        }
        #endregion


        #region MD5

        public static string GetMd5Hash(MD5 md5Hash, string input)
        {

            // Convert the input string to a byte array and compute the hash.
            byte[] data = md5Hash.ComputeHash(Encoding.UTF8.GetBytes(input));

            // Create a new Stringbuilder to collect the bytes
            // and create a string.
            StringBuilder sBuilder = new StringBuilder();

            // Loop through each byte of the hashed data 
            // and format each one as a hexadecimal string.
            for (int i = 0; i < data.Length; i++)
            {
                sBuilder.Append(data[i].ToString("x2"));
            }

            // Return the hexadecimal string.
            return sBuilder.ToString();
        }

        // Verify a hash against a string.
        public static bool VerifyMd5Hash(MD5 md5Hash, string input, string hash)
        {
            // Hash the input.
            string hashOfInput = GetMd5Hash(md5Hash, input);

            // Create a StringComparer an compare the hashes.
            StringComparer comparer = StringComparer.OrdinalIgnoreCase;

            if (0 == comparer.Compare(hashOfInput, hash))
            {
                return true;
            }
            else
            {
                return false;
            }
        }


        #endregion





        #region 經緯度演算法


        public double DistanceOfTwoPoints(double lat1, double lng1, double lat2, double lng2)
        {
            double radLng1 = lng1 * Math.PI / 180.0;
            double radLng2 = lng2 * Math.PI / 180.0;
            double a = radLng1 - radLng2;
            double b = (lat1 - lat2) * Math.PI / 180.0;
            double s = 2 * Math.Asin(Math.Sqrt(Math.Pow(Math.Sin(a / 2), 2) +
                Math.Cos(radLng1) * Math.Cos(radLng2) * Math.Pow(Math.Sin(b / 2), 2))
                ) * 6378.137;
            s = Math.Round(s * 10000) / 10000;

            return s;
        }


        #endregion

    }
}