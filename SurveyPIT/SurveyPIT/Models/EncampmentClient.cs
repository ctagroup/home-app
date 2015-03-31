using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace SurveyPIT.Models
{
    public class EncampmentClient
    {
        public int EncampmentClientId { get; set; }
        public int EncampmentSiteId { get; set; }
        [Display(Name = "Date Moved")]
        public DateTime DateMoved { get; set; }
        public int ClientHMIS { get; set; }
        public string ClientFirstName { get; set; }
        [Display(Name = "General Description")]
        public string GeneralDescr { get; set; }
        public bool Hispanic { get; set; }
        [Display(Name = "Client Nickname/Alias")]
        public string Alias { get; set; }
        public string Gender { get; set; }

    }
}