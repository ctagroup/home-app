using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SurveyPIT.Models
{
    public class SurveyQuestion
    {
        public int SurveyQuestionId { get; set; }
        public int SurveyId { get; set; }
        public int QuestionId { get; set; }
        public int OrderId { get; set; }

        public virtual Survey Survey { get; set; }
        public virtual Question Question { get; set; }
    }
}