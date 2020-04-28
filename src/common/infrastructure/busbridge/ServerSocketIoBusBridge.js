/* global common, assertNamespace, io */

require('../../../NamespaceUtils.js');
require('./BusBridge.js');
require('./connection/ServerSocketIoConnection.js');

assertNamespace('common.infrastructure.busbridge');

/**
 * constructor for a bus bridge used where the https server is running.
 *
 * bus               the local bus instance
 * topicsToTransmit  an Array of topics that should get transmitted via the bridge
 * io                the socket.io instance
 */
common.infrastructure.busbridge.ServerSocketIoBusBridge = function ServerSocketIoBusBridge(bus, topicsToTransmit, io) {
   
   var serverConnectionFactoryFunction = function serverConnectionFactoryFunction(onConnectCallback, onDisconnectCallback, onMessageCallback) {
      return new common.infrastructure.busbridge.connection.ServerSocketIoConnection(io, onConnectCallback, onDisconnectCallback, onMessageCallback);
   };

   this.prototype = new common.infrastructure.busbridge.BusBridge(bus, topicsToTransmit, serverConnectionFactoryFunction);
};
