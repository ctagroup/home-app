using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SurveyAdmin.Models;

namespace SurveyAdmin.Controllers
{
    public partial class ClientSurveyController : Controller
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        public virtual ActionResult ClientSurveyForSurvey(int surveyId)
        {
            var clientSurveys = db.ClientSurveys.Where(c => c.SurveyId == surveyId);
            return View(clientSurveys);
        }
    }
}