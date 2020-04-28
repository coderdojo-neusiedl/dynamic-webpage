/* global global, common, Map */

require(global.PROJECT_SOURCE_ROOT_PATH + '/common/infrastructure/bus/Bus.js');

var bus;
var capturedPublications;
var capturedCommands;

function valueIsAnObject(val) {
   if (val === null) { return false;}
   return ( (typeof val === 'function') || (typeof val === 'object') );
}

var givenASubscriptionForPublication = function givenASubscriptionForPublication(topic) {
   
   bus.subscribeToPublication(topic, function(data) {
      if (!capturedPublications.has(topic)) {
         capturedPublications.set(topic, []);
      }
      
      var capturedData = capturedPublications.get(topic);
      capturedData[capturedData.length] = data;
   });
};

var givenASubscriptionForCommand = function givenASubscriptionForCommand(topic) {
   
   bus.subscribeToCommand(topic, function(data) {
      if (!capturedCommands.has(topic)) {
         capturedCommands.set(topic, []);
      }
      
      var capturedData = capturedCommands.get(topic);
      capturedData[capturedData.length] = data;
   });
};

var setup = function setup() {
   capturedPublications = new Map();
   capturedCommands = new Map();
   bus = new common.infrastructure.bus.Bus();
};

describe('Bus', function() {
	
   beforeEach(setup);
   
   it('creating an instance of a bus is an instance/object', function() {
      
      expect(valueIsAnObject(bus)).to.be.eql(true);
   });
   
   it('the data of a publication get notified_A', function() {
      
      var topic = '/my/topic';
      var data = 'some data';
      
      givenASubscriptionForPublication(topic);
      
      bus.publish(topic, data);
      
      expect(capturedPublications.get(topic).length).to.be.eql(1);
      expect(capturedPublications.get(topic)[0]).to.be.eql(data);
   });
   
   it('the data of a publication get notified_B', function() {
      
      var topic = '/my/topic';
      var object = {id: 1234, name:'Thomas Ederer'};
      
      givenASubscriptionForPublication(topic);
      
      bus.publish(topic, object);
      
      expect(capturedPublications.get(topic).length).to.be.eql(1);
      expect(capturedPublications.get(topic)[0]).to.be.eql(object);
   });
   
   it('a publication subscription to an undefined topic gets ignored', function() {
      
      var topic;
      var object = {id: 1234, name:'Thomas Ederer'};
      
      givenASubscriptionForPublication(topic);
      
      bus.publish(topic, object);
      
      expect(capturedPublications.has(topic)).to.be.eql(false);
   });
   
   it('a publication subscription with an undefined callback gets ignored', function() {
      
      var topic = 'aTopic';
      var object = {id: 1234, name:'Thomas Ederer'};
      
      bus.subscribeToPublication(topic, undefined);
      
      bus.publish(topic, object);
      
      expect(capturedPublications.has(topic)).to.be.eql(false);
   });
   
   it('a publication subscription with an callback that is not a function gets ignored', function() {
      
      var topic = 'aTopic';
      var object = {id: 1234, name:'Thomas Ederer'};
      
      bus.subscribeToPublication(topic, {value:'bla'});
      
      bus.publish(topic, object);
      
      expect(capturedPublications.has(topic)).to.be.eql(false);
   });
   
   it('the data of a publication get notified only for the corresponding topic', function() {
      
      var topic1 = '/my/topic1';
      var topic2 = '/my/topic2';
      var data1 = 'some data1';
      var data2 = 'some data2';
      
      givenASubscriptionForPublication(topic1);
      givenASubscriptionForPublication(topic2);
      
      bus.publish(topic1, data1);
      bus.publish(topic2, data2);
      
      expect(capturedPublications.get(topic1).length).to.be.eql(1);
      expect(capturedPublications.get(topic2).length).to.be.eql(1);
      expect(capturedPublications.get(topic1)[0]).to.be.eql(data1);
      expect(capturedPublications.get(topic2)[0]).to.be.eql(data2);
   });
   
   it('the data of a publication get notified to more than one subscriber of one topic', function() {
      
      var topic = '/my/topic1';
      var data = 'donald 123';
      
      givenASubscriptionForPublication(topic);
      givenASubscriptionForPublication(topic);
      
      
      bus.publish(topic, data);
      
      expect(capturedPublications.get(topic).length).to.be.eql(2);
      expect(capturedPublications.get(topic)[0]).to.be.eql(data);
      expect(capturedPublications.get(topic)[1]).to.be.eql(data);
   });
   
   it('a publication on a different topic does not influence a subscription on another topic', function() {
      
      var topic1 = '/my/topic1';
      var topic2 = '/my/topic2';
      
      bus.publish(topic1, 'a test');
      
      givenASubscriptionForPublication(topic2);
      
      expect(capturedPublications.has(topic2)).to.be.eql(false);
   });
   
   it('the current data of a publication get notified to a subscriber that subscribed after the data were published (late joining behaviour)', function() {
      
      var topic = '/late/join/test';
      var data = 'deliver me';
      
      bus.publish(topic, data);
      
      givenASubscriptionForPublication(topic);
      
      expect(capturedPublications.get(topic).length).to.be.eql(1);
      expect(capturedPublications.get(topic)[0]).to.be.eql(data);
   });
    
   it('the data of a command get notified_A', function() {
      
      var topic = '/my/topic';
      var data = 'some data';
      
      givenASubscriptionForCommand(topic);
      
      bus.sendCommand(topic, data);
      
      expect(capturedCommands.get(topic).length).to.be.eql(1);
      expect(capturedCommands.get(topic)[0]).to.be.eql(data);
   });
   
      
   it('the data of a command get notified_B', function() {
      
      var topic = '/my/topic';
      var object = {id: 1234, name:'Thomas Ederer'};
      
      givenASubscriptionForCommand(topic);
      
      bus.sendCommand(topic, object);
      
      expect(capturedCommands.get(topic).length).to.be.eql(1);
      expect(capturedCommands.get(topic)[0]).to.be.eql(object);
   });
   
   
   it('a command subscription to an undefined topic gets ignored', function() {
      
      var topic;
      var object = {id: 1234, name:'Thomas Ederer'};
      
      givenASubscriptionForCommand(topic);
      
      bus.sendCommand(topic, object);
      
      expect(capturedCommands.has(topic)).to.be.eql(false);
   });
   
   
   it('a command subscription with an undefined callback gets ignored', function() {
      
      var topic = 'aCommandTopic';
      var object = {id: 1234, name:'Thomas Ederer'};
      
      bus.subscribeToCommand(topic, undefined);
      
      bus.sendCommand(topic, object);
      
      expect(capturedCommands.has(topic)).to.be.eql(false);
   });
   
   it('a command subscription with an callback that is not a function gets ignored', function() {
      
      var topic = 'aCommandTopic';
      var object = {id: 1234, name:'Thomas Ederer'};
      
      bus.subscribeToCommand(topic, {name:'donald'});
      
      bus.sendCommand(topic, object);
      
      expect(capturedCommands.has(topic)).to.be.eql(false);
   });
   
   
   it('the data of a command get notified only for the corresponding topic', function() {
      
      var topic1 = '/my/topic1';
      var topic2 = '/my/topic2';
      var data1 = 'some data1';
      var data2 = 'some data2';
      
      givenASubscriptionForCommand(topic1);
      givenASubscriptionForCommand(topic2);
      
      bus.sendCommand(topic1, data1);
      bus.sendCommand(topic2, data2);
      
      expect(capturedCommands.get(topic1).length).to.be.eql(1);
      expect(capturedCommands.get(topic2).length).to.be.eql(1);
      expect(capturedCommands.get(topic1)[0]).to.be.eql(data1);
      expect(capturedCommands.get(topic2)[0]).to.be.eql(data2);
   });
   
   it('the data of a command get notified to more than one subscriber of one topic', function() {
      
      var topic = '/my/topic1';
      var data = 'donald 123';
      
      givenASubscriptionForCommand(topic);
      givenASubscriptionForCommand(topic);
      
      bus.sendCommand(topic, data);
      
      expect(capturedCommands.get(topic).length).to.be.eql(2);
      expect(capturedCommands.get(topic)[0]).to.be.eql(data);
      expect(capturedCommands.get(topic)[1]).to.be.eql(data);
   });
   
   it('a command and a publication on the same topic do not influence each other', function() {
      
      var topic = '/my/topic1';
      var publicationData = {id: 'publication'};
      var commandData = {id: 'command'};
      
      givenASubscriptionForPublication(topic);
      givenASubscriptionForCommand(topic);
      
      bus.sendCommand(topic, commandData);
      bus.publish(topic, publicationData);
      
      expect(capturedCommands.get(topic).length).to.be.eql(1);
      expect(capturedPublications.get(topic).length).to.be.eql(1);
      expect(capturedCommands.get(topic)[0]).to.be.eql(commandData);
      expect(capturedPublications.get(topic)[0]).to.be.eql(publicationData);
   });
});  