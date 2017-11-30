const viSpdatSingle = {
  title: 'VI-SPDAT Single 2.0.1',
  id: 'viSpdatSingle2.0.1',
  variables: {
    score1: 0,
    scoreA1: 0,
    scoreA2: 0,
    scoreB1: 0,
    scoreB2: 0,
    scoreB3: 0,
    scoreB4: 0,
    scoreC1: 0,
    scoreC2: 0,
    scoreC3: 0,
    scoreC4: 0,
    scoreD1: 0,
    scoreD2: 0,
    scoreD3: 0,
    scoreD4: 0,
    scoreD5: 0,
    scoreD6: 0,
    'score.presurvey': 0,
    'score.history': 0,
    'score.risks': 0,
    'score.socialization': 0,
    'score.wellness': 0,
    'score.grandtotal': 0,
  },
  items: [
    {
      id: 'openingScript',
      type: 'text',
      title: 'Opening Script',
      text: `
          <p>Every assessor in your community regardless of organization completing the
          VI-SPDAT should use the same introductory script.
          In that script you should highlight the following information:</p>
          <ul>
            <li>the name of the assessor and their affiliation
              (organization that employs them, volunteer as part of
              a Point in Time Count, etc.)</li>
            <li>the purpose of the VI-SPDAT being completed</li>
            <li>that it usually takes less than 7 minutes to complete</li>
            <li>that only “Yes,” “No,” or one-word answers are being sought</li>
            <li>that any question can be skipped or refused</li>
            <li>where the information is going to be stored</li>
            <li>that if the participant does not understand a question that clarification
            can be provided</li>
            <li>the importance of relaying accurate information to the assessor and not feeling
             that there is a correct or preferred answer that they need to provide, nor
             information they need to conceal</li>
          </ul>
      `,
    },
    {
      id: 'section1',
      type: 'section',
      title: 'Basic Information',
      items: [
        {
          id: 'client.firstName',
          type: 'text',
          title: 'First Name',
          text: '<div class="readonly">{{client.firstName}}</div>',
        },
        {
          id: 'client.nickName',
          type: 'question',
          category: 'text',
          title: 'Nickname',
        },
        {
          id: 'client.lastName',
          type: 'text',
          title: 'Last Name',
          text: '<div class="readonly">{{client.lastName}}</div>',
        },
        {
          id: 'client.language',
          type: 'question',
          hmisId: '178a96d0-dc61-4a1c-9537-139156c4f99f',
          category: 'text',
          title: 'In what language do you feel best able to express yourself',
        },
        {
          id: 'client.dob',
          type: 'text',
          title: 'Date of Birth',
          text: '<div class="readonly">{{client.dob:date}}</div>',
        },
        {
          id: 'client.age',
          type: 'text',
          title: 'Age',
          text: '<div class="readonly">{{client.dob:age}}</div>',
        },
        {
          id: 'client.ssn',
          type: 'text',
          title: 'SSN',
          text: '<div class="readonly">{{client.ssn}}</div>',
        },
        {
          id: 'client.consent',
          type: 'question',
          category: 'choice',
          title: 'Consent to participate',
          options: ['Yes', 'No'],
        },
      ],
    },
    {
      id: 'section1.score',
      type: 'score',
      score: 'variables.score1',
      text: 'IF THE PERSON IS 60 YEARS OF AGE OR OLDER, THEN SCORE 1.',
      rules: [
        {
          // score - 1st
          any: [
            ['>=', 'values.client.age', 60],
          ],
          then: [['set', 'score1', 1]],
        },
      ],
    },

    {
      id: 'sectionA',
      type: 'section',
      title: 'A. History of Housing and Homelessness',
      items: [
        {
          id: 'question1',
          type: 'question',
          hmisId: 'bb5300c1-5b5b-464e-a20c-1d6c4ea7dff9',
          title: '1. Where do you sleep most frequently?',
          category: 'choice',
          options: ['Shelters', 'Transitional Housing', 'Safe Haven', 'Outdoors'],
          other: true,
          refusable: true,
        },
        {
          id: 'scoreA1',
          type: 'score',
          score: 'variables.scoreA1',
          text: `IF THE PERSON ANSWERS ANYTHING OTHER THAN “SHELTER”, “TRANSITIONAL HOUSING”,
            OR “SAFE HAVEN”, THEN SCORE 1.`,
          rules: [
            {
              all: [
                ['isset', 'values.question1'],
                ['!=', 'values.question1', 'Refused'],
                ['!=', 'values.question1', 'Shelters'],
                ['!=', 'values.question1', 'Transitional Housing'],
                ['!=', 'values.question1', 'Safe Haven'],
              ],
              then: [['set', 'scoreA1', 1]],
            },
          ],
        },
        {
          id: 'question2',
          type: 'question',
          hmisId: 'cb8f03ca-6481-4c54-b91d-517f887938b6',
          title: '2. How long has it been since you lived in permanent stable housing?',
          text: 'in years',
          category: 'number',
          refusable: true,
        },
        {
          id: 'question3',
          type: 'question',
          hmisId: 'eda30beb-2290-4414-97e9-e0c38487388d',
          title: '3. In the last three years, how many times have you been homeless?',
          category: 'number',
          refusable: true,
        },
        {
          id: 'scoreA2',
          type: 'score',
          score: 'variables.scoreA2',
          text: `IF THE PERSON HAS EXPERIENCED 1 OR MORE CONSECUTIVE YEARS OF HOMELESSNESS,
            AND/OR 4+ EPISODES OF HOMELESSNESS, THEN SCORE 1`,
          rules: [
            {
              any: [
                ['>=', 'values.question2', 1],
                ['>=', 'values.question3', 4],
              ],
              then: [['set', 'scoreA2', 1]],
            },
          ],
        },
      ],
    },
    {
      id: 'sectionB',
      type: 'section',
      title: 'B. Risks',
      items: [
        {
          id: 'question4',
          type: 'section',
          title: '4.In the past six months, how many times have you...',
          items: [
            {
              id: 'question4a',
              type: 'question',
              hmisId: 'dd52746f-8dcb-4536-80df-07823e083646',
              title: 'a) Received health care at an emergency department/room?',
              category: 'choice',
              options: ['Yes', 'No'],
              refusable: true,
            },
            {
              id: 'question4b',
              type: 'question',
              hmisId: '67b96338-d1f1-4de9-8a40-43c0ffab8ed8',
              title: 'b) Taken an ambulance to the hospital?',
              category: 'choice',
              options: ['Yes', 'No'],
              refusable: true,
            },
            {
              id: 'question4c',
              type: 'question',
              hmisId: '4062595b-9d70-4d12-86d2-275cbb838419',
              title: 'c) Been hospitalized as an inpatient?',
              category: 'choice',
              options: ['Yes', 'No'],
              refusable: true,
            },
            {
              id: 'question4d',
              type: 'question',
              hmisId: 'e2968741-ba6f-4dc7-be50-98aabca335b4',
              title: `d) Used a crisis service, including sexual assault crisis, mental health
                crisis, family/intimate violence, distress centers and suicide prevention
                hotlines?`,
              category: 'choice',
              options: ['Yes', 'No'],
              refusable: true,
            },
            {
              id: 'question4e',
              type: 'question',
              hmisId: '355a2d95-9063-4ad0-ada1-b73a5503e278',
              title: `e) Talked to police because you witnessed a crime, were the victim of a crime,
                or the alleged perpetrator of a crime or because the police told you that you
                must move along?`,
              category: 'choice',
              options: ['Yes', 'No'],
              refusable: true,
            },
            {
              id: 'question4f',
              type: 'question',
              hmisId: '89dbcb50-c511-42a9-9838-21afaba7126d',
              title: `f) Stayed one or more nights in a holding cell, jail or prison, whether that
                was a short-term stay like the drunk tank, a longer stay for a more serious
                offence, or anything in between?`,
              category: 'choice',
              options: ['Yes', 'No'],
              refusable: true,
            },
            {
              id: 'scoreB1',
              type: 'score',
              score: 'variables.scoreB1',
              text: `IF THE TOTAL NUMBER OF INTERACTIONS EQUALS 4 OR MORE, THEN SCORE 1 FOR
                EMERGENCY SERVICE USE.`,
              rules: [
                {
                  always: [['set', 'interactions', 0]],
                },
                {
                  any: [['==', 'values.question4a', 'Yes']],
                  then: [['add', 'interactions', 1]],
                },
                {
                  any: [['==', 'values.question4b', 'Yes']],
                  then: [['add', 'interactions', 1]],
                },
                {
                  any: [['==', 'values.question4c', 'Yes']],
                  then: [['add', 'interactions', 1]],
                },
                {
                  any: [['==', 'values.question4d', 'Yes']],
                  then: [['add', 'interactions', 1]],
                },
                {
                  any: [['==', 'values.question4e', 'Yes']],
                  then: [['add', 'interactions', 1]],
                },
                {
                  any: [['==', 'values.question4f', 'Yes']],
                  then: [['add', 'interactions', 1]],
                },
                {
                  any: [['>=', 'variables.interactions', 4]],
                  then: [['set', 'scoreB1', 1]],
                },
              ],

            },
            {
              id: 'question5',
              type: 'question',
              hmisId: '4467ba3e-644e-4d6e-a14e-ec126b2b5a3b',
              title: '5. Have you been attacked or beaten up since you’ve become homeless?',
              category: 'choice',
              options: ['Yes', 'No'],
              refusable: true,
            },
            {
              id: 'question6',
              type: 'question',
              hmisId: 'b5f84918-a748-4e87-9202-b658a5af3492',
              title: `6. Have you threatened to or tried to harm yourself or anyone else in
                the last year?`,
              category: 'choice',
              options: ['Yes', 'No'],
              refusable: true,
            },
            {
              id: 'scoreB2',
              type: 'score',
              score: 'variables.scoreB2',
              text: 'IF “YES” TO ANY OF THE ABOVE, THEN SCORE 1 FOR RISK OF HARM.',
              rules: [
                {
                  any: [
                    ['==', 'values.question5', 'Yes'],
                    ['==', 'values.question6', 'Yes'],
                  ],
                  then: [['set', 'scoreB2', 1]],
                },
              ],
            },
            {
              id: 'question7',
              type: 'question',
              hmisId: '967d3a72-2642-4e22-84ba-4ab9848c4805',
              title: `7. Do you have any legal stuff going on right now that may result in
                you being locked up, having to pay fines, or that make it more difficult
                to rent a place to live?`,
              category: 'choice',
              options: ['Yes', 'No'],
              refusable: true,
            },
            {
              id: 'scoreB3',
              type: 'score',
              score: 'variables.scoreB3',
              text: 'IF “YES,” THEN SCORE 1 FOR LEGAL ISSUES.',
              rules: [
                {
                  any: [
                    ['==', 'values.question7', 'Yes'],
                  ],
                  then: [['set', 'scoreB3', 1]],
                },
              ],
            },
            {
              id: 'question8',
              type: 'question',
              hmisId: '2beb9a78-7a12-4453-b16a-318989387713',
              title: '8. Does anybody force or trick you to do things that you do not want to do?',
              category: 'choice',
              options: ['Yes', 'No'],
              refusable: true,
            },
            {
              id: 'question9',
              type: 'question',
              hmisId: 'f7eb072e-af20-451b-b7a8-945c59850f63',
              title: `9. Do you ever do things that may be considered to be risky like exchange sex
                for money, run drugs for someone, have unprotected sex with someone you don’t know,
                share a needle, or anything like that?`,
              category: 'choice',
              options: ['Yes', 'No'],
              refusable: true,
            },
            {
              id: 'scoreB4',
              type: 'score',
              score: 'variables.scoreB4',
              text: 'IF “YES” TO ANY OF THE ABOVE, THEN SCORE 1 FOR RISK OF EXPLOITATION.',
              rules: [
                {
                  any: [
                    ['==', 'values.question8', 'Yes'],
                    ['==', 'values.question9', 'Yes'],
                  ],
                  then: [['set', 'scoreB4', 1]],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'sectionC',
      type: 'section',
      title: 'C. Socialization & Daily Functioning',
      items: [
        {
          id: 'question10',
          type: 'question',
          hmisId: '35e58f3f-4852-418f-a622-7ba210909ac2',
          title: `10. Is there any person, past landlord, business, bookie, dealer, or government
            group like the IRS that thinks you owe them money?`,
          category: 'choice',
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'question11',
          type: 'question',
          hmisId: 'c221873f-cf22-4370-8a9e-cddb6a493af5',
          title: `11. Do you get any money from the government, a pension, an inheritance, working
            under the table, a regular job, or anything like that?`,
          category: 'choice',
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'scoreC1',
          type: 'score',
          score: 'variables.scoreC1',
          text: `IF “YES” TO QUESTION 10 OR “NO” TO QUESTION 11, THEN SCORE 1 FOR MONEY
            MANAGEMENT.`,
          rules: [
            {
              any: [
                ['==', 'values.question10', 'Yes'],
                ['==', 'values.question11', 'No'],
              ],
              then: [['set', 'scoreC1', 1]],
            },
          ],
        },
        {
          id: 'question12',
          type: 'question',
          hmisId: '04f67afd-a94a-494a-a71d-c900daadb732',
          title: `12. Do you have planned activities, other than just surviving, that make you feel
            happy and fulfilled?`,
          category: 'choice',
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'scoreC2',
          type: 'score',
          score: 'variables.scoreC2',
          text: 'IF “NO,” THEN SCORE 1 FOR MEANINGFUL DAILY ACTIVITY.',
          rules: [
            {
              any: [
                ['==', 'values.question12', 'No'],
              ],
              then: [['set', 'scoreC2', 1]],
            },
          ],
        },
        {
          id: 'question13',
          type: 'question',
          hmisId: 'a009b736-c133-4078-8738-b6f5700a5b2f',
          title: `13. Are you currently able to take care of basic needs like bathing, changing
            clothes, using a restroom, getting food and clean water and other things like that?`,
          category: 'choice',
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'scoreC3',
          type: 'score',
          score: 'variables.scoreC3',
          text: 'IF “NO,” THEN SCORE 1 FOR SELF-CARE.',
          rules: [
            {
              any: [
                ['==', 'values.question13', 'No'],
              ],
              then: [['set', 'scoreC3', 1]],
            },
          ],
        },
        {
          id: 'question14',
          type: 'question',
          hmisId: '7fa838bd-1a39-48f4-ab95-0cb4ac3377dd',
          title: `14. Is your current homelessness in any way caused by a relationship that broke
            down, an unhealthy or abusive relationship, or because family or friends caused you
            to become evicted?`,
          category: 'choice',
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'scoreC4',
          type: 'score',
          score: 'variables.scoreC4',
          text: 'IF “YES,” THEN SCORE 1 FOR SOCIAL RELATIONSHIPS.',
          rules: [
            {
              any: [
                ['==', 'values.question14', 'Yes'],
              ],
              then: [['set', 'scoreC4', 1]],
            },
          ],
        },
      ],
    },
    {
      id: 'sectionD',
      type: 'section',
      title: 'D. Wellness',
      items: [
        {
          id: 'question15',
          type: 'question',
          hmisId: 'aa1282df-4581-452b-aa06-a4711ae96e6f',
          title: `15. Have you ever had to leave an apartment, shelter program, or other place
            you were staying because of your physical health?`,
          category: 'choice',
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'question16',
          type: 'question',
          hmisId: 'de9997ef-2c53-44db-b120-62f546a6388b',
          title: `16. Do you have any chronic health issues with your liver, kidneys, stomach,
            lungs or heart?`,
          category: 'choice',
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'question17',
          type: 'question',
          hmisId: 'bfc5bd4d-73aa-4e04-9419-79043f8e25ed',
          title: `17. If there was space available in a program that specifically assists people
            that live with HIV or AIDS, would that be of interest to you`,
          category: 'choice',
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'question18',
          type: 'question',
          title: `18. Do you have any physical disabilities that would limit the type of housing
            you could access, or would make it hard to live independently because you’d need help?`,
          category: 'choice',
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'question19',
          type: 'question',
          hmisId: '4bb37f95-c903-4095-a5e9-e616de2d5088',
          title: '19. When you are sick or not feeling well, do you avoid getting help?',
          category: 'choice',
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'question20',
          type: 'question',
          hmisId: '7baa6683-d9a1-4579-8aa4-1a69dc54b3d1',
          title: '20. Are you currently pregnant?',
          text: 'FOR FEMALE RESPONDENTS ONLY',
          category: 'choice',
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'scoreD1',
          type: 'score',
          score: 'variables.scoreD1',
          text: 'IF “YES” TO ANY OF THE ABOVE, THEN SCORE 1 FOR PHYSICAL HEALTH.',
          rules: [
            {
              any: [
                ['==', 'values.question15', 'Yes'],
                ['==', 'values.question16', 'Yes'],
                ['==', 'values.question17', 'Yes'],
                ['==', 'values.question18', 'Yes'],
                ['==', 'values.question19', 'Yes'],
                ['==', 'values.question20', 'Yes'],
              ],
              then: [['set', 'scoreD1', 1]],
            },
          ],
        },
        {
          id: 'question21',
          type: 'question',
          hmisId: 'a9cb33ef-86b3-4038-9f5f-e78233acb0a3',
          title: `21. Has your drinking or drug use led you to being kicked out of an
            apartment or program where you were staying in the past?`,
          category: 'choice',
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'question22',
          type: 'question',
          hmisId: '0a40fb07-6b62-41e2-8eda-b264b19335d6',
          title: `22. Will drinking or drug use make it difficult for you to stay housed or
            afford your housing?`,
          category: 'choice',
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'scoreD2',
          type: 'score',
          score: 'variables.scoreD2',
          text: 'IF “YES” TO ANY OF THE ABOVE, THEN SCORE 1 FOR SUBSTANCE USE.',
          rules: [
            {
              any: [
                ['==', 'values.question21', 'Yes'],
                ['==', 'values.question22', 'Yes'],
              ],
              then: [['set', 'scoreD2', 1]],
            },
          ],
        },
        {
          id: 'question23',
          type: 'section',
          title: `23. Have you ever had trouble maintaining your housing, or been kicked
            out of an apartment, shelter program or other place you were staying, because of:`,
          items: [
            {
              id: 'question23a',
              type: 'question',
              hmisId: '59b9eb5d-4923-4fae-bc66-0eb14bcba186',
              title: 'a) A mental health issue or concern?',
              category: 'choice',
              options: ['Yes', 'No'],
              refusable: true,
            },
            {
              id: 'question23b',
              type: 'question',
              hmisId: 'a51bbe68-4fd5-4e3d-b353-1e329970b557',
              title: 'b) A past head injury?',
              category: 'choice',
              options: ['Yes', 'No'],
              refusable: true,
            },
            {
              id: 'question23c',
              type: 'question',
              hmisId: 'bbb6e063-d9c9-4bd5-b7f6-96801f723e82',
              title: 'c) A learning disability, developmental disability, or other impairment',
              category: 'choice',
              options: ['Yes', 'No'],
              refusable: true,
            },
          ],
        },
        {
          id: 'question24',
          type: 'question',
          hmisId: 'ca9b9ca8-7b77-4eb8-9b4c-5b433d1a70de',
          title: `24. Do you have any mental health or brain issues that would make it hard for
            you to live independently because you’d need help?`,
          category: 'choice',
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'scoreD3',
          type: 'score',
          score: 'variables.scoreD3',
          text: 'IF “YES” TO ANY OF THE ABOVE, THEN SCORE 1 FOR MENTAL HEALTH.',
          rules: [
            {
              any: [
                ['==', 'values.question23a', 'Yes'],
                ['==', 'values.question23b', 'Yes'],
                ['==', 'values.question23c', 'Yes'],
                ['==', 'values.question24', 'Yes'],
              ],
              then: [['set', 'scoreD3', 1]],
            },
          ],
        },
        {
          id: 'scoreD4',
          type: 'score',
          score: 'variables.scoreD4',
          text: `IF THE RESPONENT SCORED 1 FOR PHYSICAL HEALTH AND 1 FOR SUBSTANCE USE AND 1 FOR
            MENTAL HEALTH, SCORE 1 FOR TRI-MORBIDITY.`,
          rules: [
            {
              all: [
                ['==', 'variables.scoreD1', 1],
                ['==', 'variables.scoreD2', 1],
                ['==', 'variables.scoreD3', 1],
              ],
              then: [['set', 'scoreD4', 1]],
            },
          ],
        },
        {
          id: 'question25',
          type: 'question',
          hmisId: 'e1e83973-80bd-45e2-acc3-0c0b17c18222',
          title: `25. Are there any medications that a doctor said you should be taking that, for
            whatever reason, you are not taking?`,
          category: 'choice',
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'question26',
          type: 'question',
          hmisId: '21cf8511-ba6f-44f3-b929-4d2849a7aae2',
          title: `26. Are there any medications like painkillers that you don’t take the way the
            doctor prescribed or where you sell the medication?`,
          category: 'choice',
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'scoreD5',
          type: 'score',
          score: 'variables.scoreD5',
          text: 'IF “YES” TO ANY OF THE ABOVE, SCORE 1 FOR MEDICATIONS.',
          rules: [
            {
              any: [
                ['==', 'values.question25', 'Yes'],
                ['==', 'values.question26', 'Yes'],
              ],
              then: [['set', 'scoreD5', 1]],
            },
          ],
        },
        {
          id: 'question27',
          type: 'question',
          hmisId: 'd154ff3c-50f0-4dd7-885c-86a1c7bd311a',
          title: `27. Has your current period of homelessness been caused by an experience of
            emotional, physical, psychological, sexual, or other type of abuse, or by any
            other trauma you have experienced`,
          text: 'YES or NO',
          category: 'choice',
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'scoreD6',
          type: 'score',
          score: 'variables.scoreD6',
          text: 'IF “YES”, SCORE 1 FOR ABUSE AND TRAUMA.',
          rules: [
            {
              any: [
                ['==', 'values.question27', 'Yes'],
              ],
              then: [['set', 'scoreD6', 1]],
            },
          ],
        },
      ],
    },
    {
      id: 'summary',
      type: 'text',
      title: 'Scoring Summary',
      text: [
        'PRE-SURVEY: {{variables.score.presurvey}}/1',
        'A. HISTORY OF HOUSING & HOMELESSNESS: {{variables.score.history}}/2',
        'B. RISKS: {{variables.score.risks}}/4',
        'C. SOCIALIZATION & DAILY FUNCTIONS: {{variables.score.socialization}}/4',
        'D. WELLNESS: {{variables.score.wellness}}/6',
        '<strong>GRAND TOTAL: {{variables.score.grandtotal}}/17</strong>',
      ].join('<br />'),
      rules: [
        {
          always: [
            ['sum', 'score.presurvey', 'variables.score1'],
            ['sum', 'score.history', 'variables.scoreA1', 'variables.scoreA2'],
            ['sum', 'score.risks', 'variables.scoreB1',
              'variables.scoreB2', 'variables.scoreB3', 'variables.scoreB4'],
            ['sum', 'score.socialization', 'variables.scoreC1',
              'variables.scoreC2', 'variables.scoreC3', 'variables.scoreC4'],
            ['sum', 'score.wellness', 'variables.scoreD1', 'variables.scoreD2',
              'variables.scoreD3', 'variables.scoreD4', 'variables.scoreD5',
              'variables.scoreD6'],
            ['sum', 'score.grandtotal', 'variables.score.presurvey',
              'variables.score.history', 'variables.score.risks',
              'variables.score.socialization', 'variables.score.wellness'],
          ],
        },
      ],

    },
    {
      id: 'followup',
      type: 'section',
      title: 'Follow-Up Questions',
      items: [
        {
          id: 'followup1',
          type: 'section',
          title: `On a regular day, where is it easiest to find you and what time of
            day is easiest to do so?`,
          items: [
            {
              id: 'followup.place',
              type: 'question',
              title: 'Place',
              category: 'text',
            },
            {
              id: 'followup.time',
              type: 'question',
              title: 'Time',
              category: 'choice',
              options: ['Morning', 'Afternoon', 'Evening', 'Night'],
              other: 'hh:mm',
            },
          ],
        },
        {
          id: 'followup2',
          type: 'section',
          title: `Is there a phone number and/or email where someone can safely get in touch
            with you or leave you a message?`,
          items: [
            {
              id: 'followup.phone',
              type: 'question',
              title: 'Phone',
              category: 'text',
            },
            {
              id: 'followup.email',
              type: 'question',
              title: 'Email',
              category: 'text',
            },
          ],
        },
        {
          id: 'followup.picture',
          type: 'question',
          hmisId: 'c7c60f70-1919-40e6-8f16-ce96288d6a62',
          category: 'choice',
          title: `Ok, now I’d like to take your picture so that it is easier to find you and
            confirm your identity in the future. May I do so?`,
          options: ['Yes', 'No'],
          refusable: true,
        },
      ],
    },
  ],
};

export default viSpdatSingle;
