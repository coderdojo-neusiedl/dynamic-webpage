/* global common, assertNamespace, io */

require('../../../NamespaceUtils.js');
require('./MessageFactory.js');
require('./connection/ClientSocketIoConnection.js');
require('./connection/ServerSocketIoConnection.js');

assertNamespace('common.infrastructure.busbridge');

common.infrastructure.busbridge.CONNECTION_STATE_TOPIC = 'busbridge.connected';

/**
 * A BusBridge connects two busses by using a transport media (e.g. socket.io)
 * and it has the following responsibilities:
 *    1. transmit all commands and publications, the bridge is interested in, to the other bus
 *    2. publish all commands and publications received from the other bus
 *    3. publish the connection state of the bridge locally on the topic: 
 *            common.infrastructure.busbridge.CONNECTION_STATE_TOPIC
 */

/**
 * constructor for a BusBridge.
 *
 * bus                        the instance of the local common.infrastructure.bus.Bus
 * topicsToTransmit           an Array of topics that should get transmitted via the bridge
 * connectionFactoryFunction  a function that returns either a ClientSocketIoConnection or a ServerSocketIoConnection 
 *                              (located in common.infrastructure.busbridge.connection).
 */
common.infrastructure.busbridge.BusBridge = function BusBridge(bus, topicsToTransmit, connectionFactoryFunction) {

   var onConnectCallback = function onConnectCallback() {
      bus.publish(common.infrastructure.busbridge.CONNECTION_STATE_TOPIC, 'true');
   };
   
   var onDisconnectCallback = function onDisconnectCallback() {
      bus.publish(common.infrastructure.busbridge.CONNECTION_STATE_TOPIC, 'false');
   };
   
   var onMessageCallback = function onMessageCallback(message) {
      if (message.type === 'PUBLICATION') {
         bus.publish(message.topic, message.data);
      } else if (message.type === 'COMMAND') {
         bus.sendCommand(message.topic, message.data);
      }
   };

   var connection = connectionFactoryFunction(onConnectCallback, onDisconnectCallback, onMessageCallback);
   
	bus.publish(common.infrastructure.busbridge.CONNECTION_STATE_TOPIC, 'false');

   topicsToTransmit.forEach(function(topic) {
      bus.subscribeToPublication(topic, function(data) {
			var message = common.infrastructure.busbridge.MessageFactory.createPublicationMessage(topic, data);
			connection.send(message);
      });
      bus.subscribeToCommand(topic, function(data) {
			var message = common.infrastructure.busbridge.MessageFactory.createCommandMessage(topic, data);
			connection.send(message);
      });
   });
};
 