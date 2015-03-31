using System.ComponentModel.DataAnnotations;

namespace SurveyAdmin.Models.SurveyInfo
{
    public class Template
    {
        public int TemplateId { get; set; }

        [MaxLength(100)]
        public string Name { get; set; }
        /// <summary>
        /// CTA define template
        /// </summary>
        public bool IsInternal { get; set; }
        public bool Active { get; set; }

    }
}