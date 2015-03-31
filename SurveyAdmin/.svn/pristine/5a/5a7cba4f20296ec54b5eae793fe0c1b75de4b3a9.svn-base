using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using System.Web.Http.Results;
using log4net;
using SurveyAdmin.Models;
using SurveyAdmin.Models.SurveyInfo;

namespace SurveyAdmin.Controllers.api
{
    public class SurveyController : ApiController
    {
        private readonly ApplicationDbContext db = new ApplicationDbContext();

        public class SurveyInfo
        {
            public string Title { get; set; }
            public int SurveyId { get; set; }
        }

        [HttpGet]
        [Route("api/EncampmentSite")]
        public SurveyDTO EncampmentSurvey()
        {
//            var surveyId = db.Surveys.First(s => s.IsEncampment).SurveyId;
            return GetSurvey(12);
        }

        [HttpGet]
        [Route("api/Survey/GetEncampmentSurvey")]
        public SurveyDTO EncampmentSiteSurvey()
        {
            //            var surveyId = db.Surveys.First(s => s.IsEncampment).SurveyId;
            return GetSurvey(11);
        }


        [HttpGet]
        public List<SurveyInfo> GetSurveys()
        {
            return
                db.Surveys.Where(sur => sur.Active && !sur.IsPIT && !sur.IsEncampment)
                    .Select(s => new SurveyInfo {SurveyId = s.SurveyId, Title = s.Title})
                    .ToList();
        }

        [HttpGet]
        public SurveyDTO GetSurvey(int id)
        {
            //check user group survey
            Survey survey = db.Surveys.Find(id);
            if (survey == null)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound,
                    "Survey does not exist"));
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
                            ParentRequiredAnswer = q.ParentRequiredAnswer,
                            TextBoxDataType = q.TextBoxDataType
                        }).ToList();


            if (false)
//            if (!survey.IsEncampment && !survey.IsPIT)
            {
                //Add questions from template
                List<TemplateQuestion> sTemplateQuestions = db.SurveyTemplate.Where(st => st.SurveyId == id)
                    .Join(db.TemplateQuestions, tq => tq.TemplateId, te => te.TemplateId, (tq, te) => te).ToList();

                List<SurveyDTO.QuestionDetail> surveyTQs = sTemplateQuestions
                    .Join(db.Questions.Where(qu => qu.Active == true),
                        tq => tq.QuestionId,
                        q => q.QuestionId,
                        (tq, q) =>
                            new SurveyDTO.QuestionDetail
                            {
                                QuestionId = q.QuestionId,
                                text = q.QuestionText,
                                Options = q.Options,
                                QuestionType = q.QuestionType.ToString(),
                                OrderId = tq.OrderId,
                                ParentQuestionId = q.ParentQuestionId,
                                ParentRequiredAnswer = q.ParentRequiredAnswer,
                                TextBoxDataType = q.TextBoxDataType
                            }).ToList();

                surveyQs.AddRange(surveyTQs);
            }
            var sortedSurveyQs = surveyQs.OrderBy(q => q.OrderId).ToList();

            //need to filter question for template one
            //This Client

            var HUDQs = new List<SurveyDTO.QuestionDetail>();

            if(false)
            if (!survey.IsEncampment && !survey.IsPIT)
            {
                HUDQs = db.TemplateQuestions.Where(t => t.TemplateId == 1).ToList()
                    .Join(db.Questions.Where(qu => qu.Active == true),
                        tq => tq.QuestionId,
                        q => q.QuestionId,
                        (tq, q) =>
                            new SurveyDTO.QuestionDetail
                            {
                                QuestionId = q.QuestionId,
                                text = q.QuestionText,
                                Options = q.Options,
                                QuestionType = q.QuestionType.ToString(),
                                OrderId = tq.OrderId,
                                ParentQuestionId = q.ParentQuestionId,
                                ParentRequiredAnswer = q.ParentRequiredAnswer,
                                TextBoxDataType = q.TextBoxDataType
                            }).OrderBy(o => o.OrderId).ToList();
            }

            return new SurveyDTO()
            {
                SurveyId = survey.SurveyId,
                Title = survey.Title,
                SurveyQuestions = sortedSurveyQs,
                NeedsROIAndImages = survey.NeedsROIAndImages,
                Client = HUDQs
            };
        }


        /// <summary>
        /// Post/save user survey responses to database
        /// </summary>
        /// <param name="surveyResponse"></param>
        /// <returns></returns>
        [HttpPost]
        [ResponseType(typeof (ClientSurvey))]
        public IHttpActionResult Post(ResponseDTO surveyResponse)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            //if (surveyResponse == null)
            //{
            //    throw new HttpResponseException(HttpStatusCode.NotAcceptable);
            //}
            try
            {
                var client = new Client()
                {
                    Latitude = surveyResponse.Client.GeoLoc.Latitude,
                    Longitude = surveyResponse.Client.GeoLoc.Longitude,
                    Last4SSN = surveyResponse.Client.Last4SSN,
                    ServicePointClientID = surveyResponse.Client.ServicePointId
                };


                db.Client.Add(client);
                db.SaveChanges();

                var clientSurvey = new ClientSurvey
                {
                    ClientId = client.ClientId,
                    SurveyId = surveyResponse.SurveyId,
                    EnteredBy = surveyResponse.SurveyBy,
                    SurveyDate = DateTime.Now
                };
                db.ClientSurveys.Add(clientSurvey);
                db.SaveChanges();

                MvcApplication.Logger.Debug("id: " + clientSurvey.ClientSurveyId);

                var id = clientSurvey.ClientSurveyId;
                clientSurvey = db.ClientSurveys.Find(id);

                foreach (var r in surveyResponse.Responses)
                {
                    var stmt =
                        string.Format(
                            "insert into ClientSurveyResponses (ClientSurveyId, QuestionId, Value) values ({0}, {1}, '{2}')",
                            id, r.QuestionId, r.Answer);

                    db.Database.ExecuteSqlCommand(stmt);

                    //var csr = db.ClientSurveyResponses.Create();

                    //csr.ClientSurveyId = id;
                    //csr.QuestionId = r.QuestionId;
                    //csr.Value = r.Answer;

                    //db.ClientSurveyResponses.Add(csr);
                }
//                db.SaveChanges();
//                return Created( string.Format("/api/ClientSurvey/{0}", clientSurvey.ClientSurveyId), clientSurvey);

                var responseMessage = new HttpResponseMessage(HttpStatusCode.Created);
                responseMessage.Content =
                    new StringContent(string.Format("ClientSurveyId={0}", clientSurvey.ClientSurveyId));

                return new ResponseMessageResult(responseMessage);
            }
            catch (Exception e)
            {
                MvcApplication.Logger.Fatal("Exception posting survey", e);
                //CommonLib.ExceptionUtility.LogException(CommonLib.ExceptionUtility.Application.General, e,
                //    "Post Survey" + surveyResponse.Client.Birthday.ToLongDateString());
                return BadRequest(e.Message);
            }
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}