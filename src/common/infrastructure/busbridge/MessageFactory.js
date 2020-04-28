/* global common, assertNamespace */

require('../../../NamespaceUtils.js');

assertNamespace('common.infrastructure.busbridge');

common.infrastructure.busbridge.MessageFactory = {
   
   createPublicationMessage: function createPublicationMessage(topic, data) {
      return {
         type: 'PUBLICATION',
         topic: topic,
         data: data
      };
   },
   
   createCommandMessage: function createCommandMessage(topic, data) {
      return {
         type: 'COMMAND',
         topic: topic,
         data: data
      };
   }
};
