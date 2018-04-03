import './projectFields.html';

export function formSchema() {
  const definition = {
    projectName: {
      type: String,
    },
    projectCommonName: {
      type: String,
      optional: true,
    },
    continuumProject: {
      type: Number,
      defaultValue: 0,
      autoform: {
        type: 'select',
        options: [{ value: 0, label: 'No' }, { value: 1, label: 'Yes' }],
      },
    },
    projectType: {
      type: Number,
      defaultValue: 7,
      autoform: {
        type: 'select',
        options: [
          { value: 1, label: 'Emergency Shelter' },
          { value: 2, label: 'Transitional Housing' },
          { value: 3, label: 'PH - Permanent Supportive Housing (disability required for  entry)' },
          { value: 4, label: 'Street Outreach' },
          { value: 5, label: 'RETIRED' },
          { value: 6, label: 'Services Only' },
          { value: 7, label: 'Other' },
          { value: 8, label: 'Safe Haven' },
          { value: 9, label: 'PH - Housing Only' },
          { value: 10, label: 'PH – Housing with Services (no disability required for entry)' },
          { value: 11, label: 'Day Shelter' },
          { value: 12, label: 'Homelessness Prevention' },
          { value: 13, label: 'PH - Rapid Re-Housing' },
          { value: 14, label: 'Coordinated Assessment' },
        ],
      },
    },
    targetPopulation: {
      type: Number,
      defaultValue: 4,
      autoform: {
        type: 'select',
        options: [
          { value: 1, label: 'DV: Domestic violence victims' },
          { value: 3, label: 'HIV: Persons with HIV/AIDS' },
          { value: 4, label: 'NA: Not applicable' },
        ],
      },


    },
    trackingMethod: {
      type: Number,
      defaultValue: 0,
      autoform: {
        type: 'select',
        options: [
          { value: 0, label: 'Entry/Exit Date (e/e)' },
          { value: 3, label: 'Night-by-Night (nbn)' },
        ],
      },
    },
    projectGroup: {
      type: String,
    },
  };
  return new SimpleSchema(definition);
}

