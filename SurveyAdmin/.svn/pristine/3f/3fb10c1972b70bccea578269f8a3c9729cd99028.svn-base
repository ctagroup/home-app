using System.Web.Http;
using System.Web.Http.Description;
using SurveyAdmin.Models;
using SurveyAdmin.Models.SurveyInfo;

namespace SurveyAdmin.Controllers.api
{
    public class ROIController : ApiController
    {
        private readonly ApplicationDbContext db = new ApplicationDbContext();

        [ResponseType(typeof(int))]
        [HttpPost]
        public IHttpActionResult Post(ROI roi)
        {
            if (ModelState.IsValid)
            {
                db.ROIs.Add(roi);
                return Ok(db.SaveChanges());
            }

            return BadRequest(ModelState);
        }
    }
}