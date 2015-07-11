var Set = function(){
	this.values = [];
	this.current = 0;
}

Set.prototype.contains = function(value){
	return this.values.indexOf(value) !== -1
}

Set.prototype.addValue = function(value){
	var setHasValue = this.contains(value);
	if(!setHasValue){
		this.values.push(value);
	}
}

Set.prototype.get = function(idx){
	return this.values[idx];
}

Set.prototype.all = function(){
	return this.values.slice();
}

module.exports = Set;