using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SurveyAdmin.Models.SurveyInfo
{

    public class PIT
    {
        public int PITId { get; set; }
        public double  Latitude { get; set; }
        public double  Longitude { get; set; }
        public DateTime CreatedDate { get; set; }

        [Display(Name = "Gender")]
        public string GenderAnswer { get; set; }
        [Display(Name="Age")]
        public string AgeAnswer { get; set; }
        [Display(Name="Family Status")]
        public string FamilyAnswer { get; set; }
        [Display(Name="Dwelling")]
        public string DwellingAnswer { get; set; }
        [Display(Name="Location")]
        public string LocationAnswer { get; set; }

        public int UserId { get; set; }
        public int HouseholdId { get; set; }

        [ForeignKey("UserId")]
        public virtual ApplicationUser User { get; set; }

        [MaxLength(Int32.MaxValue)]
        public string Notes { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime? SubmissionDate { get; set; }
    }
}