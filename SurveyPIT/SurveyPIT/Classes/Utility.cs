using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SurveyPIT.Classes
{
    public class Utility
    {
        //constructor
        private Utility() {}
        
        #region Public Properties
        /// <summary>
        /// This is folder path to save upload images
        /// </summary>
        public static string ImagesFolder
        {
            get
            {
                return System.Configuration.ConfigurationManager.AppSettings["imagesFolder"].ToString();
            }
        }
        public static Dictionary<int, string> TypeofLoc 
        {
            get
            {
                return new Dictionary<int, string> {{1, "Street or sidewalk"},{2,"Vehicle (car, truck, van, camper)"},{3,"Park"},{4,"Abandoned building"},{5,"Bus, train station, airport"},
                    {6,"Under bridge/overpass"},{7,"Woods or outdoor encampment"},{8, "Doorway or other private property"},{9,"Other"} };
            }
        }  

        #endregion  //Public Properties


    }
}