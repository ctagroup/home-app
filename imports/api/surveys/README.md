{
	"title": "Example survey",
	"id": "survey1",
	"sections": [
    {
			"id": "section1",
			"title": "Administration",
			"questions": [{
					"id": "question1",
					"title": "Survey Location",
					"type": "text",
					"required": true
				},
				{
					"id": "question2",
					"title": "Survey Time",
					"type": "text"
				}
			]
		},
		{
			"id": "section2",
			"title": "Opening Script",
			"description": "My name is (your name) and I work for a group called (your agency)....",
			"questions": []
		},
		{
			"id": "section3",
			"title": "Basic Information",
			"questions": [
        {
					"id": "question3",
					"title": "Date of Birth",
					"type": "date",
					"meta": "dob"
				},
				{
					"id": "question4",
					"title": "Date of Birth",
					"type": "text",
					"meta": "age"
				},
				{
					"id": "question5",
					"type": "choice",
					"title": "Has the client given consent to participate?",
					"options": ["Yes", "No"],
					"other": "Others(specify)"
				},
				{
					"type": "group",
					"title": " Has your family ever had trouble (...) because of:",
					"description": "some description",
					"questions": [
            {
							"id": "question6",
							"title": "A mental health issue or concern",
							"type": "select",
							"options": ["Yes", "No", { "value": "", "text": "Refused" }]
						},
						{
							"id": "question7",
							"title": "A past head injury?",
							"type": "select",
							"options": ["Yes", "No", "Refused"]
						}
					]
				}
			]
		},
		{
			"title": "Basic Information - Parent 2",
			"skip": "Skip If second parent currently not part of the household",
			"questions": [{
					"id": "question8",
					"title": "Are you pregnant?",
					"visibility": [
            {
							"client": "gender",
							"any": [{	"==": "female" }],
							"then": "show"
						},
						{
							"otherwise": "hide"
						}
					]
				},
				{
					"id": "question9",
					"title": "Answer this question only if you are 10 or younger or over 70 #1",
					"visibility": [
            {
							"client": "age",
							"any": [{ "<=": 10 }, {	">": 70 }],
							"then": "show"
						},
						{
							"otherwise": "hide"
						}
					]
				},
				{
					"id": "question10",
					"title": "Answer this question only if you are 10 or younger or over 70 #2",
					"visibility": [
            {
							"client": "age",
							"all": [{ ">": "10"	}, { "<=": "70"	}],
							"then": "hide"
						},
						{
							"otherwise": "show"
						}
					]
				},
				{
					"id": "question11",
					"title": "Answer this question only you selected A or B in question 6",
					"visibility": [{
							"question": "question6",
							"any": [{	"==": "A"	}, { "==": "B" }],
							"then": "show"
						},
						{
							"otherwise": "hide"
						}
					]
				},
				{
					"id": "question12",
					"title": "Answer this question only you answered Yes to both question1 and question2",
					"visibility": [{
							"question": "question1",
							"any": [{	"!=": "Yes"	}],
              "then": "hide"
						},
						{
							"question": "question2",
							"any": [{	"!=": "Yes"	}],
							"then": "hide"
						},
						{
							"otherwise": "show"
						}
					]
				},
				{
					"id": "question13",
					"title": "Answer this question only you answered Yes to question1 or question2",
					"visibility": [{
							"question": "question1",
							"any": [{ "==": "Yes"	}],
							"then": "show"
						},
						{
							"question": "question2",
							"any": [{	"==": "Yes"	}],
							"then": "show"
						},
						{
							"otherwise": "hide"
						}
					]
				}
			]
		}
	]
}



RESPOSE

{
  'surveyId': 'survey1',
  'questions': [
    {
      'id': 'question1',
      'value': 'yes'
    },
    {
      'id': 'question1',
      'value': 'yes'
    },
    {
      'id': 'question1',
      'values': ['foo', 'bar', 'baz']
    },
  ]
}
