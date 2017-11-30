const viSpdatTay1 = {
  title: 'VI-SPDAT TAY v1.0',
  id: 'viSpdatTay1.0',
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
    scoreC5: 0,
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
          hmisId: '178a96d0-dc61-4a1c-9537-139156c4f99f',
          type: 'question',
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
      text: 'IF THE PERSON IS 17 YEARS OF AGE OR LESS, THEN SCORE 1.',
      rules: [
        {
          any: [
            ['<=', 'values.client.age', 60],
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
          hmisId: 'e6245008-0de9-4dcc-86eb-acc8ef043b3b',
          type: 'question',
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
          hmisId: '699d0bfa-10cb-4492-ae8d-c5e909a5e38e',
          type: 'question',
          title: '2. How long has it been since you lived in permanent stable housing?',
          text: 'in years',
          category: 'number',
          refusable: true,
        },
        {
          id: 'question3',
          hmisId: 'eda30beb-2290-4414-97e9-e0c38487388d',
          type: 'question',
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
              hmisId: 'dd52746f-8dcb-4536-80df-07823e083646',
              type: 'question',
              title: 'a) Received health care at an emergency department/room?',
              category: 'choice',
              options: ['Yes', 'No'],
              refusable: true,
            },
            {
              id: 'question4b',
              hmisId: '859db113-7aa3-43c4-a795-3926d0be98d5',
              type: 'question',
              title: 'b) Taken an ambulance to the hospital?',
              category: 'choice',
              options: ['Yes', 'No'],
              refusable: true,
            },
            {
              id: 'question4c',
              hmisId: '4062595b-9d70-4d12-86d2-275cbb838419',
              type: 'question',
              title: 'c) Been hospitalized as an inpatient?',
              category: 'choice',
              options: ['Yes', 'No'],
              refusable: true,
            },
            {
              id: 'question4d',
              hmisId: 'e2968741-ba6f-4dc7-be50-98aabca335b4',
              type: 'question',
              title: `d) Used a crisis service, including sexual assault crisis, mental health
                crisis, family/intimate violence, distress centers and suicide
                prevention hotlines?`,
              category: 'choice',
              options: ['Yes', 'No'],
              refusable: true,
            },
            {
              id: 'question4e',
              hmisId: '355a2d95-9063-4ad0-ada1-b73a5503e278',
              type: 'question',
              title: `e) Talked to police because you witnessed a crime, were the victim of a crime,
                or the alleged perpetrator of a crime or because the police told you that you
                must move along?`,
              category: 'choice',
              options: ['Yes', 'No'],
              refusable: true,
            },
            {
              id: 'question4f',
              hmisId: '89dbcb50-c511-42a9-9838-21afaba7126d',
              type: 'question',
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
              hmisId: '4467ba3e-644e-4d6e-a14e-ec126b2b5a3b',
              type: 'question',
              title: '5. Have you been attacked or beaten up since you’ve become homeless?',
              category: 'choice',
              options: ['Yes', 'No'],
              refusable: true,
            },
            {
              id: 'question6',
              hmisId: '86f6566e-8562-4d94-b225-b9f6adfc0a5b',
              type: 'question',
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
              hmisId: '967d3a72-2642-4e22-84ba-4ab9848c4805',
              type: 'question',
              title: `7. Do you have any legal stuff going on right now that may result in
                you being locked up, having to pay fines, or that make it more difficult
                to rent a place to live?`,
              category: 'choice',
              options: ['Yes', 'No'],
              refusable: true,
            },
            {
              id: 'question8',
              hmisId: 'f0571095-50fa-44e6-8955-bfda8036c6fb',
              type: 'question',
              title: '8. Were you ever incarcerated when younger than age 18?',
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
                    ['==', 'values.question8', 'Yes'],
                  ],
                  then: [['set', 'scoreB3', 1]],
                },
              ],
            },
            {
              id: 'question9',
              hmisId: '82922fab-fbc5-4ecf-8b56-0e6cda23b12f',
              type: 'question',
              title: '9. Does anybody force or trick you to do things that you do not want to do?',
              category: 'choice',
              options: ['Yes', 'No'],
              refusable: true,
            },
            {
              id: 'question10',
              hmisId: '02d705ae-1744-4282-af83-aa0a7bfba63c',
              type: 'question',
              title: `10. Do you ever do things that may be considered to be risky like exchange sex
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
                    ['==', 'values.question9', 'Yes'],
                    ['==', 'values.question10', 'Yes'],
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
          id: 'question11',
          hmisId: '3d99726d-7ab1-4d44-954b-1e256c3dab4c',
          type: 'question',
          title: `11. Is there any person, past landlord, business, bookie, dealer, or government
            group like the IRS that thinks you owe them money?`,
          category: 'choice',
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'question12',
          hmisId: '38949cc4-d93e-4558-ac80-1e6eb5c1e165',
          type: 'question',
          title: `12. Do you get any money from the government, a pension, an inheritance, working
            under the table, a regular job, or anything like that?`,
          category: 'choice',
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'scoreC1',
          type: 'score',
          score: 'variables.scoreC1',
          text: `IF “YES” TO QUESTION 11 OR “NO” TO QUESTION 12, THEN SCORE 1 FOR MONEY
            MANAGEMENT.`,
          rules: [
            {
              any: [
                ['==', 'values.question11', 'Yes'],
                ['==', 'values.question12', 'No'],
              ],
              then: [['set', 'scoreC1', 1]],
            },
          ],
        },
        {
          id: 'question13',
          hmisId: 'a1d57864-e878-478c-8e94-d0e13146f644',
          type: 'question',
          title: `13. Do you have planned activities, other than just surviving, that make you feel
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
                ['==', 'values.question13', 'No'],
              ],
              then: [['set', 'scoreC2', 1]],
            },
          ],
        },
        {
          id: 'question14',
          hmisId: '9135c56e-df2c-4c59-a6db-977e16a64f35',
          type: 'question',
          title: `14. Are you currently able to take care of basic needs like bathing, changing
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
                ['==', 'values.question14', 'No'],
              ],
              then: [['set', 'scoreC3', 1]],
            },
          ],
        },
        {
          id: 'question15',
          type: 'section',
          title: '15. Is your current lack of stable housing...',
          items: [
            {
              id: 'question15a',
              hmisId: '7b657bbb-2b7d-47e7-a0cf-0f13d19b445c',
              type: 'question',
              title: `a) Because you ran away from your family home, a group home or a
                foster home?`,
              category: 'choice',
              options: ['Yes', 'No'],
              refusable: true,
            },
            {
              id: 'question15b',
              hmisId: '04a45f27-a859-4c37-a2bb-7251ae6ad63d',
              type: 'question',
              title: `b) Because of a difference in religious or cultural beliefs from
                your parents, guardians or caregivers?`,
              category: 'choice',
              options: ['Yes', 'No'],
              refusable: true,
            },
            {
              id: 'question15c',
              hmisId: 'f6f0ec63-2c45-4281-bd43-fb73f7ab31b0',
              type: 'question',
              title: 'c) Because your family or friends caused you to become homeless?',
              category: 'choice',
              options: ['Yes', 'No'],
              refusable: true,
            },
            {
              id: 'question15d',
              hmisId: '3023590c-a2e4-4f5c-a483-2ccda3ef7fba',
              type: 'question',
              title: 'd) Because of conflicts around gender identity or sexual orientation?',
              category: 'choice',
              options: ['Yes', 'No'],
              refusable: true,
            },
            {
              id: 'scoreC4',
              type: 'score',
              score: 'variables.scoreC4',
              text: 'IF “YES” TO ANY OF THE ABOVE THEN SCORE 1 FOR SOCIAL RELATIONSHIPS.',
              rules: [
                {
                  any: [
                    ['==', 'values.question15a', 'Yes'],
                    ['==', 'values.question15b', 'Yes'],
                    ['==', 'values.question15c', 'Yes'],
                    ['==', 'values.question15d', 'Yes'],
                  ],
                  then: [['set', 'scoreC4', 1]],
                },
              ],
            },
            {
              id: 'question15e',
              hmisId: '4c69f23e-efeb-49dd-b266-d16f9493d2b0',
              type: 'question',
              title: 'e) Because of violence at home between family members?',
              category: 'choice',
              options: ['Yes', 'No'],
              refusable: true,
            },
            {
              id: 'question15f',
              hmisId: '614de037-0eda-4675-8971-e9e2d0316d84',
              type: 'question',
              title: `f) Because of an unhealthy or abusive relationship, either
                at home or elsewhere?`,
              category: 'choice',
              options: ['Yes', 'No'],
              refusable: true,
            },
            {
              id: 'scoreC5',
              type: 'score',
              score: 'variables.scoreC5',
              text: 'IF “YES” TO ANY OF THE ABOVE THEN SCORE 1 FOR ABUSE/TRAUMA.',
              rules: [
                {
                  any: [
                    ['==', 'values.question15e', 'Yes'],
                    ['==', 'values.question15f', 'Yes'],
                  ],
                  then: [['set', 'scoreC5', 1]],
                },
              ],
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
          id: 'question16',
          hmisId: 'dec86408-2ab2-456a-8cd1-62523b5b57fe',
          type: 'question',
          title: `16. Have you ever had to leave an apartment, shelter program, or other place
            you were staying because of your physical health?`,
          category: 'choice',
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'question17',
          hmisId: '7ac97262-c933-49d5-b579-81d177cd3acf',
          type: 'question',
          title: `17. Do you have any chronic health issues with your liver, kidneys, stomach,
            lungs or heart?`,
          category: 'choice',
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'question18',
          hmisId: '8e38784d-2c00-4b3c-9da1-8755d0e55856',
          type: 'question',
          title: `18. If there was space available in a program that specifically assists people
            that live with HIV or AIDS, would that be of interest to you`,
          category: 'choice',
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'question19',
          hmisId: '9fb1a45f-bfc1-4ead-a114-64d4608b3123',
          type: 'question',
          title: `19. Do you have any physical disabilities that would limit the type of housing
            you could access, or would make it hard to live independently because you’d need help?`,
          category: 'choice',
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'question20',
          hmisId: '492ba561-52e1-4160-af82-20017d5c3dc9',
          type: 'question',
          title: '20. When you are sick or not feeling well, do you avoid getting help?',
          category: 'choice',
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'question21',
          hmisId: 'd0688044-e33d-4902-8220-34c3da00f0a0',
          type: 'question',
          title: `21. Are you currently pregnant, have you ever been pregnant, or have
            you ever gotten someone pregnant?`,
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
                ['==', 'values.question16', 'Yes'],
                ['==', 'values.question17', 'Yes'],
                ['==', 'values.question18', 'Yes'],
                ['==', 'values.question19', 'Yes'],
                ['==', 'values.question20', 'Yes'],
                ['==', 'values.question21', 'Yes'],
              ],
              then: [['set', 'scoreD1', 1]],
            },
          ],
        },
        {
          id: 'question22',
          hmisId: '54cee876-4303-43c5-884f-9661faa8dddc',
          type: 'question',
          title: `22. Has your drinking or drug use led you to being kicked out of an
            apartment or program where you were staying in the past?`,
          category: 'choice',
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'question23',
          hmisId: '7a5e09de-7edd-45dc-ad6b-db2b1242eed5',
          type: 'question',
          title: `23. Will drinking or drug use make it difficult for you to stay housed or
            afford your housing?`,
          category: 'choice',
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'question24',
          hmisId: 'a6f1a991-d80b-450a-bc31-866eb1373aa9',
          type: 'question',
          title: '24. If you’ve ever used marijuana, did you ever try it at age 12 or younger?',
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
                ['==', 'values.question22', 'Yes'],
                ['==', 'values.question23', 'Yes'],
                ['==', 'values.question24', 'Yes'],
              ],
              then: [['set', 'scoreD2', 1]],
            },
          ],
        },
        {
          id: 'question25',
          type: 'section',
          title: `Have you ever had trouble maintaining your housing, or been kicked
            out of an apartment, shelter program or other place you were staying, because of:`,
          items: [
            {
              id: 'question25a',
              hmisId: '439a41bd-e2da-4fa5-905d-3eece21e08d3',
              type: 'question',
              title: 'a) A mental health issue or concern?',
              category: 'choice',
              options: ['Yes', 'No'],
              refusable: true,
            },
            {
              id: 'question25b',
              hmisId: 'a51bbe68-4fd5-4e3d-b353-1e329970b557',
              type: 'question',
              title: 'b) A past head injury?',
              category: 'choice',
              options: ['Yes', 'No'],
              refusable: true,
            },
            {
              id: 'question25c',
              hmisId: 'bbb6e063-d9c9-4bd5-b7f6-96801f723e82',
              type: 'question',
              title: 'c) A learning disability, developmental disability, or other impairment',
              category: 'choice',
              options: ['Yes', 'No'],
              refusable: true,
            },
          ],
        },
        {
          id: 'question26',
          hmisId: '00930865-f1be-4811-8e86-4f63657101cc',
          type: 'question',
          title: `26. Do you have any mental health or brain issues that would make it hard for
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
                ['==', 'values.question25a', 'Yes'],
                ['==', 'values.question25b', 'Yes'],
                ['==', 'values.question25c', 'Yes'],
                ['==', 'values.question26', 'Yes'],
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
          id: 'question27',
          hmisId: 'acae7b1e-273d-4965-b71a-339c68a2f0f9',
          type: 'question',
          title: `27. Are there any medications that a doctor said you should be taking that, for
            whatever reason, you are not taking?`,
          category: 'choice',
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'question28',
          hmisId: 'd9dc358b-69ad-4483-8a77-226c605a2e7b',
          type: 'question',
          title: `28. Are there any medications like painkillers that you don’t take the way the
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
                ['==', 'values.question27', 'Yes'],
                ['==', 'values.question28', 'Yes'],
              ],
              then: [['set', 'scoreD5', 1]],
            },
          ],
        },
        {
          id: 'question29',
          type: 'question',
          title: `29. Has your current period of homelessness been caused by an experience of
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
                ['==', 'values.question29', 'Yes'],
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
              hmisId: 'a10f159b-f542-4999-b310-9b44b37e7491',
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
              hmisId: 'e29be8f9-5413-4b78-a972-d7f616885ea4',
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
          hmisId: 'c7c60f70-1919-40e6-8f16-ce96288d6a62',
          type: 'question',
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

export default viSpdatTay1;
