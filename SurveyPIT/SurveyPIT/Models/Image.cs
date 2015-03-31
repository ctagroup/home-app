using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SurveyPIT.Models
{
    /// <summary>
    /// Store picture and signature image
    /// </summary>
    public class Image
    {
        public int ImageId { get; set; }
        public int ClientId { get; set; }
        public string path { get; set; }
        public int? ClientSurveyId { get; set; }

        public virtual Client Client { get; set; }
        public virtual ClientSurvey ClientSurvey { get; set; }
    }
}