import { Mongo } from 'meteor/mongo';


const Enrollments = new Mongo.Collection('enrollments');

SimpleSchema.debug = true;

const enrollmentReference = {
  // Reference to mark when fields should be editable:
  // s -- start/entry
  // u -- update
  // q -- quit/exit/end
  name: {
    type: String,
    collected: ['s'],
  },
  ssn: {
    type: String,
    label: 'Social Security Number',
    collected: ['s'],
  },
  dob: {
    type: Date,
    label: 'Date of birth',
    collected: ['s'],
  },
  race: {
    type: String,
    collected: ['s'],
  },
  ethnicity: {
    type: String,
    collected: ['s'],
  },
  gender: {
    type: String,
    collected: ['s'],
  },
  veteran: {
    type: String,
    label: 'Veteran status',
    collected: ['s'],
  },
  disablingCondition: {
    type: String,
    collected: ['s'],
  },
  projectStartDate: {
    type: Date,
    collected: ['s'],
  },
  projectExitDate: {
    type: Date,
    collected: ['q'],
  },
  destination: {
    type: String,
    collected: ['q'],
  },
  relationshipToHeadOfHousehold: {
    type: String,
    collected: ['s'],
  },
  clientLocation: {
    type: String,
    collected: ['s', 'u'],
  },
  housingMoveInDate: {
    type: Date,
    label: 'Housing Move-In Date',
    collected: ['u'],
  },
  livingSituation: {
    type: String,
    collected: ['u'],
  },
  incomeAndSources: {
    type: String,
    collected: ['u', 'q'],
  },
  nonCashBenefits: {
    type: String,
    label: 'Non-Cash Benefits',
    collected: ['u', 'q'],
  },
  healthInsurance: {
    type: String,
    collected: ['u', 'q'],
  },
  physicalDisability: {
    type: String,
    collected: ['u', 'q'],
  },
  developmentalDisability: {
    type: String,
    collected: ['u', 'q'],
  },
  chronicHealthCondition: {
    type: String,
    collected: ['u', 'q'],
  },
  hivAids: {
    type: String,
    label: 'HIV/AIDS',
    collected: ['u', 'q'],
  },
  mentalHealthProblem: {
    type: String,
    collected: ['u', 'q'],
  },
  substanceAbuse: {
    type: String,
    collected: ['u', 'q'],
  },
  domesticViolence: {
    type: String,
    collected: ['u'],
  },
  contact: {
    type: String,
    collected: ['u'],
  },
  dateOfEngagement: {
    type: Date,
    collected: ['u'],
  },
  bedNightDate: {
    type: Date,
    label: 'Bed-Night Date',
    collected: ['u'],
  },
  housingAssessmentDisposition: {
    type: String,
    collected: ['q'],
  },
  servicesProvidedHOPWA: {
    type: String,
    label: 'Services Provided HOPWA',
    collected: ['u'],
  },
  financialAssistanceHOPWA: {
    type: String,
    label: 'Financial Assistance HOPWA',
    collected: ['u'],
  },
  medicalAssistance: {
    type: String,
    collected: ['s', 'u', 'q'],
  },
  tCellandViralLoad: {
    type: String,
    label: 'T-cell(CD4) and Viral Load',
    collected: ['s', 'u', 'q'],
  },
  housingAssessmentAtExit: {
    type: String,
    collected: ['q'],
  },
  servicesProvidedPATHFunded: {
    type: String,
    label: 'Services Provided - PATH Funded',
    collected: ['u'],
  },
  referralsProvidedPATH: {
    type: String,
    label: 'Referrals Provided - PATH',
    collected: ['u'],
  },
  PATHStatus: {
    type: String,
    label: 'PATH Status',
    collected: ['u'],
  },
  connectionWithSOAR: {
    type: String,
    label: 'Connection with SOAR',
    collected: ['s', 'u', 'q'],
  },
  referralSource: {
    type: String,
    collected: ['s'],
  },
  RHYBCPStatus: {
    type: String,
    label: 'RHY-BCP Status',
    collected: ['s', 'u'],
  },
  sexualOrientation: {
    type: String,
    collected: ['s'],
  },
  lastGradeCompleted: {
    type: String,
    collected: ['s', 'q'],
  },
  schoolStatus: {
    type: String,
    collected: ['s', 'q'],
  },
  employmentStatus: {
    type: String,
    collected: ['s', 'q'],
  },
  generalHealthStatus: {
    type: String,
    collected: ['s', 'q'],
  },
  dentalHealthStatus: {
    type: String,
    collected: ['s', 'q'],
  },
  mentalHealthStatus: {
    type: String,
    collected: ['s', 'q'],
  },
  pregnancyStatus: {
    type: String,
    collected: ['s', 'u'],
  },
  formerlyAWardOfChildWelfareOrFosterCareAgency: {
    type: String,
    label: 'Formerly a Ward of Child Welfare or Foster Care Agency',
    collected: ['s'],
  },
  formerlyAWardOfJuvenileJusticeSystem: {
    type: String,
    label: 'Formerly a Ward of Juvenile Justice System',
    collected: ['s'],
  },
  familyIssues: {
    type: String,
    collected: ['s'],
  },
  RHYServiceConnections: {
    type: String,
    label: 'RHY Service Connections',
    collected: ['u'],
  },
  commercialSexualExploitation: {
    type: String,
    collected: ['q'],
  },
  laborExploitation: {
    type: String,
    collected: ['q'],
  },
  projectCompletionStatus: {
    type: String,
    collected: ['q'],
  },
  counseling: {
    type: String,
    collected: ['q'],
  },
  safeAndAppropriateExit: {
    type: String,
    label: 'Safe and Appropriate Exit',
    collected: ['q'],
  },
  aftercarePlans: {
    type: String,
    collected: ['q'],
  },
  worstHousingSituation: {
    type: String,
    collected: ['s'],
  },
  veteranInformation: {
    type: String,
    label: "Veteran's Information",
    collected: ['q'],
  },
  servicesProvidedSSVF: {
    type: String,
    label: 'Services Provided - SSVF',
    collected: ['u'],
  },
  financialAssistanceSSVF: {
    type: String,
    label: 'Financial Assistance - SSVF',
    collected: ['u'],
  },
  SSVFEligibility: { // percentOfAMI
    type: String,
    label: 'Percent of AMI (SSVF Eligibility)',
    collected: ['s'],
  },
  lastPermanentAddess: {
    type: String,
    collected: ['s'],
  },
  VAMCStationNumber: {
    type: String,
    label: 'VAMC Station Number',
    collected: ['s'],
  },
  SSVFHPTargetingCriteria: {
    type: String,
    label: 'SSVF HP Targeting Criteria',
    collected: ['s'],
  },
  HUDVASHVoucherTracking: {
    type: String,
    label: 'HUD-VASH Voucher Tracking',
    collected: ['s', 'u', 'q'],
  },
  HUDVASHExitInformation: {
    type: String,
    label: 'HUD-VASH Exit Information',
    collected: ['q'],
  },
};

const pick = (object, func) => Object.entries(object)
  .filter(([key, value]) => func(value, key))
  .reduce((obj, [key, val]) => Object.assign(obj, { [key]: val }), {});

const oMap = (o, f) => Object.assign({}, ...Object.keys(o).map(k => ({ [k]: f(o[k]) })));

const formSchema = (obj) => oMap(obj, ({ type, label }) => (label ? { type, label } : { type }));
const collectedAt = (stepName) =>
  formSchema(pick(enrollmentReference, value => value.collected.indexOf(stepName) > -1));

Enrollments.schema = new SimpleSchema(formSchema(enrollmentReference));
Enrollments.startSchema = new SimpleSchema(collectedAt('s'));
Enrollments.updateSchema = new SimpleSchema(collectedAt('u'));
Enrollments.quitSchema = new SimpleSchema(collectedAt('q'));

export const a = {
  title: {
    type: String,
  },
  locked: {
    type: Boolean,
    label: 'Locked',
  },
  definition: {
    type: String,
    autoform: {
      rows: 20,
    },
    custom() {
      try {
        JSON.parse(this.value);
      } catch (e) {
        return 'invalidJson';
      }
      return null;
    },
  },
  version: {
    type: Number,
    optional: true,
    autoValue() {
      return 2;
    },
  },
  hmis: {
    type: Object,
    label: 'HMIS data',
    optional: true,
    blackbox: true,
  },
  createdAt: {
    type: Date,
    label: 'Created At',
    optional: true,
    autoValue() {
      let val;
      if (this.isInsert) {
        val = new Date();
      } else if (this.isUpsert) {
        val = { $setOnInsert: new Date() };
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
      return val;
    },
  },
  updatedAt: {
    type: Date,
    label: 'Updated At',
    optional: true,
    autoValue() {
      let val;
      if (this.isUpdate) {
        val = new Date();
      }
      return val;
    },
  },
};
// );

Enrollments.schema.messages({
  invalidJson: 'Invalid JSON',
});

Enrollments.attachSchema(Enrollments.schema);

export default Enrollments;
