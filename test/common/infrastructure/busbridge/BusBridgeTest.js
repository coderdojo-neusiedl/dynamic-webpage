/* global global, window: true, common, Set, Map */

require(global.PROJECT_SOURCE_ROOT_PATH + '/common/infrastructure/busbridge/BusBridge.js');
require(global.PROJECT_SOURCE_ROOT_PATH + '/common/infrastructure/busbridge/MessageFactory.js');

var busBridge;
var mockedConnection;
var mockedBus;
   
var add = function add(callback) {
   return { 
      relatedTo: function relatedTo(topic) {
         return {
            to: function to(map) {
               if (!map.has(topic)) {
                  map.set(topic, new Set());
               }
               
               map.get(topic).add(callback);
            }
         };
      }
   };
}; 

var capture = function capture(callback) {
   return { 
      relatedTo: function relatedTo(topic) {
         return {
            withContainer: function withContainer(map) {
               if (!map.has(topic)) {
                  map.set(topic, []);
               }
               
               var capturedCallbacks = map.get(topic);
               capturedCallbacks[capturedCallbacks.length] = callback;
            }
         };
      }
   };
}; 

var invokeAll = function invokeAll(map) {
   return {
      ofType: function ofType(topic) {
         return {
            withData: function withData(data) {
               if (map.has(topic)) {
                  map.get(topic).forEach(function(callback) {
                     callback(data);
                  });
               }
            }
         };
      }
   };
};

var MockedConnection = function MockedConnection(onConnectCallback, onDisconnectCallback, onMessageCallback) {
   
   this.capturedSentMessages = [];
   
   this.send = function send(data) {
      this.capturedSentMessages[this.capturedSentMessages.length] = data;
   };
   
   this.simulateReceivedMessage = function simulateReceivedMessage(data) {
      onMessageCallback(data);
   };
   
   this.simulateConnect = function simulateConnect() {
      onConnectCallback();
   };
   
   this.simulateDisconnect = function simulateDisconnect() {
      onDisconnectCallback();
   };
};

var MockedBus = function() {
   this.capturedPublicationCallbacksPerTopic = new Map();
   this.capturedCommandCallbacksPerTopic = new Map();
   this.capturedPublishedData = new Map();
   this.capturedCommands = new Map();
   
   var publicationSubscribersPerTopic = new Map();
   var commandSubscribersPerTopic = new Map();
   var invokeAllRegisteredCallbacks = false;
   var invokeAllCommandCallbacks = false;
   
   this.subscribeToPublication = function subscribeToPublication(topic, callback) {
      add(callback).relatedTo(topic).to(publicationSubscribersPerTopic);
      capture(callback).relatedTo(topic).withContainer(this.capturedPublicationCallbacksPerTopic);
   };
   
   this.subscribeToCommand = function subscribeToCommand(topic, callback) {
      add(callback).relatedTo(topic).to(commandSubscribersPerTopic);
      capture(callback).relatedTo(topic).withContainer(this.capturedCommandCallbacksPerTopic);
  };
   
   this.publish = function publish(topic, data) {
      capture(data).relatedTo(topic).withContainer(this.capturedPublishedData);
      if (invokeAllRegisteredCallbacks) {
         invokeAll(publicationSubscribersPerTopic).ofType(topic).withData(data);
      }
   };
   
   this.sendCommand = function sendCommand(topic, data) {
      capture(data).relatedTo(topic).withContainer(this.capturedCommands);
      if (invokeAllCommandCallbacks) {
         invokeAll(commandSubscribersPerTopic).ofType(topic).withData(data);
      }
   };
   
   this.simulatePublication = function simulatePublication(topic, data) {
      invokeAll(publicationSubscribersPerTopic).ofType(topic).withData(data);
   };
   
   this.simulateCommand = function simulateCommand(topic, data) {
      invokeAll(commandSubscribersPerTopic).ofType(topic).withData(data);
   };
   
   this.invokeAllRegisteredCallbacksWhenPublishGetsCalled = function invokeAllRegisteredCallbacksWhenPublishGetsCalled(){
      invokeAllRegisteredCallbacks = true;
   };
   
   this.invokeAllRegisteredCallbacksWhenSendCommandGetsCalled = function invokeAllRegisteredCallbacksWhenSendCommandGetsCalled(){
      invokeAllCommandCallbacks = true;
   };
};

var connectionFactoryFunction = function connectionFactoryFunction(onConnectCallback, onDisconnectCallback, onMessageCallback) {
   mockedConnection = new MockedConnection(onConnectCallback, onDisconnectCallback, onMessageCallback);
   return mockedConnection;
};

function valueIsAnObject(val) {
   if (val === null) { return false;}
   return ( (typeof val === 'function') || (typeof val === 'object') );
}

function givenABusBridgeWhichTransmits(topicsToTransmit) {
   busBridge = new common.infrastructure.busbridge.BusBridge(mockedBus, topicsToTransmit, connectionFactoryFunction);
}

var setup = function setup() {
   window = undefined;
   var topicsToTransmit = [];
   mockedBus = new MockedBus();
   givenABusBridgeWhichTransmits(topicsToTransmit);
};

describe('BusBridge', function() {
	
   beforeEach(setup);
   
   it('creating an instance of a bus bridge results in an instance/object', function() {
      expect(valueIsAnObject(busBridge)).to.be.eql(true);
   });
   
   it('a new instance publishes false on the CONNECTION_STATE_TOPIC', function() {
      expect(mockedBus.capturedPublishedData.get(common.infrastructure.busbridge.CONNECTION_STATE_TOPIC).length).to.be.eql(1);
      expect(mockedBus.capturedPublishedData.get(common.infrastructure.busbridge.CONNECTION_STATE_TOPIC)[0]).to.be.eql('false');
   });
   
   it('when the connection gets into connected state, then true gets published on the CONNECTION_STATE_TOPIC', function() {
      var capturedPublishedDataCountBeforeConnect = mockedBus.capturedPublishedData.get(common.infrastructure.busbridge.CONNECTION_STATE_TOPIC).length;
      
      mockedConnection.simulateConnect();
      
      var capturedPublishedDataCountAfterConnect = mockedBus.capturedPublishedData.get(common.infrastructure.busbridge.CONNECTION_STATE_TOPIC).length;
      
      expect(capturedPublishedDataCountAfterConnect - capturedPublishedDataCountBeforeConnect).to.be.eql(1);
      expect(mockedBus.capturedPublishedData.get(common.infrastructure.busbridge.CONNECTION_STATE_TOPIC)[capturedPublishedDataCountAfterConnect - 1]).to.be.eql('true');
   });
   
   it('when the connection gets into disconnected state, then false gets published on the CONNECTION_STATE_TOPIC', function() {
      var capturedPublishedDataCountBeforeConnect = mockedBus.capturedPublishedData.get(common.infrastructure.busbridge.CONNECTION_STATE_TOPIC).length;
      
      mockedConnection.simulateDisconnect();
      
      var capturedPublishedDataCountAfterConnect = mockedBus.capturedPublishedData.get(common.infrastructure.busbridge.CONNECTION_STATE_TOPIC).length;
      
      expect(capturedPublishedDataCountAfterConnect - capturedPublishedDataCountBeforeConnect).to.be.eql(1);
      expect(mockedBus.capturedPublishedData.get(common.infrastructure.busbridge.CONNECTION_STATE_TOPIC)[capturedPublishedDataCountAfterConnect - 1]).to.be.eql('false');
   });
   
   it('a publication, which is in the list of topics to transmit, gets transmitted to the other bus', function() {
      var publicationTopic = 'dagobert.totalcash';
      var publicationData = 7109;
      
      givenABusBridgeWhichTransmits([publicationTopic]);
      
      mockedBus.simulatePublication(publicationTopic, publicationData);

      expect(mockedConnection.capturedSentMessages.length).to.be.eql(1);
      expect(mockedConnection.capturedSentMessages[0]).to.be.eql({type:'PUBLICATION',topic:publicationTopic,data:publicationData});
   });
   
   it('only publications, which are in the list of topics to transmit, get transmitted to the other bus', function() {
      var topic1 = 'dagobert.totalcash';
      var topic2 = 'temperature';
      var data1 = 7109;
      var data2 = 22.9;
      
      givenABusBridgeWhichTransmits([topic1, topic2]);
      
      mockedBus.simulatePublication(topic1, data1);
      mockedBus.simulatePublication('another.topic', 'some data');
      mockedBus.simulatePublication(topic2, data2);

      expect(mockedConnection.capturedSentMessages.length).to.be.eql(2);
      expect(mockedConnection.capturedSentMessages[0]).to.be.eql({type:'PUBLICATION',topic:topic1,data:data1});
      expect(mockedConnection.capturedSentMessages[1]).to.be.eql({type:'PUBLICATION',topic:topic2,data:data2});
   });
   
   it('a command, which is in the list of topics to transmit, gets transmitted to the other bus', function() {
      var commandTopic = 'dagobert/cmds';
      var commandData = 'do it now!';
      
      givenABusBridgeWhichTransmits([commandTopic]);
      
      mockedBus.simulateCommand(commandTopic, commandData);

      expect(mockedConnection.capturedSentMessages.length).to.be.eql(1);
      expect(mockedConnection.capturedSentMessages[0]).to.be.eql({type:'COMMAND',topic:commandTopic,data:commandData});
   });

   it('only commands, which are in the list of topics to transmit, get transmitted to the other bus', function() {
      var commandTopic1 = 'dagobert.totalcash';
      var commandTopic2 = 'temperature';
      var commandData1 = 7109;
      var commandData2 = 22.9;
      
      givenABusBridgeWhichTransmits([commandTopic1, commandTopic2]);
      
      mockedBus.simulateCommand(commandTopic1, commandData1);
      mockedBus.simulateCommand('another.topic', 'some data');
      mockedBus.simulateCommand(commandTopic2, commandData2);

      expect(mockedConnection.capturedSentMessages.length).to.be.eql(2);
      expect(mockedConnection.capturedSentMessages[0]).to.be.eql({type:'COMMAND',topic:commandTopic1,data:commandData1});
      expect(mockedConnection.capturedSentMessages[1]).to.be.eql({type:'COMMAND',topic:commandTopic2,data:commandData2});
   });

   it('sending commands and publications on the same topic', function() {
      var commonTopic = '/the/same/topic/for/commands/and/publiscations';
      var commandData = {cmdName: 'createInvoice'};
      var publicationData = {lastPrintedInvoiceId: 12345};
      
      givenABusBridgeWhichTransmits([commonTopic]);
      
      mockedBus.simulateCommand(commonTopic, commandData);
      mockedBus.simulatePublication(commonTopic, publicationData);

      expect(mockedConnection.capturedSentMessages.length).to.be.eql(2);
      expect(mockedConnection.capturedSentMessages[0]).to.be.eql({type:'COMMAND',topic:commonTopic,data:commandData});
      expect(mockedConnection.capturedSentMessages[1]).to.be.eql({type:'PUBLICATION',topic:commonTopic,data:publicationData});
   });
   
   it('the data of a received publication get published locally', function() {
      var topic = 'donald.duck.age';
      var data = 27;
      var message = common.infrastructure.busbridge.MessageFactory.createPublicationMessage(topic, data);
      
      mockedConnection.simulateReceivedMessage(message);
      
      expect(mockedBus.capturedPublishedData.get(topic).length).to.be.eql(1);
      expect(mockedBus.capturedPublishedData.get(topic)[0]).to.be.eql(data);
   });

   it('the data of a received command get published locally', function() {
      var topic = '/my/command/topic';
      var data = {dateOfBirth:'14.03.1971'};
      var message = common.infrastructure.busbridge.MessageFactory.createCommandMessage(topic, data);
      
      mockedConnection.simulateReceivedMessage(message);
      
      expect(mockedBus.capturedCommands.get(topic).length).to.be.eql(1);
      expect(mockedBus.capturedCommands.get(topic)[0]).to.be.eql(data);
   });
});  