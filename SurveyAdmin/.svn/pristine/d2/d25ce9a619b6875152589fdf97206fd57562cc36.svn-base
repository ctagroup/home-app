namespace SurveyAdmin.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Addingparentquestion : DbMigration
    {
        public override void Up()
        {
            CreateIndex("dbo.Questions", "ParentQuestionId");
            AddForeignKey("dbo.Questions", "ParentQuestionId", "dbo.Questions", "QuestionId");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Questions", "ParentQuestionId", "dbo.Questions");
            DropIndex("dbo.Questions", new[] { "ParentQuestionId" });
        }
    }
}
