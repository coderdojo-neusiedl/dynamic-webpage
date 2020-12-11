/* global assertNamespace, webapp */

require('./Database.js');
require('../../NamespaceUtils.js');

var MongoClient = require('mongodb');

var Promise = require('promise');

assertNamespace('webapp.server.database');

webapp.server.database.MongoDbDatabase = function MongoDbDatabase(connectionUri, onConnectCallback) {
   
   var mongoClient;
   
   var getCollection = function getCollection(collectionName) {
      return mongoClient.db('Neusiedl').collection(collectionName);
   };
   
   var findAll = function findAll(cursor) {
      return new Promise(function(fulfill, reject) {
         cursor.toArray(function(err, data) {
            if (err) {
               reject(err);
            } else {
               fulfill(data.map(function(document) {
                  var result = {};
                  Object.keys(document).filter(function(key) { return !key.startsWith('_');}).forEach(function(key) {
                     result[key] = document[key];
                  });
                  result.id = document._id;
                  return result;
               }));
            }
         }); 
      });
   };
   
   
   this.insert = function insert(collectionName, document) {
      document.creationTimestamp = Date.now();
      return getCollection(collectionName).insertOne(document);
   };
   
   this.update = function update(collectionName, documentId, document) {
      return getCollection(collectionName).updateOne({_id: documentId}, {$set: document});
   };
   
   this.remove = function remove(collectionName, documentId) {
      return getCollection(collectionName).removeOne({_id: documentId});
   };
   
   this.getAllDocumentsInCollection = function getAllDocumentsInCollection(collectionName) {
      return findAll(getCollection(collectionName).find());
   };

   var onConnected = function onConnected(client) {
      mongoClient = client;
      console.log('successfully connected to MongoDB');
      onConnectCallback();
   };
   
   var onError = function onError(error) {
      console.log('failed to connect to MongoDB: ' + error);
   };

   MongoClient.connect(connectionUri, { useUnifiedTopology: true }).then(onConnected, onError);
};

webapp.server.database.MongoDbDatabase.prototype = new webapp.server.database.Database();