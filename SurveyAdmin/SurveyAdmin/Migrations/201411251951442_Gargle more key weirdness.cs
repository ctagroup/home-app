namespace SurveyAdmin.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Garglemorekeyweirdness : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.ROIs", "EnteredBy", "dbo.AspNetUsers");
            DropIndex("dbo.ROIs", new[] { "EnteredBy" });
            AlterColumn("dbo.ROIs", "EnteredBy", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.ROIs", "EnteredBy", c => c.String(maxLength: 128));
            CreateIndex("dbo.ROIs", "EnteredBy");
            AddForeignKey("dbo.ROIs", "EnteredBy", "dbo.AspNetUsers", "Id");
        }
    }
}
