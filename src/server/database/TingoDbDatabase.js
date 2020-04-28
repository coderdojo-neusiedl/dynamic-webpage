/* global assertNamespace, webapp */

require('./Database.js');
require('../../NamespaceUtils.js');

var Promise = require('promise');

var TingoDatabase = require('tingodb')().Db;

assertNamespace('webapp.server.database');

webapp.server.database.TingoDbDatabase = function TingoDbDatabase(databaseFolder, optionals) {
   
   var getTimeInMillis = (optionals === undefined || optionals.timeFunction === undefined) ? Date.now : optionals.timeFunction;

   var database = new TingoDatabase(databaseFolder, {});
   
   var getCollection = function getCollection(collectionName) {
      return new Promise(function(fulfill, reject) {
         fulfill(database.collection(collectionName));
      });
   };
   
   var insertDocument = function insertDocument(document) {
      return function(collection) {
         return new Promise(function(fulfill, reject) {
            document.creationTimestamp = getTimeInMillis();
            collection.insert(document, function(err, result) {
               if (err) {
                  reject(err);
               } else {
                  fulfill(result);
               }
            });
         });
      };
   };
   
   var updateDocument = function updateDocument(documentId, document) {
      return function(collection) {
         return new Promise(function(fulfill, reject) {
            collection.update({_id: documentId}, {$set: document}, function(err, result) {
               if (err) {
                  reject(err);
               } else {
                  fulfill(result);
               }
            });
         });
      };
   };
   
   var removeDocument = function removeDocument(documentId) {
      return function(collection) {
         return new Promise(function(fulfill, reject) {
            collection.remove({_id: documentId}, function(err, result) {
               if (err) {
                  reject(err);
               } else {
                  fulfill(result);
               }
            });
         });
      };
   };
   
   var find = function find(collection, documentFilter) {
      var cursor = collection.find();

      return new Promise(function(fulfill, reject) {
         cursor.toArray(function(err, data) {
            if (err) {
               reject(err);
            } else {
               fulfill(data.filter(documentFilter).map(function(document) {
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
   
   var findAll = function findAll(collection) {
      return find(collection, function(document) { return true; });
   };
   
   var findAllInTimespan = function findAllInTimespan(minimumTimestamp, maximumTimestamp, collection) {
      var timespanFilter = function(document) {
         return document.creationTimestamp >= minimumTimestamp && document.creationTimestamp <= maximumTimestamp;
      };
      
      return find(collection, timespanFilter);
   };
   
   this.insert = function insert(collectionName, document) {
      return getCollection(collectionName).then(insertDocument(document));
   };
   
   this.update = function update(collectionName, documentId, document) {
      return getCollection(collectionName).then(updateDocument(documentId, document));
   };
   
   this.remove = function remove(collectionName, documentId) {
      return getCollection(collectionName).then(removeDocument(documentId));
   };
   
   this.getAllDocumentsInCollection = function getAllDocumentsInCollection(collectionName) {
      return getCollection(collectionName).then(findAll);  
   };
   
   this.getAllDocumentsInCollectionInTimespan = function getAllDocumentsInCollectionInTimespan(collectionName, minimumTimestamp, maximumTimestamp) {
      return getCollection(collectionName).then(findAllInTimespan.bind(this, minimumTimestamp, maximumTimestamp)); 
   };
   
   this.close = function close() {
      return new Promise(function(fulfill, reject) {
         database.close(function(err, result) {
            if (err) {
               reject(err);
            } else {
               fulfill(result);
            }
         });
      });
   };
};

webapp.server.database.TingoDbDatabase.prototype = new webapp.server.database.Database();