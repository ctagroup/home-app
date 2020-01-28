const configModes = {
  MANUAL: 0,
  AUTO: 1,
  HYBRID: 2,
};

const defaultConfig = {
  title: 'mosbe-CARS',
  mode: configModes.MANUAL,
  enableNotes: true,
  inheritance: 2, // substep levels
  version: '1.0',
  steps: [
    {
      id: 1,
      title: 'Referral Offer in progress',
      notes: true, // allow notes, true by default
      skip: true, // allow skip, false by default
      steps: [
      //   // TODO: remove after testing:
      //   {
      //     id: '2a',
      //     title: 'Client Contacted',
      //     notes: true,
      //     skip: true,
      //   },
      //   {
      //     id: '2b',
      //     title: 'Offer sent',
      //     notes: true,
      //     skip: true,
      //   },
      ], // [] by default
    },
    {
      id: 2,
      title: 'Client Referral Decision',
      options: ['Accepted', 'Denied'],
      notes: true,
      skip: false,
      steps: [],
    },
    {
      id: 3,
      title: 'Sent to Agency',
      dataSource: 'Projects',
      notes: true,
      skip: false,
      steps: [],
    },
    {
      id: 4,
      title: 'Referral Received by Agency',
      notes: true,
      skip: false,
      steps: [],
    },
    {
      id: 5,
      title: 'Referral Results',
      options: [
        'Accepted Into Program or Housed',
        'Denied from program',
        'Client Declined Program',
      ],
      notes: true,
      skip: false,
      end: true,
      lastStep: true,
      steps: [],
      files: {
        checklistForm: {
          label: 'Checklist Form',
        },
        accteptanceDenialForm: {
          label: 'Acceptance/Denial Form',
        },
      },
    },
  ],
};


export default defaultConfig;
