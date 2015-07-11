var Set = require('./set.js');

var Root = function(){
	this.types = [];
	this.records = [];
	this.tests = [];
	this.typeLabels = [];
	this.IDs = {};
	this.hasType = function(type){
		return this.typeLabels.indexOf(type) !== -1;
	}
}

Root.prototype.hasID = function(id, type){
	return this.IDs[type] !== undefined && this.IDs[type].indexOf(id) !== -1;
}

Root.prototype.storeID = function(id, type){
	this.IDs[type] = this.IDs[type] || [];
	this.IDs[type].push(id);
}

Root.prototype.insertType = function(type){
	this.types.push(type);
	this.typeLabels.push(type.label);
}

Root.prototype.getType = function(type){
	for(var i = 0; i < this.types.length; i++){
		if(this.types[i].label === type){
			return this.types[i];
		}
	}
}

Root.prototype.getRecordsForType = function(type){
	var result = [];
	for(var i = 0; i < this.records.length; i++){
		if(this.records[i].type === type){
			result.push(this.records[i]);
		}
	}
	return result;
}

var Tree = function(){
	this.data = {};
	this.testKeys = new Set();
}

Tree.prototype.insert = function(child){
	child = child || new Tree();
	this.children.push( child );
	return child;
}

Tree.prototype.set = function(key, value){
	this.data[key] = value;
}

Tree.prototype.add = function(key, value){
	if(this.data[key] === undefined){
		this.data[key] = [value];
	} else {
		this.data[key].push(value)
	}
}

Tree.prototype.get = function(key){
	return this.data[key];
}

Tree.prototype.size = function(){
	return this.children.length;
}

Tree.prototype.hasKey = function(key){
	var keys = Object.keys(this.data);
	return keys.indexOf(key) !== -1;
}

module.exports = {
	Tree: Tree,
	Root: Root
}