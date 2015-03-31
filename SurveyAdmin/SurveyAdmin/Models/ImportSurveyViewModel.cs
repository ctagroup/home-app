using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SurveyAdmin.Models
{
    public enum SurveyType
    {
        Survey,
        PIT,
        Encampment
    }

    public class ImportSurveyViewModel
    {
        [Display(Name = "Survey Name")]
        [Required]    
        public string Name { get; set; }

        [Display(Name = "Sheet Name")]
        [Required]
        public string SheetName { get; set; }

        [Required]
        public SurveyType SurveyType { get; set; }

        [Display(Name="Excel Document")]
        [DataType(DataType.Upload)]
        [UIHint("Upload")]
        public HttpPostedFileBase ExcelDocument { get; set; }
    }
}