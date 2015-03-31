namespace SurveyAdmin.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddingUserIdkey : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.ClientSurveys", "EnteredBy", c => c.Int(nullable: false));
            CreateIndex("dbo.ClientSurveys", "EnteredBy");
            CreateIndex("dbo.ROIs", "EnteredBy");
            AddForeignKey("dbo.ClientSurveys", "EnteredBy", "dbo.AspNetUsers", "Id", cascadeDelete: false);
            AddForeignKey("dbo.ROIs", "EnteredBy", "dbo.AspNetUsers", "Id", cascadeDelete: false);
            DropColumn("dbo.ClientSurveys", "UserId");
        }
        
        public override void Down()
        {
            AddColumn("dbo.ClientSurveys", "UserId", c => c.Int(nullable: false));
            DropForeignKey("dbo.ROIs", "EnteredBy", "dbo.AspNetUsers");
            DropForeignKey("dbo.ClientSurveys", "EnteredBy", "dbo.AspNetUsers");
            DropIndex("dbo.ROIs", new[] { "EnteredBy" });
            DropIndex("dbo.ClientSurveys", new[] { "EnteredBy" });
            DropColumn("dbo.ClientSurveys", "EnteredBy");
        }
    }
}
