namespace SurveyAdmin.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Addingnoesandsubmissiondatetopit : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.PITs", "Notes", c => c.String());
            AddColumn("dbo.PITs", "SubmissionDate", c => c.DateTime(nullable: true));
        }
        
        public override void Down()
        {
            DropColumn("dbo.PITs", "SubmissionDate");
            DropColumn("dbo.PITs", "Notes");
        }
    }
}
