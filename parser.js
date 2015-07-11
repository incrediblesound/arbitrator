var Root = require('./tree.js').Root;
var Tree = require('./tree.js').Tree;
var root = new Root();
var currentType;
var currentRecord;
var currentRule;
var marker;

module.exports = function(state){
	return process(state);
}

function process(state){
	if(state.status === 'out'){
		marker = state.getValue(); // either "type", <typename>, or "match"
		if(state.done){
			return root;
		}
		else if(marker === 'type'){
			state.nextValue();
			var label = state.getValue();
			currentType = new Tree();
			currentType['label'] = label;
			state.status = 'inType';
			state.nextBracket()
			return process(state);
		}
		else if(marker === 'match'){
			state.nextValue();
			var type = state.getValue();
			state.nextValue();
			var name = state.getValue();
			currentRule = new Tree();
			currentRule['type'] = type;
			currentRule['name'] = name;
			state.status = 'inRule';
			state.nextBracket();
			return process(state);
		}
		else {
			if(!root.hasType(marker)){
				console.log('Error: term \"'+marker+'\" not recognized.');
			} else {
				state.nextValue();
				var id = state.getValue();
				currentRecord = new Tree();
				currentRecord['id'] = id;
				if(root.hasID(id, marker)){
					console.log('Error: duplicate ID -> '+id+'.');
					return false;
				} else {
					root.storeID(id, marker);
				}
				currentRecord['type'] = marker;
				state.status = 'inRecord';
				state.nextBracket();
				return process(state);
			}
		}
	}
	else if(state.status === 'inType'){
		var typeBody = state.getBody();
		typeBody = typeBody.split(/\n|\t|\n\t/);
		typeBody = state.cleanArray(typeBody);
		for(var i = 0, l = typeBody.length; i < l; i++){
			var pair = state.makeArray(typeBody[i], ':');
			currentType.set(pair[0], pair[1]);
		}
		root.insertType(currentType);
		state.status = 'out';
		state.nextValue();
		return process(state);
	}
	else if(state.status === 'inRecord'){
		var recordBody = state.getBody();
		recordBody = recordBody.split(/\n|\t|\n\t/);
		recordBody = state.cleanArray(recordBody);
		var typeForRecord = root.getType(currentRecord.type);
		for(var i = 0, l = recordBody.length; i < l; i++){
			var pair = state.makeArray(recordBody[i], new RegExp(/\:|,/), true);
			if(!typeForRecord.hasKey(pair[0])){
				console.log('Error: record of type '+currentRecord.type+
					' doesn\'t have a field called '+pair[0]+'.');
				return;
			}
			currentRecord.set(pair[0], pair[1]);
		}
		root.records.push(currentRecord);
		state.status = 'out';
		state.nextValue();
		return process(state);
	}
	else if(state.status === 'inRule'){
		var ruleBody = state.getBody();
		ruleBody = ruleBody.split(/\n|\t|\n\t/);
		ruleBody = state.cleanArray(ruleBody);
		var typeForRule = root.getType(currentRule.type);
		for(var i = 0, l = ruleBody.length; i < l; i++){
			var pair = state.makeArray(ruleBody[i], ':');
			if(!typeForRule.hasKey(pair[0])){
				console.log('Error: record of type '+currentRule.type+
					' doesn\'t have a field called '+pair[0]+'.');
				return;
			}
			var expression = pair[1];
			expression = state.makeArray(expression, new RegExp(/\(|\)|,/));
			if(expression.length > 2){
				var temp = expression;
				expression = [temp.shift(), []];
				while(temp.length){
					expression[1].push(temp.shift());
				}
			}
			currentRule.testKeys.addValue(pair[0]);
			currentRule.add(pair[0], expression);
		}
		root.tests.push(currentRule);
		state.status = 'out';
		state.nextValue();
		return process(state);
	}
}