namespace SurveyAdmin.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class anythingtodo : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Questions", "SurveyId", "dbo.Surveys");
            DropIndex("dbo.Questions", new[] { "SurveyId" });
            AlterColumn("dbo.Questions", "SurveyId", c => c.Int(nullable: false));
            CreateIndex("dbo.Questions", "SurveyId");
            AddForeignKey("dbo.Questions", "SurveyId", "dbo.Surveys", "SurveyId", cascadeDelete: false);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Questions", "SurveyId", "dbo.Surveys");
            DropIndex("dbo.Questions", new[] { "SurveyId" });
            AlterColumn("dbo.Questions", "SurveyId", c => c.Int());
            CreateIndex("dbo.Questions", "SurveyId");
            AddForeignKey("dbo.Questions", "SurveyId", "dbo.Surveys", "SurveyId");
        }
    }
}
