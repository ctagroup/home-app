using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using SurveyAdmin.Models;
using SurveyAdmin.Models.SurveyInfo;

namespace SurveyAdmin.Controllers.api
{
    public class PITController : ApiController
    {
        public class SurveyInfo
        {
            public string Title { get; set; }
            public int SurveyId { get; set; }
        }

        private ApplicationDbContext db = new ApplicationDbContext();

        [ResponseType(typeof (SurveyDTO))]
        public SurveyDTO GetPIT()
        {
            //get user group survey for now assumed group= 1
            //get PIT survey for group 1
            int id = 13;
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
        /// <returns></returns>
        [HttpPost]
        public HttpResponseMessage Post(List<pitDTO> pResponses)
        {
            int? houseHoldId = null;
            if (pResponses == null)
                throw new HttpResponseException(HttpStatusCode.NotAcceptable);
            try
            {
                foreach (var pResponse in pResponses)
                {
                    PIT p = new PIT
                    {
                        Latitude = pResponse.GeoLoc.Latitude,
                        Longitude = pResponse.GeoLoc.Longitude,
                        CreatedDate = DateTime.Now,
                        UserId = pResponse.UserId
                    };
                    if (houseHoldId.HasValue)
                    {
                        p.HouseholdId = houseHoldId.Value;
                    }
                    p = ParseResponse(p, pResponse.Responses.ToList());
                    db.PITs.Add(p);
                    db.SaveChanges();

                    if (!houseHoldId.HasValue)
                    {
                        houseHoldId = p.PITId;
                    }
                }
            }
            catch (Exception e)
            {
                CommonLib.ExceptionUtility.LogException(CommonLib.ExceptionUtility.Application.General, e,
                    "Post PIT; URI =" + this.Request.RequestUri.AbsoluteUri);
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, e);
            }
            var response = Request.CreateResponse();
            response.Content = new StringContent("PitHousehold_Id=" + houseHoldId.ToString());
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

        private PIT ParseResponse(PIT p, IEnumerable<Response> responses)
        {
            foreach (var r in responses)
            {
                Question question = db.Questions.First(q => q.QuestionId == r.QuestionId);
                switch (question.QuestionText)
                {
                    case "Gender":
                        p.GenderAnswer = r.Answer;
                        break;
                    case "Age":
                        p.AgeAnswer = r.Answer;
                        break;
                    case "Single Or Family":
                        p.FamilyAnswer = r.Answer;
                            break;
                    case "Dwelling or Vehicle Type":
                        p.DwellingAnswer = r.Answer;
                        break;
                    case "Location Seen":
                        p.LocationAnswer = r.Answer;
                        break;
                }
            }
            return p;
        }
    }
}