using System.Collections.Generic;

namespace SurveyAdmin.Models.SurveyInfo
{
    public class SurveyDTO
    {
        public int SurveyId { get; set; }
        public string Title { get; set; }

        public bool NeedsROIAndImages { get; set; }

        public class QuestionDetail
        {
            public int QuestionId { get; set; }
            public string text { get; set; }

            public string QuestionType { get; set; }
            public string Options { get; set; }
            public int? OrderId { get; set; }
            public int? ParentQuestionId { get; set; }
            public string ParentRequiredAnswer { get; set; }
            public string TextBoxDataType { get; set; }
        }
        /// <summary>
        /// HUD/ Client info in client table
        /// </summary>
        public IEnumerable<QuestionDetail> Client { get; set; }
  
        public IEnumerable<QuestionDetail> SurveyQuestions { get; set; }
  
    }
}