console.log();
console.log('starting Webserver ...');
console.log();

var WebServer = require('./Webserver.js');

var webserver = new WebServer();

webserver.start();
