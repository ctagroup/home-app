using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace SurveyPIT.Models
{
    public class PITPersonObserve
    {
        public int PITPersonObserveId { get; set; }
        public int PITHouseholdId { get; set; }
        [MaxLength(10)]
        public string Homeless { get; set; }
        [MaxLength(20)]
        public string AgeRange { get; set; }
        [MaxLength(20)]
        public string Sex { get; set; }
        [MaxLength(20)]
        public string Hispanic { get; set; }
        [MaxLength(100)]
        public string Race { get; set; }
        public string Characteristics { get; set; }
    }
}