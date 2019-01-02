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
        sectionId: 'section1',
      },
      {
        title: 'Q03 Detail',
        type: 'question',
        questionId: 'question3',
        sectionId: 'section2',
      },
      {
        title: 'Q05 Detail',
        type: 'question',
        questionId: 'question5',
        sectionId: 'section3',
      },
      {
        title: 'If Other, please specify(4109)',
        type: 'question',
        questionId: 'question5',
        sectionId: 'section3',
      },
    ];
  },
  getSurveyDefinitionWithRealQuestionIds() {
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
        questionId: '73163b83-f0c5-4817-bd00-75b013a441bd', // nickname
        sectionId: '52986609-a1f0-4ed2-a499-d6d9fa724270',
      },
      {
        title: 'Q03 Detail',
        type: 'question',
        questionId: 'b3f5cc10-5d6e-4d96-83d5-a7e99d165102', // lasstname
        sectionId: '52986609-a1f0-4ed2-a499-d6d9fa724270',
      },
      {
        title: 'Q05 Detail',
        type: 'question',
        questionId: 'ca9f7127-760b-4ddb-a519-29a68147d9bc', // age
        sectionId: '52986609-a1f0-4ed2-a499-d6d9fa724270',
      },
      {
        title: 'If Other, please specify(4109)',
        type: 'question',
        questionId: 'ca9f7127-760b-4ddb-a519-29a68147d9bc', // age
        sectionId: '52986609-a1f0-4ed2-a499-d6d9fa724270',
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
