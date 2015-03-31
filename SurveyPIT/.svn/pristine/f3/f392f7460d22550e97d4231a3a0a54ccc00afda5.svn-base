namespace SurveyPIT.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Create : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Client",
                c => new
                    {
                        ClientId = c.Int(nullable: false, identity: true),
                        Birthday = c.DateTime(nullable: false),
                        Latitude = c.Double(nullable: false),
                        Longitude = c.Double(nullable: false),
                        Last4SSN = c.String(maxLength: 4),
                        ServicePointClientID = c.Int(),
                    })
                .PrimaryKey(t => t.ClientId);
            
            CreateTable(
                "dbo.ClientSurveyResponse",
                c => new
                    {
                        ClientSurveyResponseId = c.Int(nullable: false, identity: true),
                        ClientSurveyId = c.Int(nullable: false),
                        QuestionId = c.Int(nullable: false),
                        Value = c.String(),
                    })
                .PrimaryKey(t => t.ClientSurveyResponseId)
                .ForeignKey("dbo.ClientSurvey", t => t.ClientSurveyId, cascadeDelete: true)
                .ForeignKey("dbo.Question", t => t.QuestionId, cascadeDelete: true)
                .Index(t => t.ClientSurveyId)
                .Index(t => t.QuestionId);
            
            CreateTable(
                "dbo.ClientSurvey",
                c => new
                    {
                        ClientSurveyId = c.Int(nullable: false, identity: true),
                        ClientId = c.Int(nullable: false),
                        SurveyId = c.Int(nullable: false),
                        UserId = c.Int(nullable: false),
                        SurveyDate = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.ClientSurveyId)
                .ForeignKey("dbo.Client", t => t.ClientId, cascadeDelete: true)
                .ForeignKey("dbo.Survey", t => t.SurveyId, cascadeDelete: true)
                .ForeignKey("dbo.User", t => t.UserId, cascadeDelete: true)
                .Index(t => t.ClientId)
                .Index(t => t.SurveyId)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.Survey",
                c => new
                    {
                        SurveyId = c.Int(nullable: false, identity: true),
                        Title = c.String(),
                        Description = c.String(),
                        CreatedBy = c.Int(nullable: false),
                        CreatedDate = c.DateTime(nullable: false),
                        UpdatedBy = c.Int(),
                        UpdatedDate = c.DateTime(),
                        ExpireOn = c.DateTime(),
                        Active = c.Boolean(nullable: false),
                        FilterQuestion = c.String(),
                    })
                .PrimaryKey(t => t.SurveyId);
            
            CreateTable(
                "dbo.User",
                c => new
                    {
                        UserId = c.Int(nullable: false, identity: true),
                        UserName = c.String(nullable: false),
                        Password = c.String(),
                        FirstName = c.String(),
                        LastName = c.String(),
                        Email = c.String(),
                        RoleId = c.Int(nullable: false),
                        Active = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.UserId)
                .ForeignKey("dbo.Role", t => t.RoleId, cascadeDelete: true)
                .Index(t => t.RoleId);
            
            CreateTable(
                "dbo.Role",
                c => new
                    {
                        RoleId = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.RoleId);
            
            CreateTable(
                "dbo.Question",
                c => new
                    {
                        QuestionId = c.Int(nullable: false, identity: true),
                        QuestionText = c.String(),
                        Options = c.String(),
                        QuestionType = c.Int(nullable: false),
                        ParentQuestionId = c.Int(),
                        ParentRequiredAnswer = c.String(),
                        Active = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.QuestionId);
            
            CreateTable(
                "dbo.Group",
                c => new
                    {
                        GroupId = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.GroupId);
            
            CreateTable(
                "dbo.GroupSurvey",
                c => new
                    {
                        GroupSurveyId = c.Int(nullable: false, identity: true),
                        GroupId = c.Int(nullable: false),
                        SurveyId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.GroupSurveyId);
            
            CreateTable(
                "dbo.Image",
                c => new
                    {
                        ImageId = c.Int(nullable: false, identity: true),
                        ClientId = c.Int(nullable: false),
                        path = c.String(),
                        ClientSurveyId = c.Int(),
                    })
                .PrimaryKey(t => t.ImageId)
                .ForeignKey("dbo.Client", t => t.ClientId, cascadeDelete: true)
                .ForeignKey("dbo.ClientSurvey", t => t.ClientSurveyId)
                .Index(t => t.ClientId)
                .Index(t => t.ClientSurveyId);
            
            CreateTable(
                "dbo.PIT",
                c => new
                    {
                        PITId = c.Int(nullable: false, identity: true),
                        TotalPeople = c.Int(nullable: false),
                        NoMale = c.Int(nullable: false),
                        NoFemale = c.Int(nullable: false),
                        NoUnable2DetermineSex = c.Int(nullable: false),
                        NoLessthan18 = c.Int(nullable: false),
                        No18to24 = c.Int(nullable: false),
                        No25to55 = c.Int(nullable: false),
                        NoOver55 = c.Int(nullable: false),
                        NoUnable2DetermineAge = c.Int(nullable: false),
                        NoIndividual = c.Int(nullable: false),
                        NoCouple = c.Int(nullable: false),
                        NoFamily = c.Int(nullable: false),
                        NoUnable2DetermineHouseHold = c.Int(nullable: false),
                        Latitude = c.Decimal(nullable: false, precision: 18, scale: 2),
                        Longitude = c.Decimal(nullable: false, precision: 18, scale: 2),
                        createdDate = c.DateTime(nullable: false),
                        TypeOfLocation = c.Int(nullable: false),
                        UserId = c.Int(nullable: false),
                        ImageId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.PITId)
                .ForeignKey("dbo.Image", t => t.ImageId, cascadeDelete: true)
                .ForeignKey("dbo.User", t => t.UserId, cascadeDelete: true)
                .Index(t => t.ImageId)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.SurveyQuestion",
                c => new
                    {
                        SurveyQuestionId = c.Int(nullable: false, identity: true),
                        SurveyId = c.Int(nullable: false),
                        QuestionId = c.Int(nullable: false),
                        OrderId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.SurveyQuestionId)
                .ForeignKey("dbo.Question", t => t.QuestionId, cascadeDelete: true)
                .ForeignKey("dbo.Survey", t => t.SurveyId, cascadeDelete: true)
                .Index(t => t.QuestionId)
                .Index(t => t.SurveyId);
            
            CreateTable(
                "dbo.SurveyTemplate",
                c => new
                    {
                        SurveyTemplateId = c.Int(nullable: false, identity: true),
                        SurveyId = c.Int(nullable: false),
                        TemplateId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.SurveyTemplateId);
            
            CreateTable(
                "dbo.TemplateQuestion",
                c => new
                    {
                        TemplateQuestionId = c.Int(nullable: false, identity: true),
                        TemplateId = c.Int(nullable: false),
                        QuestionId = c.Int(nullable: false),
                        OrderId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.TemplateQuestionId);
            
            CreateTable(
                "dbo.Template",
                c => new
                    {
                        TemplateId = c.Int(nullable: false, identity: true),
                        Name = c.String(maxLength: 100),
                        IsInternal = c.Boolean(nullable: false),
                        Active = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.TemplateId);
            
            CreateTable(
                "dbo.UserGroup",
                c => new
                    {
                        UserGroupId = c.Int(nullable: false, identity: true),
                        UserId = c.Int(nullable: false),
                        GroupId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.UserGroupId)
                .ForeignKey("dbo.Group", t => t.GroupId, cascadeDelete: true)
                .ForeignKey("dbo.User", t => t.UserId, cascadeDelete: true)
                .Index(t => t.GroupId)
                .Index(t => t.UserId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.UserGroup", "UserId", "dbo.User");
            DropForeignKey("dbo.UserGroup", "GroupId", "dbo.Group");
            DropForeignKey("dbo.SurveyQuestion", "SurveyId", "dbo.Survey");
            DropForeignKey("dbo.SurveyQuestion", "QuestionId", "dbo.Question");
            DropForeignKey("dbo.PIT", "UserId", "dbo.User");
            DropForeignKey("dbo.PIT", "ImageId", "dbo.Image");
            DropForeignKey("dbo.Image", "ClientSurveyId", "dbo.ClientSurvey");
            DropForeignKey("dbo.Image", "ClientId", "dbo.Client");
            DropForeignKey("dbo.ClientSurveyResponse", "QuestionId", "dbo.Question");
            DropForeignKey("dbo.ClientSurveyResponse", "ClientSurveyId", "dbo.ClientSurvey");
            DropForeignKey("dbo.ClientSurvey", "UserId", "dbo.User");
            DropForeignKey("dbo.User", "RoleId", "dbo.Role");
            DropForeignKey("dbo.ClientSurvey", "SurveyId", "dbo.Survey");
            DropForeignKey("dbo.ClientSurvey", "ClientId", "dbo.Client");
            DropIndex("dbo.UserGroup", new[] { "UserId" });
            DropIndex("dbo.UserGroup", new[] { "GroupId" });
            DropIndex("dbo.SurveyQuestion", new[] { "SurveyId" });
            DropIndex("dbo.SurveyQuestion", new[] { "QuestionId" });
            DropIndex("dbo.PIT", new[] { "UserId" });
            DropIndex("dbo.PIT", new[] { "ImageId" });
            DropIndex("dbo.Image", new[] { "ClientSurveyId" });
            DropIndex("dbo.Image", new[] { "ClientId" });
            DropIndex("dbo.ClientSurveyResponse", new[] { "QuestionId" });
            DropIndex("dbo.ClientSurveyResponse", new[] { "ClientSurveyId" });
            DropIndex("dbo.ClientSurvey", new[] { "UserId" });
            DropIndex("dbo.User", new[] { "RoleId" });
            DropIndex("dbo.ClientSurvey", new[] { "SurveyId" });
            DropIndex("dbo.ClientSurvey", new[] { "ClientId" });
            DropTable("dbo.UserGroup");
            DropTable("dbo.Template");
            DropTable("dbo.TemplateQuestion");
            DropTable("dbo.SurveyTemplate");
            DropTable("dbo.SurveyQuestion");
            DropTable("dbo.PIT");
            DropTable("dbo.Image");
            DropTable("dbo.GroupSurvey");
            DropTable("dbo.Group");
            DropTable("dbo.Question");
            DropTable("dbo.Role");
            DropTable("dbo.User");
            DropTable("dbo.Survey");
            DropTable("dbo.ClientSurvey");
            DropTable("dbo.ClientSurveyResponse");
            DropTable("dbo.Client");
        }
    }
}
