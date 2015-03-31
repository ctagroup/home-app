using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace SurveyAdmin.Models.SurveyInfo
{
    public class ClientSurvey
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        [Key]
        public int ClientSurveyId { get; set; }

        [ForeignKey("Client")]
        public int ClientId { get; set; }

        [ForeignKey("Survey")]
        public int SurveyId { get; set; }

        [ForeignKey("User")]
        public int EnteredBy { get; set; }

        public DateTime SurveyDate { get; set; }

        public Client Client { get; set; }
        public virtual Survey Survey { get; set; }
        public virtual ApplicationUser User { get; set; }

        [MaxLength(Int32.MaxValue)]
        public string Notes { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime? SubmissionDate { get; set; }


        public List<ClientSurveyResponse> Responses
        {
            get { return db.ClientSurveyResponses.Where(cs => cs.ClientSurveyId == ClientSurveyId).ToList(); }
        }
    }
}