/* global global, common, Set, Map */

require(global.PROJECT_SOURCE_ROOT_PATH + '/common/infrastructure/busbridge/connection/ClientSocketIoConnection.js');
var MockedSocket = require('./MockedSocket.js');

var connection;
var mockedSocket;
var onConnectInvocations;
var onDisconnectInvocations;
var onMessageInvocations;
var capturedData;
var disconnectedCallbackCalledBeforeFirstInvocationOfOn;


var onConnectCallback = function onConnectCallback() {
   onConnectInvocations++;
};

var onDisconnectCallback = function onDisconnectCallback() {
   if (disconnectedCallbackCalledBeforeFirstInvocationOfOn === undefined) {
      disconnectedCallbackCalledBeforeFirstInvocationOfOn = mockedSocket.onInvocations === 0;
   }
   onDisconnectInvocations++;
};

var onMessageCallback = function onMessageCallback(data) {
   capturedData = data;
   onMessageInvocations++;
};

function valueIsAnObject(val) {
   if (val === null) { return false;}
   return ( (typeof val === 'function') || (typeof val === 'object') );
}

var setup = function setup() {
   onConnectInvocations = 0;
   onDisconnectInvocations = 0;
   onMessageInvocations = 0;
   capturedData = undefined;
   
   mockedSocket = new MockedSocket();
   connection = new common.infrastructure.busbridge.connection.ClientSocketIoConnection(mockedSocket, onConnectCallback, onDisconnectCallback, onMessageCallback);
};

describe('ClientSocketIoConnection', function() {
	
   beforeEach(setup);
   
   it('a new instance is an instance/object', function() {
      expect(valueIsAnObject(connection)).to.be.eql(true);
   });
   
   it('a new instance calls the disconnected callback before any call to on() of socket.io happens', function() {
      expect(disconnectedCallbackCalledBeforeFirstInvocationOfOn).to.be.eql(true);
   });
   
   it('a new instance registers on connect events of socket.io', function() {
      expect(mockedSocket.capturedCallbacks.has('connect')).to.be.ok();
   });
   
   it('a new instance registers on disconnect events of socket.io', function() {
      expect(mockedSocket.capturedCallbacks.has('disconnect')).to.be.ok();
   });
   
   it('a new instance registers on message events of socket.io', function() {
      expect(mockedSocket.capturedCallbacks.has('message')).to.be.ok();
   });
   
   it('when Socket.IO emits a connect event then the connect callback gets called', function() {
      mockedSocket.simulateConnectEvent();
      
      expect(onConnectInvocations).to.be.eql(1);
   });
   
   it('when Socket.IO emits a disconnect event then the disconnected callback gets called', function() {
      var oldOnDisconnectInvocations = onDisconnectInvocations;
      
      mockedSocket.simulateDisconnectEvent();
      
      expect(onDisconnectInvocations - oldOnDisconnectInvocations).to.be.eql(1);
   });
   
   it('when Socket.IO emits a message event then the message callback gets called', function() {
      var data = { id: 223, productName: 'cup'};
      
      mockedSocket.simulateMessageEvent(data);
      
      expect(onMessageInvocations).to.be.eql(1);
      expect(capturedData).to.be.eql(data);
   });
   
   it('when send gets called in connected state, then a message event containing the provided data gets sent', function() {
      var data = {date:'1.1.1991', temperature:19.2};
      
      mockedSocket.simulateConnectEvent();
      
      connection.send(data);
      
      expect(mockedSocket.capturedEmittedMessages.length).to.be.eql(1);
      expect(mockedSocket.capturedEmittedMessages[0].eventtype).to.be.eql('message');
      expect(mockedSocket.capturedEmittedMessages[0].data).to.be.eql('{"date":"1.1.1991","temperature":19.2}');
   });
   
   it('when send gets called in disconnected state, then no message event gets sent', function() {
      var topic = 'aTopic';
      var data = 'someData';
      
      mockedSocket.simulateDisconnectEvent();
      
      connection.send(topic, data);
      
      expect(mockedSocket.capturedEmittedMessages.length).to.be.eql(0);
   });
});  