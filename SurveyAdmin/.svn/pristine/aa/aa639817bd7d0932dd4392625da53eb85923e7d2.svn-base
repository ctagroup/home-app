using System;
using System.ComponentModel.DataAnnotations;

namespace SurveyAdmin.Models.SurveyInfo
{
    public class EncampmentVisit
    {
        public int EncampmentVisitId { get; set; }
        [Display(Name = "Visit Date")]
        public DateTime VisitDate { get; set; }
        public int EncampmentSiteId { get; set; }
        //Agency and worker get from login
        [MaxLength(20)]
        public string Agency { get; set; }
        [MaxLength(100)]
        [Display(Name = "Writer/Outreach Worker")]
        public string Worker { get; set; }

        [Display(Name = "Reason for Visit")]
        public string Reason4Visit { get; set; }
        [MaxLength(100)]
        public string Referrals { get; set; }
        [Display(Name = "Notes for camp as whole")]
        public string Comments { get; set; }
        [MaxLength(120)]
        public string UserId { get; set; }

        public virtual EncampmentSite Site { get; set; }
    }
}