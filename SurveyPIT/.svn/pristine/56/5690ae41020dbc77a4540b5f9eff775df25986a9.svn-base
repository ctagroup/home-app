/*
Declare @groupId int;
Declare @userId nvarchar(128);
Declare @surveyId int;
Declare @questId int;
--Insert into dbo.[Groups] ([Name]) Values ('Encampment')
--set @groupId = @@IDENTITY
--Insert into [dbo].[User] ([UserName],[Password],[FirstName] ,[LastName],[RoleId],[Active])
--Values ('Michelle','1111','Michelle', 'Covert', 1,1)
--set @userId = @@IDENTITY 
select @userId=id from [dbo].[AspNetUsers] where username='thuy1'
Insert into [dbo].[UserGroups]([UserId],[GroupId]) Values (@userId,@groupId)

Insert into [dbo].[Survey] ([Title],[Description],[CreatedBy],[CreatedDate],[Active],[IsPIT],[IsEncampment]) Values ( 'Encampment Site', 'Encampment site ', 1, GETDATE(), 1, 0,1)
set @surveyId = @@IDENTITY
 Insert into  [dbo].[GroupSurvey]  ([GroupId],[SurveyId]) Values ( @groupId,@surveyId)

 Insert into [dbo].[Question]([QuestionText],[Options],[QuestionType],[Active])
 Values ( 'Council District','1|2|3|4|5|6|7|8|9|10',2,1)
 select @questId = @@IDENTITY
 Insert into [dbo].[SurveyQuestion] ([SurveyId],[QuestionId],[OrderId]) Values (@surveyId,@questId,1)

 Insert into [dbo].[Question]([QuestionText],[Options],[QuestionType],[Active],[TextBoxDataType])
 Values ('Encampment location?',null,0,1,'string')
  select @questId = @@IDENTITY
  Insert into [dbo].[SurveyQuestion] ([SurveyId],[QuestionId],[OrderId]) Values (@surveyId,@questId,2)

  Insert into [dbo].[Question]([QuestionText],[Options],[QuestionType],[Active],[TextBoxDataType])
   Values ('Encampment Dispatch ID',null,0,1,'string')
   select @questId = @@IDENTITY
  Insert into [dbo].[SurveyQuestion] ([SurveyId],[QuestionId],[OrderId]) Values (@surveyId,@questId,3)

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
  */
--------------------------------------------------------------------------------
Declare @groupId int;
Declare @surveyId int;
Declare @questId int;
Declare @parentQuestId int;
select @groupId = GroupId from [dbo].[Groups] where Name ='Encampment'
 
  Insert into [dbo].[Survey] ([Title],[Description],[CreatedBy],[CreatedDate],[Active],[IsPIT],[IsEncampment]) Values ( 'Encampment Site Visit', 'Encampment site visit ', 1, GETDATE(), 1, 0,1)
set @surveyId = @@IDENTITY
 Insert into  [dbo].[GroupSurvey]  ([GroupId],[SurveyId]) Values ( @groupId,@surveyId)

  Insert into [dbo].[Question]([QuestionText],[Options],[QuestionType],[Active],[TextBoxDataType])
 Values ( 'Visit date',null,0,1,'DateTime')
 select @questId = @@IDENTITY
 Insert into [dbo].[SurveyQuestion] ([SurveyId],[QuestionId],[OrderId]) Values (@surveyId,@questId,1)

 --Don't need this as it is auto populate
 --  Insert into [dbo].[Question]([QuestionText],[Options],[QuestionType],[Active],[TextBoxDataType])
 --Values ( 'Encampment site Id',null,0,1,'int')
 --select @questId = @@IDENTITY
 --Insert into [dbo].[SurveyQuestion] ([SurveyId],[QuestionId],[OrderId]) Values (@surveyId,@questId,2)

     Insert into [dbo].[Question]([QuestionText],[Options],[QuestionType],[Active])
  Values ('Agency','BWC|IVSN|HF|DST ',2,1)
     select @questId = @@IDENTITY
  Insert into [dbo].[SurveyQuestion] ([SurveyId],[QuestionId],[OrderId]) Values (@surveyId,@questId,3)

  select @parentQuestId=@questId
  Insert into [dbo].[Question]([QuestionText],[Options],[QuestionType],[ParentQuestionId],[ParentRequiredAnswer],[Active])
 Values ( 'Writer/Outreach Worker','Andrew Garcia|Fran Garcia|Montez Davis|Amanda Nelson',2,@parentQuestId,'BWC',1)
 select @questId = @@IDENTITY
 Insert into [dbo].[SurveyQuestion] ([SurveyId],[QuestionId],[OrderId]) Values (@surveyId,@questId,3)

  Insert into [dbo].[Question]([QuestionText],[Options],[QuestionType],[ParentQuestionId],[ParentRequiredAnswer],[Active])
 Values ( 'Writer/Outreach Worker','Paulo Machuca|Ty Sussex|Connie Leyva',2,@parentQuestId,'IVSN',1)
 select @questId = @@IDENTITY
 Insert into [dbo].[SurveyQuestion] ([SurveyId],[QuestionId],[OrderId]) Values (@surveyId,@questId,3) 
  
   Insert into [dbo].[Question]([QuestionText],[Options],[QuestionType],[ParentQuestionId],[ParentRequiredAnswer],[Active])
 Values ( 'Writer/Outreach Worker','Courtney Mesa|Vanessa Beretta|Matt Pedregon|Syeta Thompson',2,@parentQuestId,'HF',1)
 select @questId = @@IDENTITY
 Insert into [dbo].[SurveyQuestion] ([SurveyId],[QuestionId],[OrderId]) Values (@surveyId,@questId,3) 

 Insert into [dbo].[Question]([QuestionText],[Options],[QuestionType],[Active])
  Values ('Reason for visit','Dispatch call|referral|ongoing visit',2,1)
     select @questId = @@IDENTITY
  Insert into [dbo].[SurveyQuestion] ([SurveyId],[QuestionId],[OrderId]) Values (@surveyId,@questId,5)

   Insert into [dbo].[Question]([QuestionText],[Options],[QuestionType],[Active])
  Values ('Referral','Business|community member|County mental health department|downtown association/Groundwerx|SJ housing department|SJ council office|SJ Ranger|homeless service provider|SJPD|Water District',2,1)
     select @questId = @@IDENTITY
  Insert into [dbo].[SurveyQuestion] ([SurveyId],[QuestionId],[OrderId]) Values (@surveyId,@questId,6)

   Insert into [dbo].[Question]([QuestionText],[Options],[QuestionType],[Active])
  Values ('Notes and Comments',null,1,1)
     select @questId = @@IDENTITY
  Insert into [dbo].[SurveyQuestion] ([SurveyId],[QuestionId],[OrderId]) Values (@surveyId,@questId,7)

  
