namespace SurveyAdmin.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddApplicationRoleTake2 : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.AspNetRoles", "Name", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.AspNetRoles", "Name", c => c.String(nullable: false));
        }
    }
}
