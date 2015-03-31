namespace SurveyAdmin.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class doesthisdoanythign : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.ClientSurveyResponses", "ClientSurveyId", "dbo.ClientSurveys");
            DropForeignKey("dbo.ClientSurveyResponses", "QuestionId", "dbo.Questions");
            DropIndex("dbo.ClientSurveyResponses", new[] { "ClientSurveyId" });
            DropIndex("dbo.ClientSurveyResponses", new[] { "QuestionId" });
            AlterColumn("dbo.ClientSurveyResponses", "ClientSurveyId", c => c.Int(nullable: false));
            AlterColumn("dbo.ClientSurveyResponses", "QuestionId", c => c.Int(nullable: false));
            CreateIndex("dbo.ClientSurveyResponses", "ClientSurveyId");
            CreateIndex("dbo.ClientSurveyResponses", "QuestionId");
            AddForeignKey("dbo.ClientSurveyResponses", "ClientSurveyId", "dbo.ClientSurveys", "ClientSurveyId", cascadeDelete: false);
            AddForeignKey("dbo.ClientSurveyResponses", "QuestionId", "dbo.Questions", "QuestionId", cascadeDelete: false);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.ClientSurveyResponses", "QuestionId", "dbo.Questions");
            DropForeignKey("dbo.ClientSurveyResponses", "ClientSurveyId", "dbo.ClientSurveys");
            DropIndex("dbo.ClientSurveyResponses", new[] { "QuestionId" });
            DropIndex("dbo.ClientSurveyResponses", new[] { "ClientSurveyId" });
            AlterColumn("dbo.ClientSurveyResponses", "QuestionId", c => c.Int());
            AlterColumn("dbo.ClientSurveyResponses", "ClientSurveyId", c => c.Int());
            CreateIndex("dbo.ClientSurveyResponses", "QuestionId");
            CreateIndex("dbo.ClientSurveyResponses", "ClientSurveyId");
            AddForeignKey("dbo.ClientSurveyResponses", "QuestionId", "dbo.Questions", "QuestionId");
            AddForeignKey("dbo.ClientSurveyResponses", "ClientSurveyId", "dbo.ClientSurveys", "ClientSurveyId");
        }
    }
}
