using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using SurveyAdmin.Models;
using SurveyAdmin.Models.SurveyInfo;

namespace SurveyAdmin.Controllers.api
{
    public class EncampmentSiteVisitController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET api/EncampmentSiteVisit
        // [Authorize]
        public IQueryable<EncampmentVisit> GetEncampmentVisits(int siteId)
        {
            return db.EncampmentVisits.Where(v => v.EncampmentSiteId == siteId);
        }

        // GET api/EncampmentSiteVisit/5
        [ResponseType(typeof(EncampmentVisit))]
        [Authorize]
        public IHttpActionResult GetEncampmentVisit(int id)
        {
            EncampmentVisit encampmentvisit = db.EncampmentVisits.Find(id);
            if (encampmentvisit == null)
            {
                return NotFound();
            }

            return Ok(encampmentvisit);
        }


        [ResponseType(typeof(SurveyDTO))]
        public SurveyDTO GetVisitForm()
        {
            Survey survey = db.Surveys.Where(s => s.IsEncampment == true && s.Title == "Encampment Visit").FirstOrDefault();
            if (survey == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }
            List<SurveyQuestion> sQuestions = db.SurveyQuestions.Where(sq => sq.SurveyId == survey.SurveyId).ToList();

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

        // PUT api/EncampmentSiteVisit/5
         [Authorize]
        public IHttpActionResult PutEncampmentVisit(int id, EncampmentVisit encampmentvisit)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != encampmentvisit.EncampmentVisitId)
            {
                return BadRequest();
            }

            db.Entry(encampmentvisit).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EncampmentVisitExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST api/EncampmentSiteVisit
        [ResponseType(typeof(EncampmentVisit))]
        [Authorize]
        public IHttpActionResult PostEncampmentVisit(EncampmentVisit encampmentvisit)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.EncampmentVisits.Add(encampmentvisit);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = encampmentvisit.EncampmentVisitId }, encampmentvisit);
        }

        // DELETE api/EncampmentSiteVisit/5
        [ResponseType(typeof(EncampmentVisit))]
        [Authorize]
        public IHttpActionResult DeleteEncampmentVisit(int id)
        {
            EncampmentVisit encampmentvisit = db.EncampmentVisits.Find(id);
            if (encampmentvisit == null)
            {
                return NotFound();
            }

            db.EncampmentVisits.Remove(encampmentvisit);
            db.SaveChanges();

            return Ok(encampmentvisit);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool EncampmentVisitExists(int id)
        {
            return db.EncampmentVisits.Count(e => e.EncampmentVisitId == id) > 0;
        }
    }
}