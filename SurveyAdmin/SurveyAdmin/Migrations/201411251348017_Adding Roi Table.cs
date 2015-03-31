namespace SurveyAdmin.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddingRoiTable : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.ROIs",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        EnteredBy = c.String(maxLength: 128),
                        Name = c.String(nullable: false),
                        Date = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.EnteredBy)
                .Index(t => t.EnteredBy);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.ROIs", "EnteredBy", "dbo.AspNetUsers");
            DropIndex("dbo.ROIs", new[] { "EnteredBy" });
            DropTable("dbo.ROIs");
        }
    }
}
