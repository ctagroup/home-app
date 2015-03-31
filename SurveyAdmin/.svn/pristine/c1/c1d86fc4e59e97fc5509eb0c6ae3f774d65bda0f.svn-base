namespace SurveyAdmin.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class droppingsurveyidfromquestions : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Questions", "SurveyId", "dbo.Surveys");
            DropForeignKey("dbo.Questions", "FK_dbo.Questions_dbo.Surveys_Survey_SurveyId");
            DropIndex("dbo.Questions", new[] { "SurveyId" });
            DropColumn("dbo.Questions", "SurveyId");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Questions", "SurveyId", c => c.Int(nullable: false));
            CreateIndex("dbo.Questions", "SurveyId");
            AddForeignKey("dbo.Questions", "SurveyId", "dbo.Surveys", "SurveyId", cascadeDelete: true);
        }
    }
}
