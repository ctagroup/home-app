using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SurveyPIT.Models
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