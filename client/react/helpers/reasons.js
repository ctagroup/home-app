export default reasons = [
    { required: true, text: 'Housed by CARS (include agency/program)' },
    { required: false, text: 'Housed externally' },
    { required: false, text: 'Unreachable' },
    { required: false, text: 'Insufficient contact information' },
    { required: false, text: 'Client maxed out referral offers' },
    { required: false, text: 'Client no longer interested in services' },
    { required: true, text: 'Other (specify)' },
  ].map(({ text, required }) => ({
    id: text.replace(/\s+/g, '_').toLowerCase(),
    text,
    required,
  }));
