var fs = require('fs');
var commander = require('commander');
var parser = require('./parser.js');
var compiler = require('./compiler.js');
var state = require('./state.js')();

commander.parse(process.argv);
var name = commander.args[0];
var fileName = './' +name+ '.txt';
state.text = fs.readFileSync(fileName, 'utf-8').toString();

var tree = parser(state);
compiler(tree, name);