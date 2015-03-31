using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace SurveyAdmin.Models
{
    /// <summary>
    /// Group/Organization
    /// </summary>
    public class Group
    {
        public Group() { }

        public Group(string name)
            : this()
        {
            this.Name = name;
        }

        [Key]
        [Required]
        public virtual int GroupId { get; set; }

        public virtual string Name { get; set; }

    }
}