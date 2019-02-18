scp -r -i ~/.ssh/home-cta.pem ubuntu@54.191.131.191:/home/ubuntu/backup-dir/home-cta /tmp/
mongorestore --drop --db meteor --collection questions /tmp/home-cta/questions.bson --host localhost:3001
mongorestore --drop --db meteor --collection responses /tmp/home-cta/responses.bson --host localhost:3001
mongorestore --drop --db meteor --collection surveyQuestionsMaster /tmp/home-cta/surveyQuestionsMaster.bson --host localhost:3001
mongorestore --drop --db meteor --collection surveys /tmp/home-cta/surveys.bson --host localhost:3001

