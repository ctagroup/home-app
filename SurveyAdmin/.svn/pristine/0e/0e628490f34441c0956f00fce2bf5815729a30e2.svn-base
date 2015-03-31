using System;
using System.ComponentModel.DataAnnotations;

namespace SurveyAdmin.Models.SurveyInfo
{

    public class Client
    {
        [Key]
        public int ClientId { get; set; }

        //[Required(ErrorMessage = "Birthday is required.")]
        //public DateTime Birthday { get; set; }

        [Required(ErrorMessage = "Latitude is required.")]
        public double Latitude { get; set; }

        [Required(ErrorMessage = "Longtitude is required.")]
        public double Longitude { get; set; }

        [MaxLength(4)]
        public string Last4SSN { get; set; }

        public int? ServicePointClientID { get; set; }
    }
}