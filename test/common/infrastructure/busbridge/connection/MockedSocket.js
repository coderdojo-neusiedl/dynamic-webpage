/* global Map */

module.exports = function MockedSocket() {
   this.capturedCallbacks = new Map();
   this.capturedEmittedMessages = [];
   this.capturedEventsToRemove = [];
   this.onInvocations = 0;
   var thisInstance = this;
   
   this.on = function on(eventtype, callback) {
      this.onInvocations++;
      this.capturedCallbacks.set(eventtype, callback);
   };
   
   this.emit = function emit(eventtype, data) {
      this.capturedEmittedMessages[this.capturedEmittedMessages.length] = {eventtype: eventtype, data: data};
   };
   
   this.removeListener = function removeListener(eventtype) {
      this.capturedEventsToRemove[this.capturedEventsToRemove.length] = eventtype;
   };
   
   var triggerEvent = function triggerEvent(eventtype) {
      var callback = thisInstance.capturedCallbacks.get(eventtype);
      
      if (callback) {
         callback();
      }
   };
   
   this.simulateConnectEvent = function simulateConnectEvent() {
      triggerEvent('connect');
   };
   
   this.simulateDisconnectEvent = function simulateDisconnectEvent() {
      triggerEvent('disconnect');
   };
   
   this.simulateMessageEvent = function simulateMessageEvent(message) {
      var callback = this.capturedCallbacks.get('message');
      
      if (callback) {
         callback(JSON.stringify(message));
      }
   };
};
