using SurveyAdmin.Models;

namespace SurveyAdmin.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Collections.Generic;
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<SurveyAdmin.Models.ApplicationDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationDataLossAllowed = true;
            AutomaticMigrationsEnabled = true;
            ContextKey = "SurveyAdmin.Models.ApplicationDbContext";
        }

        protected override void Seed(SurveyAdmin.Models.ApplicationDbContext context)
        {            
            var RoleManager = new RoleManager<Role, int>(new
                              RoleStore<Role, int, AppUserRole>(context));
            var roles = new List<string> { "SuperAdmin","Admin", "Survey Creator","Surveyor", "Report"};
            foreach (string role in roles)
            {
                if (!RoleManager.RoleExists(role))
                {
                    var roleresult = RoleManager.Create(new Role(role, ""));
                }
            }

            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data. E.g.
            //
            //    context.People.AddOrUpdate(
            //      p => p.FullName,
            //      new Person { FullName = "Andrew Peters" },
            //      new Person { FullName = "Brice Lambson" },
            //      new Person { FullName = "Rowan Miller" }
            //    );
            //
        }
    }
}
