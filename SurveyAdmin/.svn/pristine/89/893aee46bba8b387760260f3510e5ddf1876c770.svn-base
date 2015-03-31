using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SurveyAdmin.Models.SurveyInfo
{
    /// <summary>
    /// Encampment Site
    /// </summary>
    public class EncampmentSite
    {
        public int EncampmentSiteId { get; set; }
        public int? CouncilDistrict { get; set; }
        [MaxLength(2000)]
        public string EncampLocation { get; set; }
        [MaxLength(2000)]
        public string EncampDispatchId { get; set; }
        [MaxLength(2000)]
        public string SiteCode { get; set; }
        [MaxLength(2000)]
        public string EncampmentType { get; set; }
        [MaxLength(2000)]
        public string SizeOfEncampment { get; set; }
        [MaxLength(2000)]
        public string EnvironmentalImpact { get; set; }
        [MaxLength(2000)]
        public string VisibilityToThePublic { get; set; }

        public bool Inactive { get; set; }

//        public virtual ICollection<EncampmentVisit> Visits { get; set; }
    }
}