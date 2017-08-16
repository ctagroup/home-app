import { Mongo } from 'meteor/mongo';

const CollectionsCount = new Mongo.Collection('collectionsCount');

export default CollectionsCount;
