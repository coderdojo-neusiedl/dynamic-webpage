/* global common, assertNamespace */

require('../../../../NamespaceUtils.js');

assertNamespace('common.infrastructure.busbridge.connection');

common.infrastructure.busbridge.connection.ServerSocketIoConnection = function ServerSocketIoConnection(socketIoServer, onConnectCallback, onDisconnectCallback, onMessageCallback) {
   
   var sockets = [];
   var counter = 1;
   var latestPublicationMessagesByTopic = {};
   
   var Socket = function Socket(socketIoSocket, messageCallback, disconnectCallback) {
      
      this.id = counter++;
      var thisInstance = this;
      
      var onMessage = function onMessage(rawMessage) {
         messageCallback(rawMessage, thisInstance);
      };
      
      var onDisconnect = function onDisconnect() {
         socketIoSocket.removeListener('disconnect', onDisconnect);
         socketIoSocket.removeListener('message', onMessage);
         disconnectCallback(thisInstance);
      };
      
      this.send = function send(rawMessage) {
         socketIoSocket.emit('message', rawMessage);
      };
      
      socketIoSocket.on('disconnect', onDisconnect);
      socketIoSocket.on('message', onMessage);
   };
   
   var onMessage = function onMessage(rawMessage, sendingSocket) {
      var message = JSON.parse(rawMessage);
      onMessageCallback(message);
      
      if (message.type === 'PUBLICATION') {
         latestPublicationMessagesByTopic[message.topic] = message;
      }
   };
   
   var onDisconnect = function onDisconnect(disconnectedSocket) {
      var indexToDelete = sockets.indexOf(disconnectedSocket);
      
      if (indexToDelete >= 0) {
         sockets.splice(indexToDelete, 1);
      }
      
      if (sockets.length === 0) {
         onDisconnectCallback();
      }
   };
   
   var onConnection = function onConnection(newSocketIoSocket) {
      var newSocket = new Socket(newSocketIoSocket, onMessage, onDisconnect);
      sockets[sockets.length] = newSocket;
      
      if (sockets.length === 1) {
         onConnectCallback();
      }
      
      var topics = Object.keys(latestPublicationMessagesByTopic);
      topics.forEach(function(topic) {
         newSocket.send(JSON.stringify(latestPublicationMessagesByTopic[topic]));
      });
   };
   
   this.send = function send(message) {
      var serializedMessage = JSON.stringify(message);
      sockets.forEach(function(socket) { socket.send(serializedMessage); });
      
      if (message.type === 'PUBLICATION') {
         latestPublicationMessagesByTopic[message.topic] = message;
      }
   };

   socketIoServer.on('connection', onConnection);
};
