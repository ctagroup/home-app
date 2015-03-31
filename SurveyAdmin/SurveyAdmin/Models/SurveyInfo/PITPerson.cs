using System.ComponentModel.DataAnnotations;

namespace SurveyAdmin.Models.SurveyInfo
{
    public class PITPerson
    {
        public int PITPersonId { get; set; }
        public int PITHouseholdId { get; set; }
        [MaxLength(20)]
        public string Initial { get; set; }
        /// <summary>
        /// For household more than one
        /// </summary>
        [MaxLength(20)]
        public string Related2You { get; set; }
        [MaxLength(20)]
        public string StayTogether { get; set; }
        public int Location { get; set; }
        public int? Age { get; set; }
        [MaxLength(20)]
        public string AgeRange { get; set; }
        [MaxLength(20)]
        public string Sex { get; set; }
        [MaxLength(20)]
        public string Hispanic { get; set; }
        [MaxLength(100)]
        public string Race { get; set; }
        [MaxLength(10)]
        public string FirstTimeHomeless { get; set; }
        [MaxLength(50)]
        public string LengthHomelessThisTime { get; set; }
        [MaxLength(20)]
        public string TimesHomelessLast3Yrs { get; set; }
        [MaxLength(50)]

        #region Adult questions
        public string LengthHomeless { get; set; }
        /// <summary>
        /// Question 14.a
        /// </summary>
        [MaxLength(10)]
        public string HealthProblems { get; set; }
        /// <summary>
        /// Question 14.b
        /// </summary>
        [MaxLength(10)]
        public string PTSD { get; set; }
        /// <summary>
        /// Question 14.c
        /// </summary>
        [MaxLength(10)]
        public string Psychiatric { get; set; }
        /// <summary>
        /// Question 14.d
        /// </summary>
        [MaxLength(10)]
        public string Disability { get; set; }
        /// <summary>
        /// Question 14.e
        /// </summary>
        [MaxLength(10)]
        public string AIDS { get; set; }
        /// <summary>
        /// Question 14.f
        /// </summary>
        [MaxLength(10)]
        public string ReceivedEduOrServices { get; set; }
        /// <summary>
        /// Question 14.g
        /// </summary>
        [MaxLength(10)]
        public string TraumaticInjury { get; set; }
        /// <summary>
        /// Question 14.h
        /// </summary>
        [MaxLength(10)]
        public string Drugs { get; set; }
        /// <summary>
        /// Question 14.i
        /// </summary>
        [MaxLength(10)]
        public string AlcoholAbuse { get; set; }
        /// <summary>
        /// Question 14.j conditional to i
        /// </summary>
        [MaxLength(10)]
        public string ProblemsKeepFromJob { get; set; }
        /// <summary>
        /// Question 15
        /// </summary>
        [MaxLength(10)]
        public string DisabilityBenefits { get; set; }
        /// <summary>
        /// Question 16
        /// </summary>
        [MaxLength(10)]
        public string Abused { get; set; }
        /// <summary>
        /// Question 17
        /// </summary>
        [MaxLength(10)]
        public string USArmedForces { get; set; }
        /// <summary>
        /// Question 18 - conditional to 17
        /// </summary>
        [MaxLength(10)]
        public string ActiveDuty { get; set; }
        /// <summary>
        /// Question 19
        /// </summary>
        [MaxLength(10)]
        public string ReceivedVeteranBenefits { get; set; }
        #endregion //Adult

    }
}