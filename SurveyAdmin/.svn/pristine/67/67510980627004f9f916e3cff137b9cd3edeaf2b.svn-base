namespace SurveyAdmin.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddingUserBackToPit : DbMigration
    {
        public override void Up()
        {
            CreateIndex("dbo.PITs", "UserId");
            AddForeignKey("dbo.PITs", "UserId", "dbo.AspNetUsers", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.PITs", "UserId", "dbo.AspNetUsers");
            DropIndex("dbo.PITs", new[] { "UserId" });
        }
    }
}
