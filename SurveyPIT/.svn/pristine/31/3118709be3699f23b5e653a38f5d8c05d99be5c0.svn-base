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
    public class ClientSurveyController : ApiController
    {
        private SurveyDBContext db = new SurveyDBContext();

        // GET api/ClientSurvey/5
        /// <summary>
        /// This Web API return total survey response per survey id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [ResponseType(typeof(SurveySummaryDTO))]
        public SurveySummaryDTO GetClientSurvey(int id)
        {
            List<ClientSurvey> clientsurvey = db.ClientSurveys.Where(s => s.SurveyId == id).ToList();
            int total = clientsurvey.Count();
            List<ClientSurveyResponse> responses = clientsurvey
                .Join(db.ClientSurveyResponses, cs => cs.ClientSurveyId,
                                r => r.ClientSurveyId,
                                (cs, r) => r).ToList();
            List<Summary> SummaryResponses = responses.GroupBy(r => new { r.QuestionId, r.Value })
                    .Select(y => new Summary() {  QuestionId = y.Key.QuestionId,
                                                   Answer = y.Key.Value,
                                                  Count = y.Count()})
                     .OrderBy(s => s.QuestionId)
                     .ToList();
            // get question text
            SummaryResponses = SummaryResponses
                .Join(db.Questions, r => r.QuestionId,
                    q => q.QuestionId,
                    (r, q) => new Summary() { QuestionId = r.QuestionId, QuestionText = q.QuestionText, Answer = r.Answer, Count = r.Count }).ToList();
                
            //return Ok(clientsurvey);
            return new SurveySummaryDTO() {
                 Total = total,
                 SurveySummary = SummaryResponses
            };
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ClientSurveyExists(int id)
        {
            return db.ClientSurveys.Count(e => e.ClientSurveyId == id) > 0;
        }
    }
}