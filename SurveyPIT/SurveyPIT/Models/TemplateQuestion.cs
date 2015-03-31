using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SurveyPIT.Models
{
    public class TemplateQuestion
    {
        public int TemplateQuestionId { get; set; }
        public int TemplateId { get; set; }
        public int QuestionId { get; set; }
        public int OrderId { get; set; }
    }
}