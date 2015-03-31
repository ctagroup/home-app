//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Web;

//namespace SurveyAdmin.Models
//{
//    public class SurveyRepository: ISurveyRepository
//    {
//        private SurveyEntities db = new SurveyEntities();

//        public IEnumerable<Survey> GetSurveys()
//        {
//            db.Surveys.ToList();

//            //assumed userid= 1 until we have authentication
//            //int userid = 1;
//            var surveys = from s in db.Surveys
//                          //join gs in db.GroupSurveys on s.Id equals gs.Id
//                          //join ug in db.UserGroups on gs.GroupId equals ug.GroupId
//                          where
//                              //ug.UserId == userid && 
//                          s.IsPIT == false
//                          select s;

//            return surveys.Distinct();

//        }
//        //public IEnumerable<Survey> GetSurveysByGroup(int id)
//        //{
//        //    db.Surveys.Where(.ToList();
//        //}
//        public IEnumerable<Question> GetQuestionsBySurvey(int id)
//        {
//            //check user group survey
//            Survey survey = db.Surveys.Find(id);
            
//            if (survey == null)
//            {
//                //write to log
//                return null;
//            }
//            List<SurveyQuestion> sQuestions = db.SurveyQuestions.Where(sq => sq.Id == id).ToList();

//            //Join surveyQuestion table with Question table base on survey Id
//            //List<Question>
//             var surveyQs = sQuestions
//                            .Where(s => s.Id == survey.Id)
//                            .Join(db.Questions,
//                                sq => sq.Id,
//                                q => q.Id,
//                                (sq, q) => q).ToList();
//            return surveyQs;
//            //Add questions from template
//            //List<TemplateQuestion> sTemplateQuestions = db.SurveyTemplates.Where(st => st.Id == id)
//            //                    .Join(db.TemplateQuestions, tq => tq.TemplateId, te => te.TemplateId, (tq, te) => te).ToList();

//            //List<Question> surveyTQs = sTemplateQuestions
//            //                        .Join(db.Questions,
//            //                        tq => tq.Id,
//            //                        q => q.Id,
//            //                       (tq, q) =>q).ToList();

//             //surveyQs.AddRange(surveyTQs);
//            //var sortedSurveyQs = surveyQs.OrderBy(q => q.OrderId).ToList();

//            ////need to filter question for template one
//            ////This Client
//            //List<SurveyDTO.QuestionDetail> HUDQs = db.TemplateQuestions.Where(t => t.TemplateId == 1).ToList()
//            //                        .Join(db.Questions,
//            //                        tq => tq.Id,
//            //                        q => q.Id,
//            //                       (tq, q) =>
//            //                                   new SurveyDTO.QuestionDetail
//            //                                   {
//            //                                       Id = q.Id,
//            //                                       text = q.QuestionText,
//            //                                       Options = q.Options,
//            //                                       QuestionType = q.QuestionType.ToString(),
//            //                                       OrderId = tq.OrderId,
//            //                                       ParentQuestionId = q.ParentQuestionId,
//            //                                       ParentRequiredAnswer = q.ParentRequiredAnswer,
//            //                                       TextBoxDataType = q.TextBoxDataType
//            //                                   }).OrderBy(o => o.OrderId).ToList();


//        }
//    }
//}