using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SurveyAdmin.Models.SurveyInfo
{
    public class ROI
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("ClientSurvey")]
        public int ClientSurveyId { get; set; }
        public virtual ClientSurvey ClientSurvey { get; set; }

        [ForeignKey("User")]
        public int EnteredBy { get; set; }
        public virtual ApplicationUser User { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public DateTime Date { get; set; }
    }
}