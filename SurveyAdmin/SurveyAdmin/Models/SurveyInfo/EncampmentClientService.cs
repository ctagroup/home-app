using System;

namespace SurveyAdmin.Models.SurveyInfo
{
    public class EncampmentClientService
    {
        public int EncampmentClientServiceId { get; set; }
        public int EncampmentClientVisitId { get; set; }
        public int ServiceId { get; set; }
        public System.DateTime CreatedDate { get; set; }
        public Nullable<System.DateTime> UpdatedDate { get; set; }
        public string Status { get; set; }
        public System.DateTime ServiceDate { get; set; }
        public Nullable<int> UserId { get; set; }
        public string NeedServiceId { get; set; }
        /// <summary>
        /// Store all client ids if there is more than one person in a house hold
        /// </summary>
        public string ServiceClientIds { get; set; }
        public Nullable<int> HouseholdId { get; set; }
    }
}