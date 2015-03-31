namespace SurveyAdmin.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Screwdupnulldatetime : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.PITs", "SubmissionDate", c => c.DateTime());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.PITs", "SubmissionDate", c => c.DateTime(nullable: false));
        }
    }
}
