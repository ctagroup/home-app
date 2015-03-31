namespace SurveyAdmin.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Bumpingsizeoffieldsonencampment : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.EncampmentSites", "EncampLocation", c => c.String(maxLength: 2000));
            AlterColumn("dbo.EncampmentSites", "EncampDispatchId", c => c.String(maxLength: 2000));
            AlterColumn("dbo.EncampmentSites", "SiteCode", c => c.String(maxLength: 2000));
            AlterColumn("dbo.EncampmentSites", "EncampmentType", c => c.String(maxLength: 2000));
            AlterColumn("dbo.EncampmentSites", "SizeOfEncampment", c => c.String(maxLength: 2000));
            AlterColumn("dbo.EncampmentSites", "EnvironmentalImpact", c => c.String(maxLength: 2000));
            AlterColumn("dbo.EncampmentSites", "VisibilityToThePublic", c => c.String(maxLength: 2000));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.EncampmentSites", "VisibilityToThePublic", c => c.String(maxLength: 10));
            AlterColumn("dbo.EncampmentSites", "EnvironmentalImpact", c => c.String(maxLength: 10));
            AlterColumn("dbo.EncampmentSites", "SizeOfEncampment", c => c.String(maxLength: 10));
            AlterColumn("dbo.EncampmentSites", "EncampmentType", c => c.String(maxLength: 100));
            AlterColumn("dbo.EncampmentSites", "SiteCode", c => c.String(maxLength: 20));
            AlterColumn("dbo.EncampmentSites", "EncampDispatchId", c => c.String(maxLength: 30));
            AlterColumn("dbo.EncampmentSites", "EncampLocation", c => c.String(maxLength: 400));
        }
    }
}
