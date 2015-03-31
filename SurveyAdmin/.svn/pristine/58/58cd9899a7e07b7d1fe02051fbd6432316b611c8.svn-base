using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SurveyAdmin.Models.SurveyInfo
{
    /// <summary>
    /// Store picture and signature image
    /// </summary>
    public class Image
    {
        [Key]
        public int ImageId { get; set; }

        [ForeignKey("Client")]
        public int ClientId { get; set; }
        [ForeignKey("ClientSurvey")]
        public int? ClientSurveyId { get; set; }

        public string path { get; set; }


        public virtual Client Client { get; set; }
        public virtual ClientSurvey ClientSurvey { get; set; }
    }
}