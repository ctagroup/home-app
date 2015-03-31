namespace SurveyAdmin.Models.SurveyInfo
{
    public class GroupSurvey
    {
        public int GroupSurveyId { get; set; }
        public int GroupId { get; set; }
        public int SurveyId { get; set; }

        //public virtual List<Survey> Surveys { get; set; }
    }
}