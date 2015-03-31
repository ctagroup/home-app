namespace SurveyAdmin.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Movingsurveymodelsfromapisite : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Clients",
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
                "dbo.ClientSurveyResponses",
                c => new
                    {
                        ClientSurveyResponseId = c.Int(nullable: false, identity: true),
                        ClientSurveyId = c.Int(nullable: false),
                        QuestionId = c.Int(nullable: false),
                        Value = c.String(),
                    })
                .PrimaryKey(t => t.ClientSurveyResponseId)
                .ForeignKey("dbo.ClientSurveys", t => t.ClientSurveyId, cascadeDelete: true)
                .ForeignKey("dbo.Questions", t => t.QuestionId, cascadeDelete: true)
                .Index(t => t.ClientSurveyId)
                .Index(t => t.QuestionId);
            
            CreateTable(
                "dbo.ClientSurveys",
                c => new
                    {
                        ClientSurveyId = c.Int(nullable: false, identity: true),
                        ClientId = c.Int(nullable: false),
                        SurveyId = c.Int(nullable: false),
                        UserId = c.Int(nullable: false),
                        SurveyDate = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.ClientSurveyId)
                .ForeignKey("dbo.Clients", t => t.ClientId, cascadeDelete: true)
                .ForeignKey("dbo.Surveys", t => t.SurveyId, cascadeDelete: true)
                .Index(t => t.ClientId)
                .Index(t => t.SurveyId);
            
            CreateTable(
                "dbo.Surveys",
                c => new
                    {
                        SurveyId = c.Int(nullable: false, identity: true),
                        Title = c.String(maxLength: 100),
                        Description = c.String(maxLength: 300),
                        CreatedBy = c.Int(nullable: false),
                        CreatedDate = c.DateTime(nullable: false),
                        UpdatedBy = c.Int(),
                        UpdatedDate = c.DateTime(),
                        ExpireOn = c.DateTime(),
                        Active = c.Boolean(nullable: false),
                        FilterQuestion = c.String(),
                        IsPIT = c.Boolean(nullable: false),
                        IsEncampment = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.SurveyId);
            
            CreateTable(
                "dbo.Questions",
                c => new
                    {
                        QuestionId = c.Int(nullable: false, identity: true),
                        QuestionText = c.String(),
                        Options = c.String(),
                        QuestionType = c.Int(nullable: false),
                        ParentQuestionId = c.Int(),
                        ParentRequiredAnswer = c.String(),
                        Active = c.Boolean(nullable: false),
                        Required = c.Boolean(nullable: false),
                        TextBoxDataType = c.String(maxLength: 20),
                    })
                .PrimaryKey(t => t.QuestionId);
            
            CreateTable(
                "dbo.EncampmentSites",
                c => new
                    {
                        EncampmentSiteId = c.Int(nullable: false, identity: true),
                        CouncilDistrict = c.Int(nullable: false),
                        EncampLocation = c.String(maxLength: 400),
                        EncampDispatchId = c.String(maxLength: 30),
                        SiteCode = c.String(maxLength: 20),
                        EncampmentType = c.String(maxLength: 100),
                        SizeOfEncampment = c.String(maxLength: 10),
                        EnvironmentalImpact = c.String(maxLength: 10),
                        VisibilityToThePublic = c.String(maxLength: 10),
                        Inactive = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.EncampmentSiteId);
            
            CreateTable(
                "dbo.EncampmentVisits",
                c => new
                    {
                        EncampmentVisitId = c.Int(nullable: false, identity: true),
                        VisitDate = c.DateTime(nullable: false),
                        EncampmentSiteId = c.Int(nullable: false),
                        Agency = c.String(maxLength: 20),
                        Worker = c.String(maxLength: 100),
                        Reason4Visit = c.String(),
                        Referrals = c.String(maxLength: 100),
                        Comments = c.String(),
                        UserId = c.String(maxLength: 120),
                    })
                .PrimaryKey(t => t.EncampmentVisitId)
                .ForeignKey("dbo.EncampmentSites", t => t.EncampmentSiteId, cascadeDelete: true)
                .Index(t => t.EncampmentSiteId);
            
            CreateTable(
                "dbo.GroupSurveys",
                c => new
                    {
                        GroupSurveyId = c.Int(nullable: false, identity: true),
                        GroupId = c.Int(nullable: false),
                        SurveyId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.GroupSurveyId);
            
            CreateTable(
                "dbo.Images",
                c => new
                    {
                        ImageId = c.Int(nullable: false, identity: true),
                        ClientId = c.Int(nullable: false),
                        path = c.String(),
                        ClientSurveyId = c.Int(),
                    })
                .PrimaryKey(t => t.ImageId)
                .ForeignKey("dbo.Clients", t => t.ClientId, cascadeDelete: true)
                .ForeignKey("dbo.ClientSurveys", t => t.ClientSurveyId)
                .Index(t => t.ClientId)
                .Index(t => t.ClientSurveyId);
            
            CreateTable(
                "dbo.PITs",
                c => new
                    {
                        PITId = c.Int(nullable: false, identity: true),
                        Model = c.String(),
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
                        Latitude = c.Double(nullable: false),
                        Longitude = c.Double(nullable: false),
                        CreatedDate = c.DateTime(nullable: false),
                        TypeOfLocation = c.Int(nullable: false),
                        UserId = c.Int(nullable: false),
                        ImageId = c.Int(),
                    })
                .PrimaryKey(t => t.PITId)
                .ForeignKey("dbo.Images", t => t.ImageId)
                .Index(t => t.ImageId);
            
            CreateTable(
                "dbo.SurveyQuestions",
                c => new
                    {
                        SurveyQuestionId = c.Int(nullable: false, identity: true),
                        SurveyId = c.Int(nullable: false),
                        QuestionId = c.Int(nullable: false),
                        OrderId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.SurveyQuestionId)
                .ForeignKey("dbo.Questions", t => t.QuestionId, cascadeDelete: true)
                .ForeignKey("dbo.Surveys", t => t.SurveyId, cascadeDelete: true)
                .Index(t => t.SurveyId)
                .Index(t => t.QuestionId);
            
            CreateTable(
                "dbo.SurveyTemplates",
                c => new
                    {
                        SurveyTemplateId = c.Int(nullable: false, identity: true),
                        SurveyId = c.Int(nullable: false),
                        TemplateId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.SurveyTemplateId);
            
            CreateTable(
                "dbo.TemplateQuestions",
                c => new
                    {
                        TemplateQuestionId = c.Int(nullable: false, identity: true),
                        TemplateId = c.Int(nullable: false),
                        QuestionId = c.Int(nullable: false),
                        OrderId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.TemplateQuestionId);
            
            CreateTable(
                "dbo.Templates",
                c => new
                    {
                        TemplateId = c.Int(nullable: false, identity: true),
                        Name = c.String(maxLength: 100),
                        IsInternal = c.Boolean(nullable: false),
                        Active = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.TemplateId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.SurveyQuestions", "Id", "dbo.Surveys");
            DropForeignKey("dbo.SurveyQuestions", "Id", "dbo.Questions");
            DropForeignKey("dbo.PITs", "ImageId", "dbo.Images");
            DropForeignKey("dbo.Images", "ClientSurveyId", "dbo.ClientSurveys");
            DropForeignKey("dbo.Images", "ClientId", "dbo.Clients");
            DropForeignKey("dbo.EncampmentVisits", "EncampmentSiteId", "dbo.EncampmentSites");
            DropForeignKey("dbo.ClientSurveyResponses", "Id", "dbo.Questions");
            DropForeignKey("dbo.ClientSurveyResponses", "ClientSurveyId", "dbo.ClientSurveys");
            DropForeignKey("dbo.ClientSurveys", "Id", "dbo.Surveys");
            DropForeignKey("dbo.ClientSurveys", "ClientId", "dbo.Clients");
            DropIndex("dbo.SurveyQuestions", new[] { "Id" });
            DropIndex("dbo.SurveyQuestions", new[] { "Id" });
            DropIndex("dbo.PITs", new[] { "ImageId" });
            DropIndex("dbo.Images", new[] { "ClientSurveyId" });
            DropIndex("dbo.Images", new[] { "ClientId" });
            DropIndex("dbo.EncampmentVisits", new[] { "EncampmentSiteId" });
            DropIndex("dbo.ClientSurveys", new[] { "Id" });
            DropIndex("dbo.ClientSurveys", new[] { "ClientId" });
            DropIndex("dbo.ClientSurveyResponses", new[] { "Id" });
            DropIndex("dbo.ClientSurveyResponses", new[] { "ClientSurveyId" });
            DropTable("dbo.Templates");
            DropTable("dbo.TemplateQuestions");
            DropTable("dbo.SurveyTemplates");
            DropTable("dbo.SurveyQuestions");
            DropTable("dbo.PITs");
            DropTable("dbo.Images");
            DropTable("dbo.GroupSurveys");
            DropTable("dbo.EncampmentVisits");
            DropTable("dbo.EncampmentSites");
            DropTable("dbo.Questions");
            DropTable("dbo.Surveys");
            DropTable("dbo.ClientSurveys");
            DropTable("dbo.ClientSurveyResponses");
            DropTable("dbo.Clients");
        }
    }
}
