using System;
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
    public class EncampmentSiteController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET api/EncampmentSite
        public IQueryable<EncampmentSite> GetEncampmentSites(string searchStr)
        {
            var sites = db.EncampmentSites.Where(s => s.Inactive == false);
            if (!String.IsNullOrEmpty(searchStr))
            {
                sites = sites.Where(s => (s.EncampLocation.Contains(searchStr) || s.SiteCode.Contains(searchStr)));
            }
            return sites;
        }

        // GET Encampment Site5
        [ResponseType(typeof(EncampmentSite))]
        public IHttpActionResult GetEncampmentSite(int id)
        {
            EncampmentSite encampmentsite = db.EncampmentSites.Find(id);
            if (encampmentsite == null)
            {
                return NotFound();
            }

            return Ok(encampmentsite);
        }

        [ResponseType(typeof(SurveyDTO))]
        public SurveyDTO GetSiteForm()
        {
            Survey survey = db.Surveys.Where(s => s.IsEncampment == true && s.Title =="Encampment Site").FirstOrDefault();
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

        // PUT api/EncampmentSite/5
        public IHttpActionResult PutEncampmentSite(int id, EncampmentSite encampmentsite)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != encampmentsite.EncampmentSiteId)
            {
                return BadRequest();
            }

            db.Entry(encampmentsite).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EncampmentSiteExists(id))
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

        // POST api/EncampmentSite
        [ResponseType(typeof(EncampmentSite))]
        public IHttpActionResult PostEncampmentSite(EncampmentSite encampmentsite)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.EncampmentSites.Add(encampmentsite);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = encampmentsite.EncampmentSiteId }, encampmentsite);
        }

        // DELETE api/EncampmentSite/5
        [ResponseType(typeof(EncampmentSite))]
        public IHttpActionResult DeleteEncampmentSite(int id)
        {
            EncampmentSite encampmentsite = db.EncampmentSites.Find(id);
            if (encampmentsite == null)
            {
                return NotFound();
            }

            db.EncampmentSites.Remove(encampmentsite);
            db.SaveChanges();

            return Ok(encampmentsite);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool EncampmentSiteExists(int id)
        {
            return db.EncampmentSites.Count(e => e.EncampmentSiteId == id) > 0;
        }
    }
}