using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace SurveyPIT.Models
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

        public int QuestionId { get; set; }
        [DataType(DataType.MultilineText)]
        public string QuestionText { get; set; }
        [DataType(DataType.MultilineText)]
        public string Options { get; set; }
        public QType QuestionType { get; set; }
        public int? ParentQuestionId { get; set; }
        public string ParentRequiredAnswer { get; set; }
        public bool Active { get; set; }
        [MaxLength(20)]
        public string TextBoxDataType { get; set; }

    }
}