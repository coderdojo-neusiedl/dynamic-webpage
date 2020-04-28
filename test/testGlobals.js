/* global global */
'use strict';
var fs = require('fs');

global.sinon = require('sinon');
global.expect = require('expect.js');
global.expect = require('sinon-expect').enhance(global.expect, global.sinon, 'was');

global.cash = {};
global.common = {};