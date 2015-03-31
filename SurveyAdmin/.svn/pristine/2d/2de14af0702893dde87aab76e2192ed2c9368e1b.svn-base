using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SurveyAdmin.Models.SurveyInfo
{
    public class Question
    {
        public enum QType
        {
            SinglelineTextBox,//For text answers
            MultilineTextBox, //Not implemented in mobile but will be use for web survey
            SingleSelect, //For dropdown questions that can only have one answer
            SingleSelectRadio, // Radio buttons that have only one answer
            MultiSelect, //For checkbox questions that can have multiple answers
            SinglelineTextBoxForEachOption//For text answers for PIT only
        }

        public Question()
        {
            Children = new List<Question>();
        }

        public int QuestionId { get; set; }
        [DataType(DataType.MultilineText)]
        public string QuestionText { get; set; }
        [DataType(DataType.MultilineText)]
        public string Options { get; set; }
        public QType QuestionType { get; set; }

        [ForeignKey("ParentQuestion")]
        public int? ParentQuestionId { get; set; }

        public virtual Question ParentQuestion { get; set; }

        public string ParentRequiredAnswer { get; set; }
        public bool Active { get; set; }

        public bool Required { get; set; }

        [MaxLength(20)]
        public string TextBoxDataType { get; set; }

        [NotMapped]
        public List<Question> Children { get; private set; } 
    }
}