const viSpdatFamily2 = {
  title: 'VI-SPDAT Familiy 2.0',
  id: 'viSpdatFamily2.0',
  variables: {
    score1: 0,
    score2: 0,
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
    scoreE1: 0,
    scoreE2: 0,
    scoreE3: 0,
    scoreE4: 0,
    'score.presurvey': 0,
    'score.history': 0,
    'score.risks': 0,
    'score.socialization': 0,
    'score.wellness': 0,
    'score.familyunit': 0,
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
          id: 'parent1',
          type: 'section',
          title: 'Parent 1',
          items: [
            {
              id: 'parent1.firstName',
              type: 'question',
              category: 'text',
              title: 'First Name',
            },
            {
              id: 'parent1.nickName',
              type: 'question',
              category: 'text',
              title: 'Nickname',
            },
            {
              id: 'parent1.lastName',
              type: 'question',
              category: 'text',
              title: 'Last Name',
            },
            {
              id: 'parent1.language',
              type: 'question',
              category: 'text',
              title: 'In what language do you feel best able to express yourself',
            },
            {
              id: 'parent1.dob',
              type: 'question',
              category: 'date',
              title: 'Date of Birth',
            },
            {
              id: 'parent1.age',
              type: 'question',
              category: 'number',
              title: 'Age',
            },
            {
              id: 'parent1.ssn',
              type: 'question',
              category: 'text',
              title: 'SSN',
            },
            {
              id: 'parent1.consent',
              type: 'question',
              category: 'choice',
              title: 'Consent to participate',
              options: ['Yes', 'No'],
            },
          ],
        },
        {
          id: 'parent2',
          type: 'section',
          title: 'Parent 2',
          skip: 'Second parent currently not part of the household',
          items: [
            {
              id: 'parent2.firstName',
              hmisId: '76b73026-c208-4a1d-b639-845fa7e5a57e',
              type: 'question',
              category: 'text',
              title: 'First Name',
            },
            {
              id: 'parent2.nickName',
              hmisId: '92077b12-7233-4865-9b87-418bbc7a2036',
              type: 'question',
              category: 'text',
              title: 'Nickname',
            },
            {
              id: 'parent2.lastName',
              hmisId: 'da0009f8-aa49-403d-9e1a-03c43552432b',
              type: 'question',
              category: 'text',
              title: 'Last Name',
            },
            {
              id: 'parent2.language',
              hmisId: '178a96d0-dc61-4a1c-9537-139156c4f99f',
              type: 'question',
              category: 'text',
              title: 'In what language do you feel best able to express yourself',
            },
            {
              id: 'parent2.dob',
              hmisId: '2875c580-1046-4d1a-a21b-2ea7d90e0403',
              type: 'question',
              category: 'date',
              title: 'Date of Birth',
            },
            {
              id: 'parent2.age',
              hmisId: '8a70a510-3035-4c45-8d7c-70e5e48117c2',
              type: 'question',
              category: 'number',
              title: 'Age',
            },
            {
              id: 'parent2.consent',
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
          text: 'IF EITHER HEAD OF HOUSEHOLD IS 60 YEARS OF AGE OR OLDER, THEN SCORE 1.',
          rules: [
            {
              // score - 1st
              any: [
                ['>=', 'values.parent1.age', 60],
                ['>=', 'values.parent2.age', 60],
              ],
              then: [['set', 'score1', 1]],
            },
          ],
        },
      ],
    },
    {
      id: 'section2',
      type: 'section',
      title: 'Children',
      items: [
        {
          id: 'childrenNear',
          hmisId: '78abb2e3-7450-4b25-9a47-9ad4d49dc614',
          type: 'question',
          category: 'number',
          title: '1. How many children under the age of 18 are currently with you?',
          refusable: true,
        },
        {
          id: 'childrenFar',
          hmisId: 'b859d84e-37d3-4c01-a7e7-473f19776386',
          type: 'question',
          category: 'number',
          title: `2. How many children under the age of 18 are not currently with
            your family, but you have reason to believe they will be joining
            you when you get housed?`,
          refusable: true,
          rules: [
            {
              any: [
                ['isset', 'values.childrenNear'],
                ['isset', 'values.childrenFar'],
              ],
              then: [
                ['sum', 'numChildren', 'values.childrenNear', 'values.childrenFar'],
              ],
            },
          ],
        },
        {
          id: 'pregnantMember',
          hmisId: '7253e7a0-db4a-4f02-8e0a-49046718df5e',
          type: 'question',
          category: 'choice',
          title: `3. IF HOUSEHOLD INCLUDES A FEMALE: Is any member of the family
            currently pregnant?`,
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'children',
          title: '4. Please provide a list of children’s names and ages:',
          hmisId: 'c2cabf06-7c26-4138-a6c6-bb85699a9ff3',
          type: 'grid',
          rows: 8,
          columns: [
            {
              id: 'children.firstName',
              type: 'question',
              title: 'First Name',
              category: 'text',
            },
            {
              id: 'children.lastName',
              type: 'question',
              title: 'Last Name',
              category: 'text',
            },
            {
              id: 'children.age',
              type: 'question',
              title: 'Age',
              category: 'number',
            },
            {
              id: 'children.dob',
              type: 'question',
              title: 'Date of Birth',
              category: 'date',
            },
          ],
          rules: [
            {
              always: [
                ['set', 'youngestChildAge', 'values.children.age:min'],
                ['set', 'oldestChildAge', 'values.children.age:max'],
              ],
            },
          ],
        },
        {
          id: 'section2.score',
          type: 'score',
          score: 'variables.score2',
          text: `<p>IF THERE IS A SINGLE PARENT WITH 2+ CHILDREN, AND/OR A CHILD AGED 11
            OR YOUNGER AND/OR A CURRENT PREGNANCY, THEN SCORE 1 FOR FAMILY SIZE.</p>
            <p>IF THERE ARE TWO PARENTS WITH 3+ CHILDREN, AND/OR A CHILD AGED 6 OR YOUNGER
            AND/OR A CURRENT PREGNANCY, THEN SCORE 1 FOR FAMILY SIZE.</p>`,
          rules: [
            {
              id: 'singe2children',
              comment: 'single parent with 2 children',
              all: [
                ['==', 'props.parent2.skip', 1],
                ['>=', 'variables.numChildren', 2],
              ],
              then: [['set', 'score2', 1]],
            },
            {
              id: 'singleYoungChild',
              comment: 'single parent with young children',
              all: [
                ['==', 'props.parent2.skip', 1],
                ['<=', 'values.children.age:min', 11],
              ],
              then: [['set', 'score2', 1]],
            },
            {
              id: 'singePregnancy',
              comment: 'single parent with pregnancy',
              all: [
                ['==', 'props.parent2.skip', 1],
                ['==', 'values.pregnantMember', 'Yes'],
              ],
              then: [['set', 'score2', 1]],
            },
            {
              id: 'doublePregnancyOr3children',
              comment: '2 parent and 3+ children or 6yr old or pregnancy',
              any: [
                ['>=', 'variables.numChildren', 3],
                ['<=', 'values.children.age:min', 6],
                ['==', 'values.pregnantMember', 'Yes'],
              ],
              then: [
                ['set', 'minChildrenAge', 'values.children.age:min'],
                ['set', 'score2', 1],
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'history',
      type: 'section',
      title: 'A. History of Housing and Homelessness',
      items: [
        {
          id: 'question5',
          hmisId: 'ff56db51-c37a-4367-bf78-63dba8bb2399',
          type: 'question',
          title: '5. Where do you and your family sleep most frequently?',
          category: 'choice',
          options: ['Shelters', 'Transitional Housing', 'Save Haven', 'Outdoors'],
          other: true,
          refusable: true,
        },
        {
          id: 'scoreA1',
          type: 'score',
          score: 'variables.scoreA1',
          text: `IF THE PERSON ANSWERS ANYTHING OTHER THAN "SHELTER", "TRANSITIONAL HOUSING",
            OR "SAFE HAVEN", THEN SCORE 1.`,
          rules: [
            {
              all: [
                ['isset', 'values.question5'],
                ['!=', 'values.question5', 'Refused'],
                ['!=', 'values.question5', 'Shelters'],
                ['!=', 'values.question5', 'Transitional Housing'],
                ['!=', 'values.question5', 'Safe Haven'],
              ],
              then: [['set', 'scoreA1', 1]],
            },
          ],
        },
        {
          id: 'question6',
          hmisId: '2e29751e-a69f-414b-9cac-28e825828d61',
          type: 'question',
          category: 'number',
          title: `6. How long has it been since you and your family lived in permanent
            stable housing?`,
          text: 'Enter number of years',
          refusable: true,
        },
        {
          id: 'question7',
          hmisId: 'cea74ad6-8b4a-40f8-8081-40a0ad1506fc',
          type: 'question',
          category: 'number',
          title: `7. In the last three years, how many times have you and your family
            been homeless?`,
          text: 'Enter number of episodes',
          refusable: true,
        },
        {
          id: 'scoreA2',
          type: 'score',
          score: 'variables.scoreA2',
          text: `IF THE FAMILY HAS EXPERIENCED 1 OR MORE CONSECUTIVE YEARS OF HOMELESSNESS,
            AND/OR 4+ EPISODES OF HOMELESSNESS, THEN SCORE 1.`,
          rules: [
            {
              any: [
                ['>=', 'values.question6', 1],
                ['>=', 'values.question7', 4],
              ],
              then: [['set', 'scoreA2', 1]],
            },
          ],
        },
      ],
    },
    {
      id: 'risks',
      type: 'section',
      title: 'B. Risks',
      items: [
        {
          id: 'question8',
          type: 'section',
          title: `8. In the past six months, how many times have you or anyone
            in your family...`,
          items: [
            {
              id: 'question8a',
              hmisId: 'dd52746f-8dcb-4536-80df-07823e083646',
              type: 'question',
              category: 'choice',
              title: 'a) Received health care at an emergency department/room?',
              options: ['Yes', 'No'],
              refusable: true,
            },
            {
              id: 'question8b',
              hmisId: '67b96338-d1f1-4de9-8a40-43c0ffab8ed8',
              type: 'question',
              category: 'choice',
              title: 'b) Taken an ambulance to the hospital?',
              options: ['Yes', 'No'],
              refusable: true,
            },
            {
              id: 'question8c',
              hmisId: '4062595b-9d70-4d12-86d2-275cbb838419',
              type: 'question',
              category: 'choice',
              title: 'c) Been hospitalized as an inpatient?',
              options: ['Yes', 'No'],
              refusable: true,
            },
            {
              id: 'question8d',
              hmisId: 'e2968741-ba6f-4dc7-be50-98aabca335b4',
              type: 'question',
              category: 'choice',
              title: `d) Used a crisis service, including sexual assault crisis, mental
                health crisis, family/intimate violence, distress centers and suicide
                prevention hotlines?`,
              options: ['Yes', 'No'],
              refusable: true,
            },
            {
              id: 'question8e',
              hmisId: '355a2d95-9063-4ad0-ada1-b73a5503e278',
              type: 'question',
              category: 'choice',
              title: `e) Talked to police because they witnessed a crime, were the victim
                of a crime, or the alleged perpetrator of a crime or because the police
                told them that they must move along?`,
              options: ['Yes', 'No'],
              refusable: true,
            },
            {
              id: 'question8f',
              hmisId: '89dbcb50-c511-42a9-9838-21afaba7126d',
              type: 'question',
              category: 'choice',
              title: `f) Stayed one or more nights in a holding cell, jail or prison,
                whether that was a short-term stay like the drunk tank, a longer stay for
                a more serious offence, or anything in between?`,
              options: ['Yes', 'No'],
              refusable: true,
            },
          ],
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
              any: [['==', 'values.question8a', 'Yes']],
              then: [['add', 'interactions', 1]],
            },
            {
              any: [['==', 'values.question8b', 'Yes']],
              then: [['add', 'interactions', 1]],
            },
            {
              any: [['==', 'values.question8c', 'Yes']],
              then: [['add', 'interactions', 1]],
            },
            {
              any: [['==', 'values.question8d', 'Yes']],
              then: [['add', 'interactions', 1]],
            },
            {
              any: [['==', 'values.question8e', 'Yes']],
              then: [['add', 'interactions', 1]],
            },
            {
              any: [['==', 'values.question8f', 'Yes']],
              then: [['add', 'interactions', 1]],
            },
            {
              any: [['>=', 'variables.interactions', 4]],
              then: [['set', 'scoreB1', 1]],
            },
          ],
        },
        {
          id: 'question9',
          hmisId: '8e2ad5cd-2df4-4a89-8a3a-c35ce3db49c2',
          type: 'question',
          category: 'choice',
          title: `9. Have you or anyone in your family been attacked or beaten up since
            they’ve become homeless?`,
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'question10',
          hmisId: '2baa2488-3de4-4180-8516-729c72cf03de',
          type: 'question',
          category: 'choice',
          title: `10. Have you or anyone in your family threatened to or tried to harm
            themself or anyone else in the last year?`,
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
                ['==', 'values.question9', 'Yes'],
                ['==', 'values.question10', 'Yes'],
              ],
              then: [['set', 'scoreB2', 1]],
            },
          ],
        },
        {
          id: 'question11',
          hmisId: '95944af6-8e03-45d5-8898-713c556554ed',
          type: 'question',
          category: 'choice',
          title: `11. Do you or anyone in your family have any legal stuff going on right now
            that may result in them being locked up, having to pay fines, or that make it more
            difficult to rent a place to live?`,
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
                ['==', 'values.question11', 'Yes'],
              ],
              then: [['set', 'scoreB3', 1]],
            },
          ],
        },
        {
          id: 'question12',
          hmisId: '4a1771bf-d82f-4590-ab51-a543c686f317',
          type: 'question',
          category: 'choice',
          title: `12. Does anybody force or trick you or anyone in your family to do things
            that you do not want to do?`,
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'question13',
          hmisId: 'f2f7b677-88b2-49ce-888c-5d12ea8c8ee2',
          type: 'question',
          category: 'choice',
          title: `13. Do you or anyone in your family ever do things that may be considered to
            be risky like exchange sex for money, run drugs for someone, have unprotected sex
            with someone they don’t know, share a needle, or anything like that?`,
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
                ['==', 'values.question12', 'Yes'],
                ['==', 'values.question13', 'Yes'],
              ],
              then: [['set', 'scoreB4', 1]],
            },
          ],
        },
      ],
    },
    {
      id: 'socialization',
      type: 'section',
      title: 'C. Socialization & Daily Functioning',
      items: [
        {
          id: 'question14',
          hmisId: '71735972-6fa4-452c-8502-279faa337572',
          type: 'question',
          category: 'choice',
          title: `14. Is there any person, past landlord, business, bookie, dealer, or
            government group like the IRS that thinks you or anyone in your family owe
            them money?`,
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'question15',
          hmisId: 'aa92740e-17b2-4bdc-8a58-08cf972bdff8',
          type: 'question',
          category: 'choice',
          title: `15. Do you or anyone in your family get any money from the government,
            a pension, an inheritance, working under the table, a regular job, or
            anything like that?`,
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'score',
          type: 'score',
          score: 'variables.scoreC1',
          text: `IF “YES” TO QUESTION 14 OR “NO” TO QUESTION 15, THEN SCORE 1
            FOR MONEY MANAGEMENT.`,
          rules: [
            {
              any: [
                ['==', 'values.question14', 'Yes'],
                ['==', 'values.question15', 'No'],
              ],
              then: [['set', 'scoreC1', 1]],
            },
          ],
        },
        {
          id: 'question16',
          hmisId: 'e3776b76-5c6e-4f54-ae1e-576e209e64bd',
          type: 'question',
          category: 'choice',
          title: `16. Does everyone in your family have planned activities,
            other than just surviving, that make them feel happy and fulfilled?`,
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
                ['==', 'values.question16', 'No'],
              ],
              then: [['set', 'scoreC2', 1]],
            },
          ],
        },
        {
          id: 'question17',
          hmisId: '0f4c8d69-7008-47c8-8bbb-3643fa620fea',
          type: 'question',
          category: 'choice',
          title: `17. Is everyone in your family currently able to take care of basic
            needs like bathing, changing clothes, using a restroom, getting food and
            clean water and other things like that?`,
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
                ['==', 'values.question17', 'No'],
              ],
              then: [['set', 'scoreC3', 1]],
            },
          ],
        },
        {
          id: 'question18',
          hmisId: '4c8aaa42-c324-49d1-9427-eb62c35a7bd1',
          type: 'question',
          category: 'choice',
          title: `18. Is your family’s current homelessness in any way caused by a relationship
            that broke down, an unhealthy or abusive relationship, or because other family or
            friends caused your family to become evicted?`,
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'scoreC4',
          type: 'score',
          score: 'variables.scoreC4',
          text: 'IF “YES”, THEN SCORE 1 FOR SOCIAL RELATIONSHIPS.',
          rules: [
            {
              any: [
                ['==', 'values.question18', 'Yes'],
              ],
              then: [['set', 'scoreC4', 1]],
            },
          ],
        },
      ],
    },
    {
      id: 'wellness',
      type: 'section',
      title: 'D. Wellness',
      items: [
        {
          id: 'question19',
          hmisId: 'a1585918-11c9-4549-b6f7-54f6e49900de',
          type: 'question',
          category: 'choice',
          title: `19. Has your family ever had to leave an apartment, shelter program,
            or other place you were staying because of the physical health of you or
            anyone in your family?`,
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'question20',
          hmisId: '43e73bff-bd88-416b-b20c-8e4736ba6d3c',
          type: 'question',
          category: 'choice',
          title: `20. Do you or anyone in your family have any chronic health issues
            with your liver, kidneys, stomach, lungs or heart?`,
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'question21',
          hmisId: '3a1db0f6-5eda-44be-a1a3-68b288db0033',
          type: 'question',
          category: 'choice',
          title: `21. If there was space available in a program that specifically assists
            people that live with HIV or AIDS, would that be of interest to you or anyone
            in your family?`,
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'question22',
          hmisId: '4bd1ad22-ce98-4107-95ed-63a79884176d',
          type: 'question',
          category: 'choice',
          title: `22. Does anyone in your family have any physical disabilities that would
            limit the type of housing you could access, or would make it hard to live
            independently because you’d need help?`,
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'question23',
          hmisId: '45c326cf-7c8a-4afe-9427-f9dcabf4fb49',
          type: 'question',
          category: 'choice',
          title: `23. When someone in your family is sick or not feeling well, does your
            family avoid getting medical help?`,
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
                ['==', 'values.question19', 'Yes'],
                ['==', 'values.question20', 'Yes'],
                ['==', 'values.question21', 'Yes'],
                ['==', 'values.question22', 'Yes'],
                ['==', 'values.question23', 'Yes'],
              ],
              then: [['set', 'scoreD1', 1]],
            },
          ],
        },
        {
          id: 'question24',
          hmisId: 'c823f863-ccad-4790-a7be-2d766e4f2ee1',
          type: 'question',
          category: 'choice',
          title: `24. Has drinking or drug use by you or anyone in your family led your
            family to being kicked out of an apartment or program where you were staying
            in the past?`,
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'question25',
          hmisId: '37b89058-b831-4fb9-b049-54519d4aed75',
          type: 'question',
          category: 'choice',
          title: `25. Will drinking or drug use make it difficult for your family to stay
            housed or afford your housing?`,
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
                ['==', 'values.question24', 'Yes'],
                ['==', 'values.question25', 'Yes'],
              ],
              then: [['set', 'scoreD2', 1]],
            },
          ],
        },
        {
          id: 'question26',
          type: 'section',
          title: `26. Has your family ever had trouble maintaining your housing, or been kicked
          out of an apartment, shelter program or other place you were staying, because of:`,
          items: [
            {
              id: 'question26a',
              hmisId: '59b9eb5d-4923-4fae-bc66-0eb14bcba186',
              type: 'question',
              category: 'choice',
              title: 'a) A mental health issue or concern?',
              options: ['Yes', 'No'],
              refusable: true,
            },
            {
              id: 'question26b',
              hmisId: 'a51bbe68-4fd5-4e3d-b353-1e329970b557',
              type: 'question',
              category: 'choice',
              title: 'b) A past head injury?',
              options: ['Yes', 'No'],
              refusable: true,
            },
            {
              id: 'question26c',
              hmisId: 'bbb6e063-d9c9-4bd5-b7f6-96801f723e82',
              type: 'question',
              category: 'choice',
              title: 'c) A learning disability, developmental disability, or other impairment?',
              options: ['Yes', 'No'],
              refusable: true,
            },
          ],
        },
        {
          id: 'question27',
          hmisId: 'cc60b3aa-8b9c-49da-9d82-88a07d26d165',
          type: 'question',
          category: 'choice',
          title: `27. Do you or anyone in your family have any mental health or brain issues
            that would make it hard for your family to live independently because help would
            be needed?`,
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
                ['==', 'values.question26a', 'Yes'],
                ['==', 'values.question26b', 'Yes'],
                ['==', 'values.question26c', 'Yes'],
                ['==', 'values.question27', 'Yes'],
              ],
              then: [['set', 'scoreD3', 1]],
            },
            {
              any: [
                ['!=', 'variables.scoreD1', 1],
                ['!=', 'variables.scoreD2', 1],
                ['!=', 'variables.scoreD3', 1],
              ],
              then: [
                ['pset', 'question28.skip', 1],
              ],
            },
            {
              all: [
                ['==', 'variables.scoreD1', 1],
                ['==', 'variables.scoreD2', 1],
                ['==', 'variables.scoreD3', 1],
              ],
              then: [
                ['pset', 'question28.skip', 0],
              ],
            },
          ],
        },
        {
          id: 'question28',
          type: 'question',
          category: 'choice',
          title: `28. Does any single member of your household have a medical condition, mental
            health concerns, and experience with substance use?`,
          text: `IF THE FAMILY SCORED 1 EACH FOR PHYSICAL HEALTH, SUBSTANCE USE,
            AND MENTAL HEALTH`,
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'scoreD4',
          type: 'score',
          score: 'variables.scoreD4',
          text: 'IF “YES”, SCORE 1 FOR TRI-MORBIDITY.',
          rules: [
            {
              any: [
                ['==', 'values.question28', 'Yes'],
              ],
              then: [['set', 'scoreD4', 1]],
            },
          ],
        },
        {
          id: 'question29',
          hmisId: '9fc6c685-2491-4ac7-933d-ed01a65bcaae',
          type: 'question',
          category: 'choice',
          title: `29. Are there any medications that a doctor said you or anyone in
            your family should be taking that, for whatever reason, they are not taking?`,
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'question30',
          hmisId: '095ed918-f43f-4363-9199-5684b6c1e35f',
          type: 'question',
          category: 'choice',
          title: `30. Are there any medications like painkillers that you or anyone in
            your family don’t take the way the doctor prescribed or where they sell
            the medication?`,
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
                ['==', 'values.question29', 'Yes'],
                ['==', 'values.question30', 'Yes'],
              ],
              then: [['set', 'scoreD5', 1]],
            },
          ],
        },
        {
          id: 'question31',
          hmisId: '681a670f-f6f7-451b-875f-fa1baf9beb5b',
          type: 'question',
          category: 'choice',
          title: `31. Has your family’s current period of homelessness been caused by
            an experience of emotional, physical, psychological, sexual, or other type
            of abuse, or by any other trauma you or anyone in your family have experienced?`,
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
                ['==', 'values.question31', 'Yes'],
              ],
              then: [['set', 'scoreD6', 1]],
            },
          ],
        },
      ],
    },
    {
      id: 'familyunit',
      type: 'section',
      title: 'E. Family Unit',
      items: [
        {
          id: 'question32',
          hmisId: 'd869ac7d-8f86-49bf-b876-2839ecb11ca2',
          type: 'question',
          category: 'choice',
          title: `32. Are there any children that have been removed from the family by a
            child protection service within the last 180 days?`,
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'question33',
          hmisId: '00fd81ed-d597-4bbe-892d-9b3338053651',
          type: 'question',
          category: 'choice',
          title: `33. Do you have any family legal issues that are being resolved in court
            or need to be resolved in court that would impact your housing or who may
            live within your housing?`,
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'scoreE1',
          type: 'score',
          score: 'variables.scoreE1',
          text: 'IF “YES” TO ANY OF THE ABOVE, SCORE 1 FOR FAMILY LEGAL ISSUES.',
          rules: [
            {
              any: [
                ['==', 'values.question32', 'Yes'],
                ['==', 'values.question33', 'Yes'],
              ],
              then: [['set', 'scoreE1', 1]],
            },
          ],
        },
        {
          id: 'question34',
          hmisId: '624714b4-8564-479b-b391-7e0814ec5c47',
          type: 'question',
          category: 'choice',
          title: `34. In the last 180 days have any children lived with family or friends
            because of your homelessness or housing situation?`,
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'question35',
          hmisId: '15d67f43-9ec0-4af6-9aa4-82a60203ba54',
          type: 'question',
          category: 'choice',
          title: `35. Has any child in the family experienced abuse or trauma in the last
            180 days?`,
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'question36',
          hmisId: '6a05d4dc-1bfa-45e7-aca5-a86bc0478949',
          type: 'question',
          category: 'choice',
          title: '36. Do your children attend school more often than not each week?',
          text: 'IF THERE ARE SCHOOL-AGED CHILDREN',
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'scoreE2',
          type: 'score',
          score: 'variables.scoreE2',
          text: `IF “YES” TO ANY OF QUESTIONS 34 OR 35, OR “NO” TO QUESTION 36,
            SCORE 1 FOR NEEDS OF CHILDREN.`,
          rules: [
            {
              any: [
                ['==', 'values.question34', 'Yes'],
                ['==', 'values.question35', 'Yes'],
                ['==', 'values.question36', 'No'],
              ],
              then: [['set', 'scoreE2', 1]],
            },
          ],
        },
        {
          id: 'question37',
          hmisId: '3c0ad8d2-da91-4a82-92bc-1c34b922a30a',
          type: 'question',
          category: 'choice',
          title: `37. Have the members of your family changed in the last 180 days, due to
            things like divorce, your kids coming back to live with you, someone leaving
            for military service or incarceration, a relative moving in,
            or anything like that?`,
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'question38',
          hmisId: 'a7a4eccf-1fb5-4873-8217-cc14a94af189',
          type: 'question',
          category: 'choice',
          title: `38. Do you anticipate any other adults or children coming to live with
            you within the first 180 days of being housed?`,
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'scoreE3',
          type: 'score',
          score: 'variables.scoreE3',
          text: 'IF “YES” TO ANY OF THE ABOVE, SCORE 1 FOR FAMILY STABILITY.',
          rules: [
            {
              any: [
                ['==', 'values.question37', 'Yes'],
                ['==', 'values.question38', 'Yes'],
              ],
              then: [['set', 'scoreE3', 1]],
            },
          ],
        },
        {
          id: 'question39',
          hmisId: 'ffde419f-c0ea-47ba-a4e5-eff8db186523',
          type: 'question',
          category: 'choice',
          title: `39. Do you have two or more planned activities each week as a
            family such as outings to the park, going to the library, visiting
            other family, watching a family movie, or anything like that?`,
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'question40',
          type: 'section',
          title: `40. After school, or on weekends or days when there isn’t school,
            is the total time children spend each day where there is no interaction
            with you or another responsible adult...`,
          items: [
            {
              id: 'question40a',
              hmisId: 'a098e575-1d2a-4530-8006-9f2c9db97aaa',
              type: 'question',
              category: 'choice',
              title: 'a) 3 or more hours per day for children aged 13 or older?',
              options: ['Yes', 'No'],
              refusable: true,
            },
            {
              id: 'question40b',
              hmisId: '21d68f92-8593-4aaf-8c3b-6f40fbbd7fe8',
              type: 'question',
              category: 'choice',
              title: 'b) 2 or more hours per day for children aged 12 or younger?',
              options: ['Yes', 'No'],
              refusable: true,
            },
          ],
        },
        {
          id: 'pre41',
          type: 'hidden',
          rules: [
            {
              always: [['pset', 'question41.skip', 1]],
            },
            {
              all: [
                ['<=', 'variables.youngestChildAge', 12],
                ['>=', 'variables.oldestChildAge', 13],
              ],
              then: [['pset', 'question41.skip', 0]],
            },
          ],
        },
        {
          id: 'question41',
          type: 'question',
          category: 'choice',
          title: `41. Do your older kids spend 2 or more hours on a typical day helping their
            younger sibling(s) with things like getting ready for school, helping with
            homework, making them dinner, bathing them, or anything like that?`,
          text: 'IF THERE ARE CHILDREN BOTH 12 AND UNDER & 13 AND OVER',
          options: ['Yes', 'No'],
          refusable: true,
        },
        {
          id: 'scoreE4',
          type: 'score',
          score: 'variables.scoreE4',
          text: `IF “NO” TO QUESTION 39, OR “YES” TO ANY OF QUESTIONS 40 OR 41,
            SCORE 1 FOR PARENTAL ENGAGEMENT.`,
          rules: [
            {
              any: [
                ['==', 'values.question39', 'No'],
                ['==', 'values.question40a', 'Yes'],
                ['==', 'values.question40b', 'Yes'],
                ['==', 'values.question41', 'Yes'],
              ],
              then: [['set', 'scoreE4', 1]],
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
        'PRE-SURVEY: {{variables.score.presurvey}}/2',
        'A. HISTORY OF HOUSING & HOMELESSNESS: {{variables.score.history}}/2',
        'B. RISKS: {{variables.score.risks}}/4',
        'C. SOCIALIZATION & DAILY FUNCTIONS: {{variables.score.socialization}}/4',
        'D. WELLNESS: {{variables.score.wellness}}/6',
        'E. FAMILY UNIT: {{variables.score.familyunit}}/4',
        '<strong>GRAND TOTAL: {{variables.score.grandtotal}}/22</strong>',
      ].join('<br />'),
      rules: [
        {
          always: [
            ['sum', 'score.presurvey', 'variables.score1', 'variables.score2'],
            ['sum', 'score.history', 'variables.scoreA1', 'variables.scoreA2'],
            ['sum', 'score.risks', 'variables.scoreB1',
              'variables.scoreB2', 'variables.scoreB3', 'variables.scoreB4'],
            ['sum', 'score.socialization', 'variables.scoreC1',
              'variables.scoreC2', 'variables.scoreC3', 'variables.scoreC4'],
            ['sum', 'score.wellness', 'variables.scoreD1', 'variables.scoreD2',
              'variables.scoreD3', 'variables.scoreD4', 'variables.scoreD5',
              'variables.scoreD6'],
            ['sum', 'score.familyunit', 'variables.scoreE1', 'variables.scoreE2',
              'variables.scoreE3', 'variables.scoreE4'],
            ['sum', 'score.grandtotal', 'variables.score.presurvey',
              'variables.score.history', 'variables.score.risks',
              'variables.score.socialization', 'variables.score.wellness',
              'variables.score.familyunit'],
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

export default viSpdatFamily2;
