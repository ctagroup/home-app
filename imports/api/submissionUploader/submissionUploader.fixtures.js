const fixtures = {
  getSurvey1Definition() {
    return [
      {
        title: 'Recordset ID (4093-recordset_id)',
        type: 'rowId',
      },
      {
        title: 'Client Detail',
        type: 'clientSourceSystemId',
      },
      { type: 'startDate' },
      { type: 'endDate' },
      {
        title: 'Q01 Detail Clarity',
        type: 'question',
        questionId: 'question1',
      },
      {
        title: 'Q03 Detail',
        type: 'question',
        questionId: 'question3',
      },
      {
        title: 'Q05 Detail',
        type: 'question',
        questionId: 'question5',
      },
      {
        title: 'If Other, please specify(4109)',
        type: 'question',
        questionId: 'question5',
      },
    ];
  },
  getSurvey1Row() {
    return [
      1795971,
      281052,
      '5/5/2016',
      '',
      '1 Child',
      'No',
      'Other',
      'Friends',
    ];
  },
};

export default fixtures;
