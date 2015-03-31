using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace SurveyAdmin.Models.SurveyInfo
{
    public class Survey
    {
        private readonly ApplicationDbContext applicationDbContext = new ApplicationDbContext();

        public int SurveyId { get; set; }

        [MaxLength(100)]
        public string Title { get; set; }

        [MaxLength(300)]
        public string Description { get; set; }

        public int CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public DateTime? ExpireOn { get; set; }
        public bool Active { get; set; }

        /// <summary>
        /// Filter HUD question ; the question in client section
        /// </summary>
        public string FilterQuestion { get; set; }

        /// <summary>
        /// There should only be one survey per group for PIT
        /// </summary>
        public bool IsPIT { get; set; }

        public bool IsEncampment { get; set; }

        public bool NeedsROIAndImages { get; set; }

        [NotMapped]
        public virtual List<Question> QuestionTree {
            get
            {
                var questions = new List<Question>();

                var myQuestions =
                    applicationDbContext.SurveyQuestions.Where(sq => sq.SurveyId == SurveyId)
                        .Select(s => s.Question).ToList();

                foreach (var q in myQuestions)
                {
                    var children = myQuestions.Where(c => c.ParentQuestionId == q.QuestionId);
                    q.Children.AddRange(children);

                    if (!q.ParentQuestionId.HasValue)
                    {
                        questions.Add(q);
                    }
                }

                return questions;
            } 
        } 
    }
}