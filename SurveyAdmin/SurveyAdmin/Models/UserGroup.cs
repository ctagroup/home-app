using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace SurveyAdmin.Models
{
    /// <summary>
    /// User may belongs to multiple group
    /// For PIT user could only belong to one group otherwise we need to add another step in UI to select which PIT to use
    /// </summary>
    public class UserGroup
    {
        [Required]
        [Index ("IX_UserIdAndGroupId", 1)] 
        public virtual string UserId { get; set; }
        [Required]
        [Index("IX_UserIdAndGroupId", 2)] 
        public virtual int GroupId { get; set; }

        public virtual ApplicationUser User { get; set; }
        public virtual Group Group { get; set; }

  
    }
}