using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.OleDb;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using SurveyAdmin.Models;
using SurveyAdmin.Models.SurveyInfo;

namespace SurveyAdmin.Controllers
{
    public class QuestionWrapper
    {
        public int Id { get; set; }
        public Question ParentQuestion { get; set; }

        public List<Question> Children { get; private set; }

        public QuestionWrapper()
        {
            Children = new List<Question>();
        }
    }

    public partial class SurveyController : Controller
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: /Survey/
        public virtual ActionResult Index()
        {
            return View(db.Surveys.ToList());
        }

        [HttpGet]
        public virtual ActionResult Import()
        {
            return View(new ImportSurveyViewModel());
        }

        [HttpPost]
        public virtual ActionResult Import(ImportSurveyViewModel viewModel)
        {
            if (!ModelState.IsValid)
            {
                return View(viewModel);
            }

            var survey = new Survey();
            survey.Title = viewModel.Name;
            survey.CreatedDate = DateTime.Now;
            survey.UpdatedDate = DateTime.Now;

            if (viewModel.SurveyType == SurveyType.PIT)
            {
                survey.IsPIT = true;
            }
            if (viewModel.SurveyType == SurveyType.Encampment)
            {
                survey.IsEncampment = true;
            }

            db.Surveys.Add(survey);
            db.SaveChanges();

            var uploadPath = "C:\\CTASurveys\\";

            if (!Directory.Exists(uploadPath))
            {
                Directory.CreateDirectory(uploadPath);
            }

            var fileName = Path.GetFileName(viewModel.ExcelDocument.FileName);
            viewModel.ExcelDocument.SaveAs(string.Format("{0}{1}", uploadPath, fileName));

            fileName = string.Format("{0}{1}", uploadPath, fileName);
            var connectionString =
                string.Format(
                    "Provider=Microsoft.ACE.OLEDB.12.0;Data Source={0};Extended Properties=\"Excel 12.0 Xml;HDR=YES;IMEX=1\";",
                    fileName);

            var adapter = new OleDbDataAdapter(string.Format("SELECT * FROM [{0}$]", viewModel.SheetName), connectionString);
            var ds = new DataSet();

            adapter.Fill(ds, "sccSurvey");
            DataTable data = ds.Tables["sccSurvey"];

            var questionParents = new List<QuestionWrapper>();

            var questions = new List<Question>();

            foreach (DataRow row in data.Rows)
            {
                if (!string.IsNullOrEmpty(row["QuestionId"].ToString()))
                {
                    var question = new Question();
                    question.QuestionText = row["QuestionText"].ToString().Trim();
                    if (row["Options"].ToString() != "NULL")
                    {
                        question.Options = row["Options"].ToString().Trim();
                    }
                    question.QuestionType =
                        (Question.QType) Enum.Parse(typeof (Question.QType), row["QuestionType"].ToString());
                    question.Active = row["Active"].ToString() == "1";
                    question.TextBoxDataType = row["TextBoxDataType"].ToString();

                    if (data.Columns.Contains("RequiredQuestion"))
                    {
                        question.Required = row["RequiredQuestion"].ToString() == "Y";
                    }

                    var questionWrapper = new QuestionWrapper();
                    questionWrapper.Id = int.Parse(row["QuestionId"].ToString());
                    questionWrapper.ParentQuestion = question;
                    questionParents.Add(questionWrapper);

                    if (row["ParentQuestionId"].ToString() != "NULL")
                    {
                        var parentId = int.Parse(row["ParentQuestionId"].ToString());
                        question.ParentRequiredAnswer = row["ParentRequiredAnswer"].ToString();

                        var parent = questionParents.First(q => q.Id == parentId);
                        parent.Children.Add(question);
                    }
                    db.Questions.Add(question);
                    questions.Add(question);
                }
            }

            db.SaveChanges();

            foreach (var q in questionParents)
            {
                foreach (var c in q.Children)
                {
                    c.ParentQuestionId = q.ParentQuestion.QuestionId;
                }
            }

            var i = 0;
            foreach (var q in questions)
            {
                var surveyQuestion = new SurveyQuestion();
                surveyQuestion.Survey = survey;
                surveyQuestion.Question = q;
                surveyQuestion.OrderId = i++;
                db.SurveyQuestions.Add(surveyQuestion);
            }

            db.SaveChanges();

            return null;
        }

        // GET: /Survey/Details/5
        public virtual ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Survey survey = db.Surveys.Find(id);
            if (survey == null)
            {
                return HttpNotFound();
            }
            return View(survey);
        }

        // GET: /Survey/Create
        public virtual ActionResult Create()
        {
            return View();
        }

        // POST: /Survey/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public virtual ActionResult Create(
            [Bind(
                Include =
                    "SurveyId,Title,Description,CreatedBy,CreatedDate,UpdatedBy,UpdatedDate,ExpireOn,Active,FilterQuestion,IsPIT"
                )] Survey survey)
        {
            if (ModelState.IsValid)
            {
                db.Surveys.Add(survey);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(survey);
        }

        // GET: /Survey/Edit/5
        public virtual ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Survey survey = db.Surveys.Find(id);
            if (survey == null)
            {
                return HttpNotFound();
            }
            return View(survey);
        }

        // POST: /Survey/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public virtual ActionResult Edit(
            [Bind(
                Include =
                    "SurveyId,Title,Description,CreatedBy,CreatedDate,UpdatedBy,UpdatedDate,ExpireOn,Active,FilterQuestion,IsPIT"
                )] Survey survey)
        {
            if (ModelState.IsValid)
            {
                db.Entry(survey).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(survey);
        }

        // GET: /Survey/Delete/5
        public virtual ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Survey survey = db.Surveys.Find(id);
            if (survey == null)
            {
                return HttpNotFound();
            }
            return View(survey);
        }

        // POST: /Survey/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public virtual ActionResult DeleteConfirmed(int id)
        {
            Survey survey = db.Surveys.Find(id);
            db.Surveys.Remove(survey);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        public virtual ActionResult Responses(int surveyId)
        {
            var clientSurveys = db.ClientSurveys.Where(cs => cs.SurveyId == surveyId);
//            var survey = db.Surveys.FirstOrDefault(x => x.SurveyId == surveyId);
            return View(clientSurveys);
        }
    }
}