using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SurveyPIT.Models
{
    public class ClientSurveyResponse
    {
        public int ClientSurveyResponseId { get; set; }
        public int ClientSurveyId { get; set; }
        public int QuestionId { get; set; }
        public string Value { get; set; }

        public virtual ClientSurvey ClientSurvey { get; set; }
        public virtual Question Question { get; set; }

    }
}