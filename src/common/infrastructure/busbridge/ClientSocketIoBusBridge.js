/* global common, assertNamespace, io */

require('../../../NamespaceUtils.js');
require('./BusBridge.js');
require('./connection/ClientSocketIoConnection.js');

assertNamespace('common.infrastructure.busbridge');

/**
 * constructor for a bus bridge typically used in the browser.
 *
 * bus               the local bus instance
 * topicsToTransmit  an Array of topics that should get transmitted via the bridge
 * io                the socket.io instance
 */
common.infrastructure.busbridge.ClientSocketIoBusBridge = function ClientSocketIoBusBridge(bus, topicsToTransmit, io) {
   
   var clientConnectionFactoryFunction = function serverConnectionFactoryFunction(onConnectCallback, onDisconnectCallback, onMessageCallback) {
      return new common.infrastructure.busbridge.connection.ClientSocketIoConnection(io(), onConnectCallback, onDisconnectCallback, onMessageCallback);
   };

   this.prototype = new common.infrastructure.busbridge.BusBridge(bus, topicsToTransmit, clientConnectionFactoryFunction);
};
