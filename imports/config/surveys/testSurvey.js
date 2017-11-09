const testSurvey = {
  title: 'Test Survey',
  id: 'dummy',
  variables: {
    'score.A': 0,
    'score.B': 0,
    'score.grandtotal': 0,
  },
  items: [
    {
      id: 'question1',
      hmisId: '007f9b45-b990-4717-9c8f-83e37588c941',
      title: 'Enter first number',
      type: 'question',
      category: 'number',
    },
    {
      id: 'question2',
      hmisId: 'd5a93c67-b826-43d1-ac90-031ecfc8b5dd',
      title: 'Enter second number',
      type: 'question',
      category: 'number',
    },
    {
      id: 'summary',
      type: 'text',
      title: 'Scoring Summary',
      text: [
        'First score: {{variables.score.A}}',
        'Second score: {{variables.score.B}}',
        '<strong>GRAND TOTAL: {{variables.score.grandtotal}}</strong>',
      ].join('<br />'),
      rules: [
        {
          always: [
            ['set', 'score.A', 'values.question1'],
            ['set', 'score.B', 'values.question2'],
            ['sum', 'score.grandtotal', 'variables.score.A', 'variables.score.B'],
          ],
        },
      ],
    },
  ],
};

export default testSurvey;
