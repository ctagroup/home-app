using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration;
using System;
using SurveyAdmin.Models.SurveyInfo;

namespace SurveyAdmin.Models
{
    public class AppUserLogin : IdentityUserLogin<int>
    {
    }

    public class AppUserRole : IdentityUserRole<int>
    {
    }

    public class AppUserClaim : IdentityUserClaim<int>
    {
    }

    public class Role : IdentityRole<int, AppUserRole>
    {
        public Role() : base()
        {
            
        }

        public Role(string name, string description)
            : base()
        {
            this.Name = name;
            this.Description = description;
        }

        public virtual string Description { get; set; }
    }

    // You can add profile data for the user by adding more properties to your ApplicationUser class, please visit http://go.microsoft.com/fwlink/?LinkID=317594 to learn more.
    public class ApplicationUser : IdentityUser<int, AppUserLogin, AppUserRole, AppUserClaim>,
        IUser<int>
    {
        public ApplicationUser()
            : base()
        {
            this.Groups = new HashSet<UserGroup>();
        }

        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        [Required]
        public string Organization { get; set; }

        /// <summary>
        /// This is for setting whether it is our service point(HMIS) or just survey account
        /// CTA - local account
        /// CTA Service Point - Service Point (HMIS) that CTA host
        /// </summary>
        public string AccountType { get; set; }

        public bool Active { get; set; }

        public virtual ICollection<UserGroup> Groups { get; set; }
    }

    public class ApplicationDbContext :
        IdentityDbContext<ApplicationUser, Role, int, AppUserLogin, AppUserRole, AppUserClaim>
    {
        public virtual IDbSet<Group> Groups { get; set; }

        public DbSet<Survey> Surveys { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<GroupSurvey> GroupSurveys { get; set; }
        public DbSet<SurveyQuestion> SurveyQuestions { get; set; }
        public DbSet<Client> Client { get; set; }
        public DbSet<Image> Images { get; set; }
        public DbSet<ClientSurvey> ClientSurveys { get; set; }
        public DbSet<ClientSurveyResponse> ClientSurveyResponses { get; set; }
        public DbSet<PIT> PITs { get; set; }
        public DbSet<Template> Templates { get; set; }
        public DbSet<TemplateQuestion> TemplateQuestions { get; set; }
        public DbSet<SurveyTemplate> SurveyTemplate { get; set; }
        public DbSet<EncampmentSite> EncampmentSites { get; set; }
        public DbSet<EncampmentVisit> EncampmentVisits { get; set; }
        public DbSet<ROI> ROIs { get; set; }


        public ApplicationDbContext()
            : base("DefaultConnection")
        {
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            if (modelBuilder == null)
            {
                throw new ArgumentNullException("modelBuilder");
            }

//            base.OnModelCreating(modelBuilder);

            // Keep this:
            modelBuilder.Entity<ApplicationUser>().ToTable("AspNetUsers");
            // Change TUser to ApplicationUser everywhere else - IdentityUser 
            // and ApplicationUser essentially 'share' the AspNetUsers Table in the database:
            EntityTypeConfiguration<ApplicationUser> table =
                modelBuilder.Entity<ApplicationUser>().ToTable("AspNetUsers");
            table.Property((ApplicationUser u) => u.UserName).IsRequired();
            // EF won't let us swap out IdentityUserRole for ApplicationUserRole here:
            modelBuilder.Entity<ApplicationUser>().HasMany<AppUserRole>((ApplicationUser u) => u.Roles);
            modelBuilder.Entity<AppUserRole>().HasKey((AppUserRole r) =>
                new {UserId = r.UserId, RoleId = r.RoleId}).ToTable("AspNetUserRoles");

            // Add the group stuff here:
            modelBuilder.Entity<ApplicationUser>().HasMany<UserGroup>((ApplicationUser u) => u.Groups);
            modelBuilder.Entity<UserGroup>().HasKey((UserGroup r) =>
                new {UserId = r.UserId, GroupId = r.GroupId}).ToTable("UserGroups");
            // And Here:
            EntityTypeConfiguration<Group> groupsConfig = modelBuilder.Entity<Group>().ToTable("Groups");
            groupsConfig.Property((Group r) => r.Name).IsRequired();
            // Leave this alone:
            EntityTypeConfiguration<AppUserLogin> entityTypeConfiguration =
                modelBuilder.Entity<AppUserLogin>().HasKey((AppUserLogin l) =>
                    new {UserId = l.UserId, LoginProvider = l.LoginProvider, ProviderKey = l.ProviderKey})
                    .ToTable("AspNetUserLogins");

            EntityTypeConfiguration<AppUserClaim> table1 =
                modelBuilder.Entity<AppUserClaim>().ToTable("AspNetUserClaims");

            // Add this, so that IdentityRole can share a table with Role:
            modelBuilder.Entity<Role>().ToTable("AspNetRoles");

            // Change these from IdentityRole to Role:
            EntityTypeConfiguration<Role> entityTypeConfiguration1 =
                modelBuilder.Entity<Role>().ToTable("AspNetRoles");
            entityTypeConfiguration1.Property((Role r) => r.Name).IsRequired();

            //modelBuilder.Entity<IdentityUserLogin>().HasKey<string>(l => l.UserId);
            //modelBuilder.Entity<IdentityRole>().HasKey<string>(r => r.Id);
            //modelBuilder.Entity<IdentityUserRole>().HasKey(r => new { r.RoleId, r.UserId });
        }
    }
}