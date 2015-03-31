using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using SurveyPIT.Models;
using SurveyPIT.DAL;

namespace SurveyPIT.Controllers
{
    public class PITController : ApiController
    {
        private SurveyDBContext db = new SurveyDBContext();
        [ResponseType(typeof(SurveyDTO))]
        public SurveyDTO GetPIT()
        {
            //get user group survey for now assumed group= 1
            //get PIT survey for group 1
            int id = 3;
            Survey survey = db.Surveys.Find(id);
            if (survey == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }
            List<SurveyQuestion> sQuestions = db.SurveyQuestions.Where(sq => sq.SurveyId == id).ToList();

            //Join surveyQuestion table with Question table base on survey Id
            List<SurveyDTO.QuestionDetail> surveyQs = sQuestions
                            .Where(s => s.SurveyId == survey.SurveyId)
                            .Join(db.Questions.Where(qu => qu.Active == true),
                                sq => sq.QuestionId,
                                q => q.QuestionId,
                                (sq, q) =>
                                    new SurveyDTO.QuestionDetail
                                    {
                                        QuestionId = sq.QuestionId,
                                        text = q.QuestionText,
                                        Options = q.Options,
                                        QuestionType = q.QuestionType.ToString(),
                                        OrderId = sq.OrderId,
                                        ParentQuestionId = q.ParentQuestionId,
                                        ParentRequiredAnswer = q.ParentRequiredAnswer
                                    }).ToList();

            var sortedSurveyQs = surveyQs.OrderBy(q => q.OrderId).ToList();

            return new SurveyDTO()
            {
                SurveyId = survey.SurveyId,
                Title = survey.Title,
                SurveyQuestions = sortedSurveyQs
            };

        }

        /// <summary>
        /// Post/save user PIT responses to database
        /// </summary>
        /// <param name="surveyResponse"></param>
        /// <returns></returns>
        [HttpPost]
        public HttpResponseMessage Post(pitDTO pResponse)
        {
            HttpRequestMessage request = this.Request;
            int pitId = 0;
            if (pResponse == null)
                throw new HttpResponseException(HttpStatusCode.NotAcceptable);
            try
            {
                #region create PIT record
                PIT p = new PIT
                {
                    Latitude = pResponse.GeoLoc.Latitude,
                    Longitude = pResponse.GeoLoc.Longitude,
                    CreatedDate = DateTime.Now,
                    UserId = pResponse.UserId
                };
                p = ParseResponse(ref p, pResponse.Responses.ToList());
                db.PITs.Add(p);
                db.SaveChanges();
                pitId = p.PITId;
                #endregion //create client survey record
            }
            catch (Exception e)
            {
                CommonLib.ExceptionUtility.LogException(CommonLib.ExceptionUtility.Application.General, e, "Post PIT; URI =" + this.Request.RequestUri.AbsoluteUri);
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, e);
            }
            var response = Request.CreateResponse(HttpStatusCode.Created, pResponse);
            response.Content = new StringContent("PIT_Id =" + pitId.ToString());
            return response;
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private PIT ParseResponse(ref PIT p, List<pitDTO.Response> responses)
        {
            foreach (pitDTO.Response r in responses)
            {
                //Question question = db.Questions.Where(q => q.QuestionId == r.QuestionId).FirstOrDefault();
                #region Set counts
                switch (r.QuestionId)
                {
                    case 9://Model
                        p.Model = r.Answer;
                        break;
                    case 10://Sex
                        Dictionary<string, string> dict = GetDictAnswer(r.Answer);
                        p.NoMale = GetCount(dict, "Male");
                        p.NoFemale = GetCount(dict, "Female");
                        p.NoUnable2DetermineSex = GetCount(dict, "Not Sure");
                        break;
                    case 11://age
                        Dictionary<string, string> dictAge = GetDictAnswer(r.Answer);
                        p.NoLessthan18 = GetCount(dictAge, "Under 18");
                        p.No18to24 = GetCount(dictAge, "18 - 24");
                        p.No25to55 = GetCount(dictAge, "25 - 55");
                        p.NoOver55 = GetCount(dictAge, "55 Over");
                        p.NoUnable2DetermineAge = GetCount(dictAge, "Not Sure");
                        break;
                    case 12://household
                        Dictionary<string, string> dictHH = GetDictAnswer(r.Answer);
                        p.NoIndividual = GetCount(dictHH, "Individual");
                        p.NoCouple = GetCount(dictHH, "Couple");
                        p.NoFamily = GetCount(dictHH, "Family");
                        p.NoUnable2DetermineHouseHold = GetCount(dictHH, "Not Sure");
                        break;
                    case 13://Location
                        var loc = Classes.Utility.TypeofLoc.Where(l => l.Value == r.Answer).FirstOrDefault();
                        p.TypeOfLocation = loc.Key;
                        break;
                #endregion //Set counts
                }
            }
            return p;
        }

        private Dictionary<string, string> GetDictAnswer(string responseAnswer)
        { 
            Dictionary<string, string> dictOptionAnswer = new Dictionary<string, string>();
            dictOptionAnswer = responseAnswer.Split(new[] { '|' }, StringSplitOptions.RemoveEmptyEntries)
                     .Select(x => x.Split('='))
                     .ToDictionary(x => x[0], y => y[1]);
            return dictOptionAnswer;
        }
        private int GetCount(Dictionary<string, string> dictAnswer, string name)
        {
            int returnVal = 0;

            var answer = dictAnswer.Where(o => o.Key == name).FirstOrDefault();
            int.TryParse(answer.Value, out returnVal);
            return returnVal;
        }
    }
}
