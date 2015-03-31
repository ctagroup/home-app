namespace SurveyAdmin.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Shiftedaroundidnamessomeandaddedquestionstosurvey : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Questions", "Survey_SurveyId", c => c.Int());
            CreateIndex("dbo.Questions", "Survey_SurveyId");
            AddForeignKey("dbo.Questions", "Survey_SurveyId", "dbo.Surveys", "SurveyId");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Questions", "Survey_SurveyId", "dbo.Surveys");
            DropIndex("dbo.Questions", new[] { "Survey_SurveyId" });
            DropColumn("dbo.Questions", "Survey_SurveyId");
        }
    }
}
