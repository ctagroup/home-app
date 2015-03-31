Declare @groupId int;
Declare @userId int;
Declare @surveyId int;
Declare @questId int;

select @groupId = groupId from dbo.[Group] where name = 'Santa Clara'

select @userId =UserId from [dbo].[User] where UserName ='thuy'

Insert into [dbo].[Survey] ([Title],[Description],[CreatedBy],[CreatedDate],[Active],[IsPIT]) Values ( '2013 Homeless Survey', 'Santa Clara County ', 1, GETDATE(), 1, 0)
set @surveyId = @@IDENTITY
 Insert into  [dbo].[GroupSurvey]  ([GroupId],[SurveyId]) Values ( @groupId,@surveyId)

Insert into [dbo].[SurveyQuestion] ([SurveyId],[QuestionId],[OrderId]) Values (@surveyId,5,1)

 select * from question
 Insert into [dbo].[Question]([QuestionText],[Options],[QuestionType],[Active])
 Values ( 'Were you ever in foster care','Yes|No',2,1)
 select @questId = @@IDENTITY
 Insert into [dbo].[SurveyQuestion] ([SurveyId],[QuestionId],[OrderId]) Values (@surveyId,@questId,2)

Insert into [dbo].[Question]([QuestionText],[Options],[QuestionType],[ParentQuestionId],[ParentRequiredAnswer],[Active],[TextBoxDataType])
 Values ( 'How long were you in foster care?',null,0,@questId,'Yes',1,'int')
 select @questId = @@IDENTITY
 Insert into [dbo].[SurveyQuestion] ([SurveyId],[QuestionId],[OrderId]) Values (@surveyId,@questId,2)

 Insert into [dbo].[SurveyQuestion] ([SurveyId],[QuestionId],[OrderId]) Values (@surveyId,4,3)

 Insert into [dbo].[Question]([QuestionText],[Options],[QuestionType],[Active])
 Values ('Do you consider yourself...?(check all that apply)','Straight|Gay or lesbian|Bisexual|Other',3,1)
  select @questId = @@IDENTITY
  Insert into [dbo].[SurveyQuestion] ([SurveyId],[QuestionId],[OrderId]) Values (@surveyId,@questId,4)
  --Veteran Status
  Insert into [dbo].[Question]([QuestionText],[Options],[QuestionType],[Active],[TextBoxDataType])
   Values ('Have you served on active duty in the U.S. Armed Force? (e.g. served in a full-time capacity in the Army, Navy, Air Force, Marine Corps, or Coast Guard)',null,0,1,'string')
   select @questId = @@IDENTITY
  Insert into [dbo].[SurveyQuestion] ([SurveyId],[QuestionId],[OrderId]) Values (@surveyId,@questId,5)

  Insert into [dbo].[Question]([QuestionText],[Options],[QuestionType],[Active])
  Values ('Site Code','BWC| IVSN| HF| DST| BWC/HF| DST/HF| BWC/IVSN',2,1)
     select @questId = @@IDENTITY
  Insert into [dbo].[SurveyQuestion] ([SurveyId],[QuestionId],[OrderId]) Values (@surveyId,@questId,4)

    Insert into [dbo].[Question]([QuestionText],[Options],[QuestionType],[Active])
  Values ('Encampment type','river/trail| park| parking lot/business| street| abandoned building| freeway, off/on ramp| train tracks| rv| not an encampment/homeless person| empty lot/field| under bridge| other',3,1)
     select @questId = @@IDENTITY
  Insert into [dbo].[SurveyQuestion] ([SurveyId],[QuestionId],[OrderId]) Values (@surveyId,@questId,5)

     Insert into [dbo].[Question]([QuestionText],[Options],[QuestionType],[Active])
  Values ('Size of encampment','1 to 10|11 to 20| 20+',2,1)
     select @questId = @@IDENTITY
  Insert into [dbo].[SurveyQuestion] ([SurveyId],[QuestionId],[OrderId]) Values (@surveyId,@questId,6)

    Insert into [dbo].[Question]([QuestionText],[Options],[QuestionType],[Active])
  Values ('Environmental impact','none|high|medium|low ',2,1)
     select @questId = @@IDENTITY
  Insert into [dbo].[SurveyQuestion] ([SurveyId],[QuestionId],[OrderId]) Values (@surveyId,@questId,7)

     Insert into [dbo].[Question]([QuestionText],[Options],[QuestionType],[Active])
  Values ('Visibility to the public','none|high|medium|low ',2,1)
     select @questId = @@IDENTITY
  Insert into [dbo].[SurveyQuestion] ([SurveyId],[QuestionId],[OrderId]) Values (@surveyId,@questId,8)