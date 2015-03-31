using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace SurveyPIT.Models
{
    /// <summary>
    /// Encampment Site
    /// </summary>
    public class EncampmentSite
    {
        public int EncampmentSiteId { get; set; }
        public int CouncilDistrict { get; set; }
        [MaxLength(400)]
        public string EncampLocation { get; set; }
        [MaxLength(30)]
        public string EncampDispatchId { get; set; }
        [MaxLength(20)]
        public string SiteCode { get; set; }
        [MaxLength(100)]
        public string EncampmentType { get; set; }
        [MaxLength(10)]
        public string SizeOfEncampment { get; set; }
        [MaxLength(10)]
        public string EnvironmentalImpact { get; set; }
        [MaxLength(10)]
        public string VisibilityToThePublic { get; set; }

        public bool Inactive { get; set; }

        public virtual ICollection<EncampmentVisit> Visits { get; set; }
    }
}