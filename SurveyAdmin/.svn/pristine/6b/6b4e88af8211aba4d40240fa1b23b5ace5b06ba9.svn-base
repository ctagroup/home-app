using System.Linq;
using System.Web.Mvc;
using SurveyAdmin.Models;

namespace SurveyAdmin.Controllers
{
    public partial class ROIController : Controller
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        public virtual ActionResult Get(int clientSurveyId)
        {
            var roi = db.ROIs.FirstOrDefault(cs => cs.ClientSurveyId == clientSurveyId);
            return View(roi);
        }
    }
}