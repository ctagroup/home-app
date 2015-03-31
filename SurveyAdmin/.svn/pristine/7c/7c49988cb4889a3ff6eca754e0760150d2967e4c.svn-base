using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SurveyAdmin.Models.SurveyInfo
{
    public class ClientSurveyResponse
    {
        [Key]
        public int ClientSurveyResponseId { get; set; }
        
        [ForeignKey("ClientSurvey")]
        public int ClientSurveyId { get; set; }

        [ForeignKey("Question")]
        public int QuestionId { get; set; }

        public string Value { get; set; }

        public virtual ClientSurvey ClientSurvey { get; set; }
        public virtual Question Question { get; set; }

    }
}