namespace SurveyAdmin.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Changingnullabilityofcouncildistrict : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.EncampmentSites", "CouncilDistrict", c => c.Int());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.EncampmentSites", "CouncilDistrict", c => c.Int(nullable: false));
        }
    }
}
