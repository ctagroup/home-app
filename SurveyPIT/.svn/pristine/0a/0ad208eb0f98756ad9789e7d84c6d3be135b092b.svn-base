using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using SurveyPIT.Models;
using SurveyPIT.DAL;


namespace SurveyPIT.Controllers
{

    public class SurveyController : ApiController
    {
        private SurveyDBContext db = new SurveyDBContext();
        
        /// <summary>
        /// Return all survey names that logged in user has permission to survey
        /// GET api/Survey
        /// </summary>
        /// <returns></returns>
        [Authorize]
        public IQueryable<SurveyDTO.Survey> GetSurveys(string userName, string acctType)
        {
            AcctEntities acctdb = new AcctEntities();
            //if (acctType == null){ acctType= "CTA";}
            //later for allow same user name as long as different acctType
            // u.AccountType == acctType && 
            var userObj = acctdb.AspNetUsers.Where(u =>u.UserName == userName).FirstOrDefault();

            if (userObj != null)
            {
                var surveys = from s in db.Surveys
                              join gs in db.GroupSurveys on s.SurveyId equals gs.SurveyId
                              join g in userObj.Groups on gs.GroupId equals g.GroupId
                              where
                              s.IsPIT == false && s.IsEncampment == false
                              select new SurveyDTO.Survey { SurveyId = s.SurveyId, Title = s.Title };

                return surveys.Distinct();
            }
            else return null;

        }
      
        /// <summary>
        /// Return survey name and questions by id
        /// GET api/Survey/5
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        //[Authorize]
        [ResponseType(typeof(SurveyDTO))]
        public SurveyDTO GetSurvey(int id)
        {
            //check user group survey
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
                                        ParentQuestionId= q.ParentQuestionId,
                                        ParentRequiredAnswer = q.ParentRequiredAnswer,
                                        TextBoxDataType = q.TextBoxDataType
                                    }).ToList();

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
            var sortedSurveyQs = surveyQs.OrderBy(q => q.OrderId).ToList();

            //need to filter question for template one
            //This Client
            List<SurveyDTO.QuestionDetail> HUDQs = db.TemplateQuestions.Where(t => t.TemplateId == 1).ToList()
                                    .Join(db.Questions.Where(qu => qu.Active ==true),
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

            return new SurveyDTO()
            {
                SurveyId = survey.SurveyId,
                Title = survey.Title,
                SurveyQuestions = sortedSurveyQs,
                Client = HUDQs
            };
            
        }

        
        /// <summary>
        /// Post/save user survey responses to database
        /// </summary>
        /// <param name="surveyResponse"></param>
        /// <returns></returns>
        [HttpPost]
        public HttpResponseMessage Post(ResponseDTO surveyResponse)
        {
            HttpRequestMessage request = this.Request;
            int clientSurveyId = 0;
            if (surveyResponse == null)
                throw new HttpResponseException(HttpStatusCode.NotAcceptable);
            try
            {

                #region create client record
                Client c = new Client() { 
                    Birthday = surveyResponse.Client.Birthday, 
                    Latitude = surveyResponse.Client.GeoLoc.Latitude,
                    Longitude = surveyResponse.Client.GeoLoc.Longitude,
                    Last4SSN = surveyResponse.Client.Last4SSN, 
                    ServicePointClientID = surveyResponse.Client.ServicePointId
                };
                db.Client.Add(c);
                db.SaveChanges();
                #endregion //create client record
               
                #region create client survey record
                ClientSurvey cs = new ClientSurvey
                {
                    ClientId = c.ClientId,
                    SurveyId = surveyResponse.SurveyId,
                    UserId = surveyResponse.SurveyBy,
                    SurveyDate = DateTime.Now
                };
                db.ClientSurveys.Add(cs);
                db.SaveChanges();
                #endregion //create client survey record

                #region create question response/answer record
                clientSurveyId = cs.ClientSurveyId;
                surveyResponse.Responses.ToList().ForEach(r => db.ClientSurveyResponses.Add(new ClientSurveyResponse {
                 ClientSurveyId = clientSurveyId, QuestionId = r.QuestionId, Value = r.Answer
                } ));
                db.SaveChanges();
                #endregion
            }
            catch (Exception e)
            {
                CommonLib.ExceptionUtility.LogException(CommonLib.ExceptionUtility.Application.General, e, "Post Survey" + surveyResponse.Client.Birthday.ToLongDateString());
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, e);
            }

            var response = Request.CreateResponse(HttpStatusCode.Created, surveyResponse);
            response.Content = new StringContent("ClientSurveyId =" + clientSurveyId.ToString());
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

    }
}