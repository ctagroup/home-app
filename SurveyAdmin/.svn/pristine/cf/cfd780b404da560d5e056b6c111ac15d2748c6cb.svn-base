namespace SurveyAdmin.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Whoomoredbchanges : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.ClientSurveys", "Notes", c => c.String());
            AddColumn("dbo.ClientSurveys", "SubmissionDate", c => c.DateTime());
        }
        
        public override void Down()
        {
            DropColumn("dbo.ClientSurveys", "SubmissionDate");
            DropColumn("dbo.ClientSurveys", "Notes");
        }
    }
}
