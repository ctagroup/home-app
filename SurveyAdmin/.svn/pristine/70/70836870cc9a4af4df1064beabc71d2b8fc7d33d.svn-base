using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Description;
using SurveyAdmin.Models;
using SurveyAdmin.Models.SurveyInfo;

namespace SurveyAdmin.Controllers.api
{
    public class SurveyDataController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET api/SurveyData/5
        [ResponseType(typeof(SurveyDataDTO))]
        public SurveyDataDTO GetSurveyData(int id)
        {
            List<ClientSurvey> clientsurvey = db.ClientSurveys.Where(s => s.SurveyId == id).ToList();
            List<ResponseRecord> responses = clientsurvey
                .Join(db.ClientSurveyResponses, cs => cs.ClientSurveyId,
                                r => r.ClientSurveyId,
                                (cs, r) => new ResponseRecord { CustomerId = cs.ClientId, DateSurvey = cs.SurveyDate,
                                     QuestionId = r.QuestionId, Answer = r.Value}).ToList();
                

            // get question text
            responses = responses
                .Join(db.Questions, r => r.QuestionId,
                    q => q.QuestionId,
                    (r, q) => new ResponseRecord() { CustomerId=r.CustomerId, DateSurvey= r.DateSurvey, QuestionId = r.QuestionId, QuestionText = q.QuestionText, Answer = r.Answer }).ToList();

            // get service point id from client table
            var surveyResponses = responses
                .Join(db.Client, r => r.CustomerId,
                    c => c.ClientId,
                    (r, c) => new ResponseRecord() { CustomerId = Convert.ToInt32(c.ServicePointClientID), DateSurvey = r.DateSurvey, QuestionId = r.QuestionId, QuestionText = r.QuestionText, Answer = r.Answer }).ToList();

            return new SurveyDataDTO { SurveyResponses = surveyResponses };
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