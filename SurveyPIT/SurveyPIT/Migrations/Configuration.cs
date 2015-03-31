namespace SurveyPIT.Migrations
{
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;
    using SurveyPIT.Models;

    internal sealed class Configuration : DbMigrationsConfiguration<SurveyPIT.DAL.SurveyDBContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(SurveyPIT.DAL.SurveyDBContext context)
        {
            #region User Seeding
            //var roles = new List<Role>
            //{
            //    new Role { RoleId = 1, Name = "admin"},
            //    new Role { RoleId = 2, Name = "survey creator"},
            //    new Role { RoleId = 3, Name = "surveyor"},
            //    new Role { RoleId = 4, Name = "report"}
            //};
            //roles.ForEach(r => context.Roles.AddOrUpdate(i => i.RoleId, r));

            //var groups = new List<Group>
            //{
            //    new Group { Name = "Santa Clara"},
            //    new Group { Name = "Santa Cruz"},
            //    new Group { Name = "OutReach San Jose"}
            //};
            //groups.ForEach(g => context.Groups.AddOrUpdate(i => i.Name, g));

            //var users = new List<User>
            //{
            //    new User { FirstName = "Thuy",   LastName = "Goodwin", UserName= "thuy", Password = "1111",
            //         Email = "thuy@ctagroup.org", RoleId = 1, Active = true},
            //    new User { FirstName = "Jim",   LastName = "O'Sullivan", UserName= "jim", Password = "jimO",
            //         Email = "jim@ctagroup.org", RoleId = 1 , Active = true},
            //    new User { FirstName = "John",   LastName = "Reed", UserName= "jr", Password = "jr1234",
            //         Email = "jr@ctagroup.org", RoleId = 1, Active = true},
            //    new User { FirstName = "Android",   LastName = "Developer", UserName= "android", Password = "test1234",
            //         Email = "", RoleId = 1, Active = true}
            //};
            //users.ForEach(u => context.Users.AddOrUpdate(p => p.UserName, u));
            //context.SaveChanges();

            //var UserGroups = new List<UserGroup>
            //{
            //    new UserGroup { UserId = users.Single(u => u.UserName =="thuy").UserId,
            //         GroupId = groups.Single(g => g.Name == "Santa Clara").GroupId},
            //    new UserGroup { UserId = users.Single(u => u.UserName =="thuy").UserId,
            //         GroupId = groups.Single(g => g.Name == "Santa Cruz").GroupId},
            //    new UserGroup { UserId = users.Single(u => u.UserName =="jim").UserId,
            //         GroupId = groups.Single(g => g.Name == "Santa Clara").GroupId},
            //    new UserGroup { UserId = users.Single(u => u.UserName =="jim").UserId,
            //         GroupId = groups.Single(g => g.Name == "Santa Cruz").GroupId},
            //    new UserGroup { UserId = users.Single(u => u.UserName =="JR").UserId,
            //         GroupId = groups.Single(g => g.Name == "Santa Clara").GroupId},
            //    new UserGroup { UserId = users.Single(u => u.UserName =="JR").UserId,
            //         GroupId = groups.Single(g => g.Name == "Santa Cruz").GroupId},
            //    new UserGroup { UserId = users.Single(u => u.UserName =="android").UserId,
            //         GroupId = groups.Single(g => g.Name == "Santa Clara").GroupId}
            //};

            //foreach (UserGroup ug in UserGroups)
            //{
            //    var userGroupInDataBase = context.UserGroups.Where(
            //        u => u.User.UserId == ug.UserId &&
            //            u.Group.GroupId == ug.GroupId).SingleOrDefault();
            //    if (userGroupInDataBase == null)
            //    {
            //        context.UserGroups.Add(ug);
            //    }
            //}
            #endregion //User Seeding

            #region Common Survey Seeding

            #endregion //Common Survey Seeding

            #region Survey
            var Questions = new List<Question>
            {
                #region Client Questions
                //ParentRequiredAnswer = used for store field for survey Response
                new Question { QuestionText = "What is your birthday?", QuestionType = Question.QType.SinglelineTextBox,
                    Active = true, ParentQuestionId =0, ParentRequiredAnswer ="Birthday", TextBoxDataType="DateTime"},
                new Question { QuestionText = "What is your last 4 digits Social Security?", QuestionType = Question.QType.SinglelineTextBox,
                    Active = true, ParentQuestionId =0, ParentRequiredAnswer ="Last4SSN", TextBoxDataType ="string" },
                new Question { QuestionText = "What is your Service Point Id?", QuestionType = Question.QType.SinglelineTextBox, 
                    Active = true, ParentQuestionId =0, ParentRequiredAnswer="ServicePointId", TextBoxDataType="int"},
                #endregion //Client Questions
                
                new Question { QuestionText = "How do you identify yourself?", QuestionType = Question.QType.SingleSelect,
                    Active = true, Options = "Male|Female|Transgender|Other", ParentQuestionId =0},
                new Question { QuestionText = "Which racial/ethinic group do you identify yourself with the most?", QuestionType = Question.QType.SingleSelect,
                    Active = true, Options = "White/Caucasian|Black/African American|Hispanic/Latino|American Indian/Alaskan Native|Vietnamese|Other Asian|Pacific Islander|Other/Multi-ethnic", ParentQuestionId =0},
                new Question { QuestionText = "Have you ever served in the U.S. Armed Forces?", QuestionType = Question.QType.SingleSelect,
                    Active = true, Options = "Yes|No|Don't know|Decline to state", ParentQuestionId =0},
                new Question { QuestionText = "Were you activated, into active duty, as a member of the National Guard or as a reservist?", QuestionType = Question.QType.SingleSelect,
                    Active = true, Options = "Yes|No|Don't know|Decline to state",
                    ParentQuestionId=6, ParentRequiredAnswer="Yes",
                },
                new Question { QuestionText = "What is your current employment status", QuestionType = Question.QType.SingleSelect,
                    Active = true, Options = "Employed full-time|Employed part-time|Seasonal worker|Unemployed|Retired|Student|Day laborer/temporary employee", ParentQuestionId =0},





                #region PIT Questions
                new Question { QuestionText = "", QuestionType = Question.QType.SingleSelectRadio,
                    Active = true, Options = "Observation|Interview|Both", ParentQuestionId =0},
                new Question { QuestionText = "", QuestionType = Question.QType.SinglelineTextBoxForEachOption,
                    Active = true, Options = "Male|Female|Transgender|Not Sure", ParentQuestionId =0, TextBoxDataType="int"},
                new Question { QuestionText = "", QuestionType = Question.QType.SinglelineTextBoxForEachOption,
                    Active = true, Options = "Under 18|18 - 24|25 - 55|55 Over|Not Sure", ParentQuestionId =0, TextBoxDataType="int"},
                new Question { QuestionText = "", QuestionType = Question.QType.SinglelineTextBoxForEachOption,
                    Active = true, Options = "Individual|Couple|Family|Not Sure", ParentQuestionId =0, TextBoxDataType="int"},
                new Question { QuestionText = "Location:", QuestionType = Question.QType.SingleSelectRadio,
                    Active = true, Options = "Street or sidewalk|Vehicle (car, truck, van, camper)|Park|Abandoned building|Bus, train station, airport|Under bridge/overpass|Woods or outdoor encampment|Doorway or other private property|Other", ParentQuestionId =0}

                #endregion //PIT Questions
            };
            Questions.ForEach(q => context.Questions.AddOrUpdate(i => i.QuestionText, q));

            var Surveys = new List<Survey>
            {
                //new Survey { Title = "Santa Clara Survey", Active = true, 
                //    CreatedBy = 1, CreatedDate = DateTime.Now,
                //    Description = "This is Santa Clara Survey"},
                //new Survey { Title = "Santa Clara Intake", Active = true,
                //    CreatedBy = 1, CreatedDate = DateTime.Now,
                //    Description = "This is Santa Cruz Survey"},
                new Survey { Title = "Santa Clara PIT", Active = true,
                    CreatedBy = 1, CreatedDate = DateTime.Now,
                    Description = "This is Santa Clara PIT", IsPIT=true}
            };
            Surveys.ForEach(s => context.Surveys.AddOrUpdate(i => i.Title, s));
            context.SaveChanges();


            var SurveyQuestions = new List<SurveyQuestion>
            {
            //    new SurveyQuestion { SurveyId = Surveys.Single(s => s.Title == "Santa Clara Survey").SurveyId,
            //         QuestionId = Questions.Single(q => q.QuestionText == "How do you identify yourself?").QuestionId, 
            //         OrderId = 1},
            //    new SurveyQuestion { SurveyId = Surveys.Single(s => s.Title == "Santa Clara Survey").SurveyId,
            //         QuestionId = Questions.Single(q => q.QuestionText == "Which racial/ethinic group do you identify yourself with the most?").QuestionId,
            //         OrderId = 2},
            //    new SurveyQuestion { SurveyId = Surveys.Single(s => s.Title == "Santa Clara Survey").SurveyId,
            //         QuestionId = Questions.Single(q => q.QuestionText == "Have you ever served in the U.S. Armed Forces?").QuestionId,
            //         OrderId = 3},
            //    new SurveyQuestion { SurveyId = Surveys.Single(s => s.Title == "Santa Clara Survey").SurveyId,
            //         QuestionId = Questions.Single(q => q.QuestionText == "Were you activated, into active duty, as a member of the National Guard or as a reservist?").QuestionId,
            //         OrderId = 3},
            //    new SurveyQuestion { SurveyId = Surveys.Single(s => s.Title == "Santa Cruz Survey").SurveyId,
            //         QuestionId = Questions.Single(q => q.QuestionText == "How do you identify yourself?").QuestionId,
            //         OrderId = 2},
            //    new SurveyQuestion { SurveyId = Surveys.Single(s => s.Title == "Santa Cruz Survey").SurveyId,
            //         QuestionId = Questions.Single(q => q.QuestionText == "Which racial/ethinic group do you identify yourself with the most?").QuestionId,
            //         OrderId = 1},
            //    new SurveyQuestion { SurveyId = Surveys.Single(s => s.Title == "Santa Cruz Survey").SurveyId,
            //         QuestionId = Questions.Single(q => q.QuestionText == "Have you ever served in the U.S. Armed Forces?").QuestionId,
            //         OrderId = 3},



                #region PIT
                new SurveyQuestion { SurveyId = Surveys.Single(s => s.Title == "Santa Clara PIT").SurveyId,
                     QuestionId = Questions.Single(q => q.Options == "Observation|Interview|Both").QuestionId,
                     OrderId = 1},
                new SurveyQuestion { SurveyId = Surveys.Single(s => s.Title == "Santa Clara PIT").SurveyId,
                     QuestionId = Questions.Single(q => q.Options == "Male|Female|Not Sure").QuestionId,
                     OrderId = 2},

                new SurveyQuestion { SurveyId = Surveys.Single(s => s.Title == "Santa Clara PIT").SurveyId,
                     QuestionId = Questions.Single(q => q.Options == "Under 18|18 - 24|25 - 55|55 Over|Not Sure").QuestionId,
                     OrderId = 3},
                new SurveyQuestion { SurveyId = Surveys.Single(s => s.Title == "Santa Clara PIT").SurveyId,
                     QuestionId = Questions.Single(q => q.Options == "Individual|Couple|Family|Not Sure").QuestionId,
                     OrderId = 4},
                new SurveyQuestion { SurveyId = Surveys.Single(s => s.Title == "Santa Clara PIT").SurveyId,
                     QuestionId = Questions.Single(q => q.QuestionText == "Location:").QuestionId,
                     OrderId = 5},
                #endregion //PIT
            };

            foreach (SurveyQuestion sq in SurveyQuestions)
            {
                var SurveyQuestionInDataBase = context.SurveyQuestions.Where(
                    s => s.Survey.SurveyId == sq.SurveyId &&
                        s.Question.QuestionId == sq.QuestionId).SingleOrDefault();
                if (SurveyQuestionInDataBase == null)
                {
                    context.SurveyQuestions.Add(sq);
                }
            }

            // add groupsurvey
            //foreach (Survey s in Surveys)
            //{
            //    context.GroupSurveys.Add(new GroupSurvey { SurveyId = s.SurveyId, GroupId = 1 });
            //    context.GroupSurveys.Add(new GroupSurvey { SurveyId = s.SurveyId, GroupId = 2 });
            //}
            context.SaveChanges();
            #endregion //Survey
            
            #region Template Seeding
            var basicTemplate = new Template { Name = "Client", IsInternal= true, Active= true };
            context.Templates.Add(basicTemplate);
            context.SaveChanges();

            var tempQuests = new List<TemplateQuestion>
            {
                new TemplateQuestion { TemplateId  = context.Templates.Single(t => t.Name == "Client").TemplateId,
                     QuestionId = Questions.Single(q => q.QuestionText == "What is your birthday?").QuestionId,
                     OrderId = 1},
                new TemplateQuestion { TemplateId  = context.Templates.Single(t => t.Name == "Client").TemplateId,
                     QuestionId = Questions.Single(q => q.QuestionText == "What is your last 4 digits Social Security?").QuestionId,
                     OrderId = 3},
               new TemplateQuestion { TemplateId  = context.Templates.Single(t => t.Name == "Client").TemplateId,
                     QuestionId = Questions.Single(q => q.QuestionText == "What is your Service Point Id?").QuestionId,
                     OrderId =2}  
            };

            foreach (TemplateQuestion tq in tempQuests)
            {
                var TemplateQuestionInDataBase = context.TemplateQuestions.Where(
                    t =>t.TemplateId == tq.TemplateId &&
                      t.QuestionId == tq.QuestionId).SingleOrDefault();
                if (TemplateQuestionInDataBase == null)
                {
                    context.TemplateQuestions.Add(tq);
                }
            }


            #endregion //Template Seeding
            context.SaveChanges();

        }
    }
}
