namespace SurveyAdmin.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Needsurveyid : DbMigration
    {
        public override void Up()
        {
            RenameColumn(table: "dbo.Questions", name: "Survey_SurveyId", newName: "SurveyId");
            RenameIndex(table: "dbo.Questions", name: "IX_Survey_SurveyId", newName: "IX_SurveyId");
        }
        
        public override void Down()
        {
            RenameIndex(table: "dbo.Questions", name: "IX_SurveyId", newName: "IX_Survey_SurveyId");
            RenameColumn(table: "dbo.Questions", name: "SurveyId", newName: "Survey_SurveyId");
        }
    }
}
