import { Mongo } from 'meteor/mongo';
// collection for basic client info, including name, dedupId, id and schema
export const ClientsCache = new Mongo.Collection('clientsCache');
