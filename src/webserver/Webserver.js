/* global setInterval, common, webapp */
require('../SharedTopics.js');
require('../common/infrastructure/bus/Bus.js');
require('../common/infrastructure/busbridge/ServerSocketIoBusBridge.js');
require('../server/database/TingoDbDatabase.js');

var FileSystem = require('../utils/FileSystem.js');
var fileSystem = new FileSystem();
var express = require('express');

var WEB_ROOT_FOLDER        = 'webroot';
var DATABASE_ROOT_FOLDER   = 'database';
var SERVER_PORT            = 8080;
var LOGGING_ENABLED        = false;
var COLLECTION_NAME 			= 'Neusiedl';
  
var app    = require('express')();
var server = require('http').Server(app);
var io     = require('socket.io')(server);

var addToLog = function addToLog(message) {
   if (LOGGING_ENABLED) {
      console.log(message);
   }
};

var logRequest = function logRequest(request,response, next) {

   addToLog('\nREQUEST for "' + request.url + '" received');
   next();
};


var replaceSpacesInRequestUrlByEscapeSequence = function replaceSpacesInRequestUrlByEscapeSequence(request,response, next) {

   request.url = request.url.replace(/%20/g, ' ');
   next();
};


var sendInternalServerError = function sendInternalServerError(response, text) {
   
   addToLog('Sending error status 500 because of: ' + text);
   response.writeHeader(500, {'Content-Type': 'text/plain'});  
   response.write(text);  
   response.end();
};


var sendOkResponse = function sendOkResponse(response, content) {
   
   response.writeHeader(200, {'Content-Type': 'text/html'});  
   response.write(content);  
   response.end();
};


var handleFileRequests = function handleFileRequests(request,response) {

   var requestedDocumentUrl = request.url;
   
   addToLog('\n--- handleFileRequests ---');
   addToLog('requestedDocumentUrl: ' + requestedDocumentUrl);
   
   var absolutePathOfRequest = WEB_ROOT_FOLDER + requestedDocumentUrl;
      
   if (!fileSystem.exists(absolutePathOfRequest)) {
      
      sendInternalServerError(response, 'file ' + absolutePathOfRequest + ' does not exist');
      
   } else {

      addToLog('returning ' + absolutePathOfRequest);
      response.sendFile(requestedDocumentUrl, { root: WEB_ROOT_FOLDER } );
   }
};
   
var Constructor = function Constructor() {
	
   var thisInstance = this;
   var bus;
   var database;
   
	var onChatMessage = function onChatMessage(message) {
		bus.sendCommand(webapp.shared.topics.CHAT_BROADCAST, message );
	};
	
	var publishNotAtHomeList = function publishNotAtHomeList(list) {
		bus.publish(webapp.shared.topics.ACTUALLYNOTATHOME, list);
   };
   
	var sendNotAtHomeListToClients = function sendNotAtHomeListToClients() {
		database.getAllDocumentsInCollection(COLLECTION_NAME).then(publishNotAtHomeList);
	} ;
	
	//	bisher		{street: 'Hauptstrasse', number: 17}
	//	neu			{street: 'Hauptstrasse', number: [17, 19]}
	
	var addAddressToNotAtHomeList = function addAddressToNotAtHomeList(address) {
		
		var addressPredicate = function addressPredicate(addr) {
			return addr.street.toLowerCase() === address.street.toLowerCase();
		};
		
		var addAddress = function addAddress(addresses) {
			var existingAddress = addresses.find(addressPredicate);
			
			if (existingAddress === undefined) {
				var newAddressToStore = { street: address.street, number: [address.number]};
				database.insert(COLLECTION_NAME, newAddressToStore).then(sendNotAtHomeListToClients);
			} else {
				var addressToStore = { street: existingAddress.street, number: existingAddress.number};
				if (addressToStore.number.indexOf(address.number) === -1) {
					addressToStore.number.push(address.number);
					database.update(COLLECTION_NAME, existingAddress.id, addressToStore).then(sendNotAtHomeListToClients); 
				}
			}
		};
	
		database.getAllDocumentsInCollection(COLLECTION_NAME).then(addAddress);
	};
	
	var removeAddressFromNotAtHomeList = function removeAddressFromNotAtHomeList(address) {
		
		var removeNumber = function removeNumber(currentNumber) {
			return currentNumber !== address.number;
		};
		
		var addressPredicate = function addressPredicate(addr) {
			return addr.street.toLowerCase() === address.street.toLowerCase();
		};
		
		var removeAddress = function removeAddress(addresses) {
			var existingAddress = addresses.find(addressPredicate);
			
			if (existingAddress !== undefined) {
				existingAddress.number = existingAddress.number.filter(removeNumber);
				if (existingAddress.number.length > 0) {
					database.update(COLLECTION_NAME, existingAddress.id, existingAddress).then(sendNotAtHomeListToClients);
				} else {
					database.remove(COLLECTION_NAME, existingAddress.id).then(sendNotAtHomeListToClients);
				}
			}
		};
		
		database.getAllDocumentsInCollection(COLLECTION_NAME).then(removeAddress);
	};
	
	this.start = function start() {
	
      bus = new common.infrastructure.bus.Bus();
      database = new webapp.server.database.TingoDbDatabase(DATABASE_ROOT_FOLDER);
      
      bus.subscribeToPublication(common.infrastructure.busbridge.CONNECTION_STATE_TOPIC, function(data) {
         console.log(common.infrastructure.busbridge.CONNECTION_STATE_TOPIC + ' = ' + data);
      });
		
      bus.subscribeToCommand(webapp.shared.topics.CHAT_MESSAGE, onChatMessage);
	   bus.subscribeToCommand(webapp.shared.topics.ADD_ADDRESS_TO_NOT_AT_HOME_LIST, addAddressToNotAtHomeList);
	   bus.subscribeToCommand(webapp.shared.topics.REMOVE_ADDRESS_FROM_NOT_AT_HOME_LIST, removeAddressFromNotAtHomeList);
	  
      var topicsToTransmit = [webapp.shared.topics.CHAT_BROADCAST, webapp.shared.topics.ACTUALLYNOTATHOME];
      var busBridge = new common.infrastructure.busbridge.ServerSocketIoBusBridge(bus, topicsToTransmit, io);
      sendNotAtHomeListToClients();
     	
		app.get('*', replaceSpacesInRequestUrlByEscapeSequence);
		app.get('*', logRequest);
		app.get('*', handleFileRequests );
		
		console.log('starting webserver ...');

      server.listen(SERVER_PORT, function (listeningEvent) {
			var host = server.address().address;
			var port = server.address().port;
			console.log('listening at http://%s:%s', host, port);
		});
	};
};

module.exports = Constructor;
