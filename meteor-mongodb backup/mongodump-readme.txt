To Restore the mongoDB
------------------------
1. Install full mongoDB tool from http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/
2. Run the meteor application from http://localhost:3000 
3. To replace from existing database to the backup database, run the following from bin folder of the mongo installation
mongorestore -h 127.0.0.1 --port 3001 -d meteor --drop dump/<nameOfDatabase>
4. To take a backup of the database, run the following from bin folder of the mongo installation
mongodump -h 127.0.0.1 --port 3001 -d <NameOfDatabase>