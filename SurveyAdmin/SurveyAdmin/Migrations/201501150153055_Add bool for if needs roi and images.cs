namespace SurveyAdmin.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Addboolforifneedsroiandimages : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Surveys", "NeedsROIAndImages", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Surveys", "NeedsROIAndImages");
        }
    }
}
