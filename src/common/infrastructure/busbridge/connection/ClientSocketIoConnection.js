/* global common, assertNamespace */

require('../../../../NamespaceUtils.js');

assertNamespace('common.infrastructure.busbridge.connection');

common.infrastructure.busbridge.connection.ClientSocketIoConnection = function ClientSocketIoConnection(socket, onConnectCallback, onDisconnectCallback, onMessageCallback) {
   
   var connected = false;
   
   var onMessage = function onMessage(rawMessage) {
      onMessageCallback(JSON.parse(rawMessage));
   };
   
   var onConnect = function onConnect() {
      connected = true;
      onConnectCallback();
   };
   
   var onDisconnect = function onDisconnect() {
      connected = false;
      onDisconnectCallback();
   };
   
   this.send = function send(data) {
      if (connected) {
         socket.emit('message', JSON.stringify(data));
      }
   };
   
   onDisconnectCallback();
   socket.on('connect', onConnect);
   socket.on('disconnect', onDisconnect);
   socket.on('message', onMessage);
};
