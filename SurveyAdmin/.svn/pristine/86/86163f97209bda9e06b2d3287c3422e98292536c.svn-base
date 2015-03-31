using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web.Mvc;
using CsvHelper;
using SurveyAdmin.Models;
using SurveyAdmin.Models.SurveyInfo;

namespace SurveyAdmin.Controllers
{
    public class TallySheet
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public bool Revised { get; set; }
        public string Notes { get; set; }
        public string Coordinates { get; set; }
        public bool IsTallySheet { get; set; }

        public bool SubmitThis { get; set; }
    }

    public partial class PitController : Controller
    {
        private readonly ApplicationDbContext db = new ApplicationDbContext();


        public virtual ActionResult TallySheets()
        {
            var list = new List<TallySheet>();

            var pits = db.PITs.Where(p => !p.SubmissionDate.HasValue).ToList();

            foreach (var p in pits)
            {
                var tallySheet = new TallySheet();
                tallySheet.CreatedDate = p.CreatedDate;
                tallySheet.Id = p.PITId;
                tallySheet.CreatedBy = p.User.FirstName + " " + p.User.LastName;
                tallySheet.Coordinates = string.Format("({0},{1})", p.Latitude, p.Longitude);
                tallySheet.IsTallySheet = true;
                tallySheet.Notes = !string.IsNullOrEmpty(p.Notes) ? p.Notes : "";
                list.Add(tallySheet);
            }

            var clientSurveys =
                db.ClientSurveys.Where(
                    cs => !cs.SubmissionDate.HasValue && cs.Survey.Active && cs.Survey.Title == "The PIT Survey")
                    .Include(cs => cs.Client).Include(cs => cs.User);
            foreach (var cs in clientSurveys)
            {
                var survey = new TallySheet();
                survey.CreatedDate = cs.SurveyDate;
                survey.Id = cs.ClientSurveyId;
                survey.CreatedBy = cs.User.FirstName + " " + cs.User.LastName;
                survey.Coordinates = string.Format("({0},{1})", cs.Client.Latitude, cs.Client.Longitude);
                survey.Notes = !string.IsNullOrEmpty(cs.Notes) ? cs.Notes : "";
                survey.IsTallySheet = false;
                list.Add(survey);
            }

            var result = list.OrderByDescending(ts => ts.CreatedDate);
            return View(result.ToList());
        }

        [HttpPost]
        public virtual ActionResult SubmitResponses(List<TallySheet> results)
        {
            if (!Directory.Exists(AppDomain.CurrentDomain.BaseDirectory + "\\PitData"))
            {
                Directory.CreateDirectory(AppDomain.CurrentDomain.BaseDirectory + "\\PitData");
            }

            var current = DateTime.Now;
            var pitWriter =
                new StreamWriter(
                    string.Format(
                        AppDomain.CurrentDomain.BaseDirectory + "\\PitData\\TallySheet-{0}-{1}-{2}-{3}{4}{5}.csv",
                        current.Day, current.Month, current.Year, current.Hour, current.Minute, current.Millisecond));
            var pitCsv = new CsvWriter(pitWriter);
            pitCsv.Configuration.HasHeaderRecord = true;
            pitCsv.WriteField("Id");
            pitCsv.WriteField("Notes");
            pitCsv.WriteField("Created");
            pitCsv.WriteField("CreatedBy");
            pitCsv.WriteField("Latitude");
            pitCsv.WriteField("Longitude");
            pitCsv.WriteField("Gender");
            pitCsv.WriteField("Age");
            pitCsv.WriteField("Family");
            pitCsv.WriteField("Dwelling");
            pitCsv.WriteField("Location");
            pitCsv.NextRecord();

            var ids = new List<int>();

            foreach (var result in results)
            {
                if (result.SubmitThis)
                {
                    if (result.IsTallySheet)
                    {
                        var pit = db.PITs.Find(result.Id);
                        pit.Notes = result.Notes;
                        pit.SubmissionDate = DateTime.Now;
                        db.SaveChanges();
                        pitCsv.WriteField(pit.PITId);
                        pitCsv.WriteField(pit.Notes, true);
                        pitCsv.WriteField(pit.CreatedDate);
                        pitCsv.WriteField(pit.User.FirstName + " " + pit.User.LastName);
                        pitCsv.WriteField(pit.Latitude);
                        pitCsv.WriteField(pit.Longitude);
                        pitCsv.WriteField(pit.GenderAnswer, true);
                        pitCsv.WriteField(pit.AgeAnswer, true);
                        pitCsv.WriteField(pit.FamilyAnswer, true);
                        pitCsv.WriteField(pit.DwellingAnswer, true);
                        pitCsv.WriteField(pit.LocationAnswer, true);
                        pitCsv.NextRecord();
                    }
                    else
                    {
                        var sqlStatment =
                            "update ClientSurveys set Notes=@Notes, SubmissionDate=@SubmissionDate where ClientSurveyId = @Id";
                        var notes = new SqlParameter("Notes", !string.IsNullOrEmpty(result.Notes) ? result.Notes : " ");
                        var submissionDate = new SqlParameter("SubmissionDate", DateTime.Now);
                        var id = new SqlParameter("Id", result.Id);

                        ids.Add(result.Id);
                        db.Database.ExecuteSqlCommand(sqlStatment, new[] {notes, submissionDate, id});
                    }
                }
            }

            var css = db.ClientSurveys.Where(x => ids.Contains(x.ClientSurveyId)).Include(x => x.Client).Include(x=>x.User);
            if (css.Any())
            {
                var allQuestions =
                    db.SurveyQuestions.Where(s => s.SurveyId == css.FirstOrDefault().SurveyId)
                        .Include(sq => sq.Question)
                        .Select(s => s.Question);

                var questionIds = allQuestions.Select(q => q.QuestionId).ToList();
                var surveyWriter =
                    new StreamWriter(
                        string.Format(
                            AppDomain.CurrentDomain.BaseDirectory + "\\PitData\\PitSurvey-{0}-{1}-{2}-{3}{4}{5}.csv",
                            current.Day, current.Month, current.Year, current.Hour, current.Minute, current.Millisecond));
                var surveyCsv = new CsvWriter(surveyWriter);
                surveyCsv.Configuration.HasHeaderRecord = true;
                surveyCsv.WriteField("Id");
                surveyCsv.WriteField("Notes");
                surveyCsv.WriteField("Created");
                surveyCsv.WriteField("CreatedBy");
                surveyCsv.WriteField("Latitude");
                surveyCsv.WriteField("Longitude");
                foreach (var qId in questionIds)
                {
                    var quest = allQuestions.FirstOrDefault(q => q.QuestionId == qId);
                    if (quest != null)
                    {
                        surveyCsv.WriteField(quest.QuestionText, true);
                    }
                }
                surveyCsv.NextRecord();

                foreach (var cs in css)
                {
                    surveyCsv.WriteField(cs.ClientSurveyId);
                    surveyCsv.WriteField(cs.Notes, true);
                    surveyCsv.WriteField(cs.SurveyDate);
                    surveyCsv.WriteField(cs.User.FirstName + " " + cs.User.LastName);
                    surveyCsv.WriteField(cs.Client.Latitude);
                    surveyCsv.WriteField(cs.Client.Longitude);
                    foreach (var qId in questionIds)
                    {
                        var csr = cs.Responses.FirstOrDefault(c => c.QuestionId == qId);
                        surveyCsv.WriteField(csr != null ? csr.Value : "", true);
                    }
                    surveyCsv.NextRecord();
                }

                surveyCsv.Dispose();
            }

            pitCsv.Dispose();
            return RedirectToAction(MVC.Pit.TallySheets());
        }

        public virtual ActionResult Details(int pitId)
        {
            var pit = db.PITs.First(p => p.PITId == pitId);
            return View(pit);
        }

        public virtual ActionResult SurveyDetails(int id)
        {
            var clientSurvey =
                db.ClientSurveys.Where(cs => cs.ClientSurveyId == id).Include(cs => cs.Client).FirstOrDefault();

            return View(clientSurvey);
        }

        public virtual ActionResult DeletePit(int id)
        {
            var pit = db.PITs.Find(id);
            db.PITs.Remove(pit);
            db.SaveChanges();

            return RedirectToAction(MVC.Pit.TallySheets());
        }

        public virtual ActionResult DeleteSurvey(int id)
        {
            var idParam = new SqlParameter("Id", id);
            var sqlStatment =
                "delete from ClientSurveyResponses where ClientSurveyId = @Id";
            db.Database.ExecuteSqlCommand(sqlStatment, new[] {idParam});

            idParam = new SqlParameter("Id", id);
            sqlStatment =
                "delete from ClientSurveys where ClientSurveyId = @Id";
            db.Database.ExecuteSqlCommand(sqlStatment, new[] {idParam});

            return RedirectToAction(MVC.Pit.TallySheets());
        }
    }
}