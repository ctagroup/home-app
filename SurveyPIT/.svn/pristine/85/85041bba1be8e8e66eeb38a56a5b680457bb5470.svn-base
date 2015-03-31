using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SurveyPIT.Models
{

    /// <summary>
    /// This class store information for unsheltered PIT count
    /// </summary>
    public class PIT
    {

        /// <summary>
        /// constructor
        /// </summary>
        public PIT()
        {
            TotalPeople = 0;
            NoMale = 0;
            NoFemale = 0;
            NoUnable2DetermineSex = 0;
            NoLessthan18 = 0;
            No18to24 = 0;
            No25to55 = 0;
            NoOver55 = 0;
            NoUnable2DetermineAge = 0;
            NoIndividual = 0;
            NoCouple = 0;
            NoFamily = 0;
            NoUnable2DetermineHouseHold = 0;
            TypeOfLocation = 0;
        }
        public int PITId { get; set; }
        /// <summary>
        /// Model: Observation or Interview
        /// </summary>
        public string Model { get; set; }
        /// <summary>
        /// Total number of people who appear to be sleeping at this location
        /// </summary>
        public int TotalPeople { get; set; }
        public int NoMale { get; set; }
        public int NoFemale { get; set; }
        public int NoUnable2DetermineSex { get; set; }
        public int NoLessthan18 { get; set; }
        public int No18to24 { get; set; }
        public int No25to55 { get; set; }
        public int NoOver55 { get; set; }
        public int NoUnable2DetermineAge { get; set; }
        public int NoIndividual { get; set; }
        public int NoCouple { get; set; }
        public int NoFamily { get; set; }
        public int NoUnable2DetermineHouseHold { get; set; }
        public double  Latitude { get; set; }
        public double  Longitude { get; set; }
        public DateTime CreatedDate { get; set; }
        //Hispanic/Latino
        //public int EthnicityHispanic { get; set; }
        //public int EthnicityNonHispanic { get; set; }
        //public string Race { get; set; }
        public int TypeOfLocation { get; set; }
        public int UserId { get; set; }
        public int? ImageId { get; set; }


        //public virtual User User { get; set; }
        public virtual Image Image { get; set; }
    }
}