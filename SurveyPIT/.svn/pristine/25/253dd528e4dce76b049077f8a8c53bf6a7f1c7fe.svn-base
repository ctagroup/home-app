using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using SurveyPIT.Models;

namespace SurveyPIT.DAL
{
    public class SurveyDBContext: DbContext
    {
        public DbSet<Survey> Surveys { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<GroupSurvey> GroupSurveys { get; set; }
        public DbSet<SurveyQuestion> SurveyQuestions { get; set; }
        public DbSet<Client> Client { get; set; }
        public DbSet<Image> Images { get; set; }
        public DbSet<ClientSurvey> ClientSurveys { get; set; }
        public DbSet<ClientSurveyResponse> ClientSurveyResponses { get; set; }
        public DbSet<PIT> PITs { get; set; }
        public DbSet<Template> Templates { get; set; }
        public DbSet<TemplateQuestion> TemplateQuestions { get; set; }
        public DbSet<SurveyTemplate> SurveyTemplate { get; set; }
        public DbSet<EncampmentSite> EncampmentSites { get; set; }
        public DbSet<EncampmentVisit> EncampmentVisits { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }


    }
}