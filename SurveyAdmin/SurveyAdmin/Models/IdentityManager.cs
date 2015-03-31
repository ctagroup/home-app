using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using SurveyAdmin.Models;

public class IdentityManager
{
    // Swap Role for IdentityRole:
    RoleManager<Role, int> _roleManager = new RoleManager<Role,int>(
        new RoleStore<Role,int,AppUserRole>(new ApplicationDbContext()));

    UserManager<ApplicationUser, int> _userManager = new UserManager<ApplicationUser, int>(
        new UserStore<ApplicationUser, Role, int, AppUserLogin, AppUserRole, AppUserClaim>(new ApplicationDbContext()));

    ApplicationDbContext _db = new ApplicationDbContext();


    public bool RoleExists(string name)
    {
        return _roleManager.RoleExists(name);
    }


    public bool CreateRole(string name, string description = "")
    {
        // Swap Role for IdentityRole:
        var idResult = _roleManager.Create(new Role(name, description));
        return idResult.Succeeded;
    }


    public bool CreateUser(ApplicationUser user, string password)
    {
        var idResult = _userManager.Create(user, password);
        return idResult.Succeeded;
    }


    public bool AddUserToRole(int userId, string roleName)
    {
        var idResult = _userManager.AddToRole(userId, roleName);
        return idResult.Succeeded;
    }


    public void ClearUserRoles(int userId)
    {
        var user = _userManager.FindById(userId);
        var currentRoles = new List<AppUserRole>();

//        currentRoles.AddRange(user.Roles);
        foreach (var role in currentRoles)
        {
            var appRole = _db.Roles.First(r => r.Id == role.RoleId);

            _userManager.RemoveFromRole(userId, appRole.Name);
        }
    }
}