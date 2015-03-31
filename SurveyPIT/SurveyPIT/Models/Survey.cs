using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SurveyPIT.Models
{
    public class Survey
    {
        public int SurveyId { get; set; }
        [MaxLength(100)]
        public string Title { get; set; }
        [MaxLength(300)]
        public string Description { get; set; }

        public int CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public DateTime? ExpireOn { get; set; }
        public bool Active { get; set; }
        /// <summary>
        /// Filter HUD question ; the question in client section
        /// </summary>
        public string FilterQuestion { get; set; }
        /// <summary>
        /// There should only be one survey per group for PIT
        /// </summary>
        public bool IsPIT { get; set; }
        public bool IsEncampment { get; set; }
    }
}