namespace SurveyAdmin.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class KeyTweaks : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.ROIs", "ClientSurveyId", c => c.Int(nullable: false));
            CreateIndex("dbo.ROIs", "ClientSurveyId");
            AddForeignKey("dbo.ROIs", "ClientSurveyId", "dbo.ClientSurveys", "ClientSurveyId", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.ROIs", "ClientSurveyId", "dbo.ClientSurveys");
            DropIndex("dbo.ROIs", new[] { "ClientSurveyId" });
            DropColumn("dbo.ROIs", "ClientSurveyId");
        }
    }
}
