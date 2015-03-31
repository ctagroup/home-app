namespace SurveyAdmin.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Removingbirthdatefrmoclient : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.Clients", "Birthday");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Clients", "Birthday", c => c.DateTime(nullable: false));
        }
    }
}
