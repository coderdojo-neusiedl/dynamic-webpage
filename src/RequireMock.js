/* global window */

/*
 * Mocking the global function require, which gets used by node.js to 
 * load necessary modules, is necessary because some modules get used
 * by a browser and the server (node.js).
*/
window.require = function(filename) {};