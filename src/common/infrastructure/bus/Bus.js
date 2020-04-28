/* global common, assertNamespace */

require('../../../NamespaceUtils.js');

assertNamespace('common.infrastructure.bus');

/**
 * A Bus enables components to communicate with each other by using publications and commands bound to topics. 
 * All the comminicating components need to know are the used topics -> they do not need to know each other.
 *
 * A topic (e.g. '/webapp/client/selectedCustomers') is a unique string that identifies the command and/or publication. 
 * The same topic can be used for commands and publications.
 *
 * When a component publishes some data on a topic, all components which subscribed to publications on that topic, will get
 * the published data. The bus remembers the last published data and provides them to components that subscribe later (late join).
 *
 * When a component sends a command on a topic, all components which subscribed to commands on that topic, will get
 * the data of the command. The bus does NOT remember command data -> later subscribing components will not get them (one shot).
 */
common.infrastructure.bus.Bus = (function () {

   var Bus = function Bus() {
      
      var publicationCallbacksPerTopic = {};
      var lastPublishedDataPerTopic = {};
      var commandCallbacksPerTopic = {};

      var add = function add(callback) {
         return { 
            relatedTo: function relatedTo(topic) {
               return {
                  to: function to(map) {
                     if (map[topic] === undefined) {
                        map[topic] = [];
                     }
                     var set = map[topic];
                     set[set.length] = callback;
                  }
               };
            }
         };
      }; 

      var invokeAllCallbacksOf = function invokeAllCallbacksOf(map) {
         return {
            ofType: function ofType(topic) {
               return {
                  withData: function withData(data) {
                     if (map[topic] !== undefined) {
                        map[topic].forEach(function(callback) {
                           callback(data);
                        });
                     }
                  }
               };
            }
         };
      };
      
      this.subscribeToPublication = function subscribeToPublication(topic, callback) {
         if(topic && (typeof callback === 'function')) {
            add(callback).relatedTo(topic).to(publicationCallbacksPerTopic);
            
            var lastPublishedData = lastPublishedDataPerTopic[topic];
            
            if (lastPublishedData) {
               callback(lastPublishedData);
            }
         }
      };
      
      this.subscribeToCommand = function subscribeToCommand(topic, callback) {
         if (topic && (typeof callback === 'function')) {
            add(callback).relatedTo(topic).to(commandCallbacksPerTopic);
         }
      };
      
      this.publish = function publish(topic, data) {
         lastPublishedDataPerTopic[topic] = data;
         invokeAllCallbacksOf(publicationCallbacksPerTopic).ofType(topic).withData(data);
      };
      
      this.sendCommand = function sendCommand(topic, data) {
         invokeAllCallbacksOf(commandCallbacksPerTopic).ofType(topic).withData(data);
      };
   };
   
   return Bus;
}());