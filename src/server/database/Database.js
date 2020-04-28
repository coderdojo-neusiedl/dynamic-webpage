/* global assertNamespace, webapp */

require('../../NamespaceUtils.js');

assertNamespace('webapp.server.database');


/**
 * An implementation of a database (e.g. for MongoDB) should implement the functions
 * defined in this interface. All methods return a Promise.
 */
webapp.server.database.Database = function Database() {
   
   // inserts a document into the collection identified by its name and returns a Promise
   this.insert = function insert(collectionName, document) {};
   
   // updates a document in the collection identified by its name and returns a Promise
   this.update = function update(collectionName, documentId, document) {};
   
   // removes a document with the id from the collection identified by its name and returns a Promise
   this.remove = function remove(collectionName, documentId) {};
   
   // returns a Promise that provided an array containing all documents in the collection identified by its name.
   this.getAllDocumentsInCollection = function getAllDocumentsInCollection(collectionName) {};
   
   // returns a Promise that provided an array containing all documents with 
   // minimumTimestamp <= timestamp <= maximumTimestamp in the collection identified by its name.
   this.getAllDocumentsInCollectionInTimespan = function getAllDocumentsInCollectionInTimespan(collectionName, minimumTimestamp, maximumTimestamp) {};
};
 