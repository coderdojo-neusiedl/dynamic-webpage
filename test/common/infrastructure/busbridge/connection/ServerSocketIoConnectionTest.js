/* global global, common, Set, Map */

require(global.PROJECT_SOURCE_ROOT_PATH + '/common/infrastructure/busbridge/connection/ServerSocketIoConnection.js');
var MockedSocket = require('./MockedSocket.js');

var mockedSocketIoServer;
var mockedSocket;
var anotherMockedSocket;
var connection;
var onConnectInvocations;
var onDisconnectInvocations;
var onMessageInvocations;
var capturedData;
var connectedCallbackCalledBeforeFirstInvocationOfOn;

function valueIsAnObject(val) {
   if (val === null) { return false;}
   return ( (typeof val === 'function') || (typeof val === 'object') );
}

var MockedSocketIoServer = function MockedSocketIoServer() {
   this.capturedCallbacks = new Map();
   this.emittedEvents = [];
   
   this.on = function on(eventtype, callback) {
      this.capturedCallbacks.set(eventtype, callback);
   };

   this.close = function close() {};
   
   this.emit = function emit(eventtype, data) {
      this.emittedEvents[this.emittedEvents.length] = {eventtype: eventtype, data: data};
   };
   
   this.simulateConnectionEvent = function simulateConnectionEvent(socket) {
      var callback = this.capturedCallbacks.get('connection');
      
      if (callback) {
         callback(socket);
      }
   };
};

var onConnectCallback = function onConnectCallback() {
   if (connectedCallbackCalledBeforeFirstInvocationOfOn === undefined) {
      connectedCallbackCalledBeforeFirstInvocationOfOn = mockedSocket.onInvocations === 0;
   }
   onConnectInvocations++;
};

var onDisconnectCallback = function onDisconnectCallback() {
   onDisconnectInvocations++;
};

var onMessageCallback = function onMessageCallback(data) {
   capturedData = data;
   onMessageInvocations++;
};

var whenANewSocketGetsCreated = function whenANewSocketGetsCreated() {
   mockedSocket = new MockedSocket();
   mockedSocketIoServer.simulateConnectionEvent(mockedSocket); 
};

var whenAnotherNewSocketGetsCreated = function whenAnotherNewSocketGetsCreated() {
   anotherMockedSocket = new MockedSocket();
   mockedSocketIoServer.simulateConnectionEvent(anotherMockedSocket); 
};

var givenANewSocketGetsCreated = function givenANewSocketGetsCreated() {
   whenANewSocketGetsCreated();
};

var givenAnotherNewSocketGetsCreated = function givenAnotherNewSocketGetsCreated() {
   whenAnotherNewSocketGetsCreated();
};

var setup = function setup() {
   onConnectInvocations = 0;
   onDisconnectInvocations = 0;
   onMessageInvocations = 0;
   capturedData = undefined;
   mockedSocket = undefined;
   anotherMockedSocket = undefined;
   mockedSocketIoServer = new MockedSocketIoServer();
   connection = new common.infrastructure.busbridge.connection.ServerSocketIoConnection(mockedSocketIoServer, onConnectCallback, onDisconnectCallback, onMessageCallback);
};

describe('ServerSocketIoConnection', function() {
	
   beforeEach(setup);
   
   it('a new instance is an instance/object', function() {
      expect(valueIsAnObject(connection)).to.be.eql(true);
   });
   
   it('a new instance registers on connection event of the socket.io server', function() {
      expect(mockedSocketIoServer.capturedCallbacks.has('connection')).to.be.eql(true);
   });
   
   it('a new socket.io socket registers on disconnect events of socket.io', function() {
      whenANewSocketGetsCreated();
      
      expect(mockedSocket.capturedCallbacks.has('disconnect')).to.be.eql(true);
   });
   
   it('a new socket.io socket registers on message events of socket.io', function() {
      whenANewSocketGetsCreated();
      
      expect(mockedSocket.capturedCallbacks.has('message')).to.be.ok();
   });
   
   it('the connected callback gets called only for the first accepted socket.io socket_A', function() {
      givenANewSocketGetsCreated();
      
      whenAnotherNewSocketGetsCreated();
      
      expect(onConnectInvocations).to.be.eql(1);
   });
   
   it('the connected callback gets called only for the first accepted socket.io socket_B', function() {
      givenANewSocketGetsCreated();
      givenAnotherNewSocketGetsCreated();
      mockedSocket.simulateDisconnectEvent();
      anotherMockedSocket.simulateDisconnectEvent();
      
      whenANewSocketGetsCreated();
      
      expect(onConnectInvocations).to.be.eql(2);
   });
   
   it('when a socket.io socket emits a disconnect event, then the disconnected callback gets called', function() {
      var oldOnDisconnectInvocations = onDisconnectInvocations;
      
      givenANewSocketGetsCreated();
      
      mockedSocket.simulateDisconnectEvent();
      
      expect(onDisconnectInvocations - oldOnDisconnectInvocations).to.be.eql(1);
   });
   
   it('the disconnect callback gets called when the last socket.io socket emits a disconnect event', function() {
      givenANewSocketGetsCreated();
      givenAnotherNewSocketGetsCreated();
      
      mockedSocket.simulateDisconnectEvent();
      
      var onDisconnectInvocationsBeforeLastSocketDisconnects = onDisconnectInvocations;
      
      anotherMockedSocket.simulateDisconnectEvent();
      
      expect(onDisconnectInvocationsBeforeLastSocketDisconnects).to.be.eql(0);
      expect(onDisconnectInvocations).to.be.eql(1);
   });
   
   it('when a socket.io socket emits a disconnect event, then the socket.io socket removes its disconnect event handler', function() {
      
      givenANewSocketGetsCreated();
      
      mockedSocket.simulateDisconnectEvent();

      expect(mockedSocket.capturedEventsToRemove.length).to.be.greaterThan(0);
      expect(mockedSocket.capturedEventsToRemove.indexOf('disconnect')).to.be.greaterThan(-1);
   });
   
   it('when a socket.io socket emits a disconnect event, then the socket.io socket removes its message event handler', function() {
      
      givenANewSocketGetsCreated();
      
      mockedSocket.simulateDisconnectEvent();

      expect(mockedSocket.capturedEventsToRemove.length).to.be.greaterThan(0);
      expect(mockedSocket.capturedEventsToRemove.indexOf('message')).to.be.greaterThan(-1);
   });
   
   it('when a socket.io socket emits a message event, then the message callback gets called', function() {
      var data = {name: 'dagobert', cash: 12345};
      
      givenANewSocketGetsCreated();
      
      mockedSocket.simulateMessageEvent(data);
      
      expect(onMessageInvocations).to.be.eql(1);
      expect(capturedData).to.be.eql(data);
   });
   
   it('when send gets called in connected state, then a message event containing the provided topic and data gets sent', function() {
      var data = {firstname: 'Donald', lastname: 'Duck'};
      
      givenANewSocketGetsCreated();
      
      mockedSocket.simulateConnectEvent();
      
      connection.send(data);
      
      expect(mockedSocket.capturedEmittedMessages.length).to.be.eql(1);
      expect(mockedSocket.capturedEmittedMessages[0].eventtype).to.be.eql('message');
      expect(mockedSocket.capturedEmittedMessages[0].data).to.be.eql('{"firstname":"Donald","lastname":"Duck"}');
   });
   
   it('when send gets called in disconnected state, then no message event gets sent', function() {
      var data = 'someData';
      
      givenANewSocketGetsCreated();
      
      mockedSocket.simulateDisconnectEvent();
      
      connection.send(data);
      
      expect(mockedSocket.capturedEmittedMessages.length).to.be.eql(0);
   });
   
      
   it('the latest publications get resent to a later connection (late joining behaviour) - commands get ignored', function() {
      var topic1 = 'temperature';
      var data1 = 27.9;
      var topic2 = 'windspeed';
      var data2= '12 kt';
      var topic3 = 'commandTopic';
      var data3 = 'commandData';
      
      var message1 = common.infrastructure.busbridge.MessageFactory.createPublicationMessage(topic1, data1);
      var message2 = common.infrastructure.busbridge.MessageFactory.createPublicationMessage(topic2, data2);
      var message3 = common.infrastructure.busbridge.MessageFactory.createCommandMessage(topic3, data3);
      var serializedMessage1 = JSON.stringify(message1);
      var serializedMessage2 = JSON.stringify(message2);
      
      givenANewSocketGetsCreated();
      
      connection.send(message1);
      mockedSocket.simulateMessageEvent(message2);
      mockedSocket.simulateMessageEvent(message3);
      connection.send(message3);
      
      whenAnotherNewSocketGetsCreated();
      
      expect(anotherMockedSocket.capturedEmittedMessages.length).to.be.eql(2);
      
      if (anotherMockedSocket.capturedEmittedMessages[0].data === serializedMessage1) {
         expect(anotherMockedSocket.capturedEmittedMessages[1].data).to.be.eql(serializedMessage2);
      } else if (anotherMockedSocket.capturedEmittedMessages[0].data === serializedMessage2) {
         expect(anotherMockedSocket.capturedEmittedMessages[1].data).to.be.eql(serializedMessage1);
      } else {
         expect(false).to.be.eql(true);
      }
   });

});  