var fs = require('fs');
var data = {};

module.exports = function(tree, name){
	var output = '#include <stdio.h>\n';
	output += '#include \"functions.h\"\n\n';
	output += '#define GREEN   "\x1b[32m"\n';
	output += '#define YELLOW  "\x1b[33m"\n';
	output += '#define BLUE    "\x1b[34m"\n';
	output += '#define RED    "\x1b[31m"\n';
	output += '#define RESET   "\x1b[0m"\n';
	output = writeTypes(tree, output)
	output += 'int main(){ \n';
	output = writeRecords(tree, output);
	output = writeTests(tree, output);
	output += 'return 0;\n }\n';
	fs.writeFileSync('output.c', output);
}

function writeTypes(tree, output){
	var typeData = tree.types;
	forEach(typeData, function(type){
		data[type.label] = { idx: 0 };
		output += 'struct '+type.label+' {\n';
		output += '    char id[20];\n';
		var keys = Object.keys(type.data);
		forEach(keys, function(key){
			output += '    struct Value '+key+';\n';
		})
		output += '};\n';
	})
	return output;
}

function writeRecords(tree, output){
	var typeData = tree.types;
	forEach(typeData, function(type){
		var records = tree.getRecordsForType(type.label);
		data[type.label].idx = records.length;
		output += 'struct '+type.label+' '+type.label+'_records['+records.length+'] = { ';
		forEach(records, function(record, idx, type){
			var typeForRecord = type;
			var type = typeForRecord.label;
			id = record.id;
			output += '{ \"'+id+'\"' + ', \n';
			var keys = Object.keys(typeForRecord.data);
			forEach(keys, function(key, idx){
				var valType = typeForRecord.get(key);
				var value = record.get(key);
				if(valType === 'string'){
					output += '{ { .string = { \"'+value+'\", '+value.length+' }}, ';
					output += '\'s\', \"'+key+'\" }'
				} else {
					output += '{ { .number = '+value+' }, ';
					output += '\'n\', \"'+key+'\" }'
				}
				if(idx !== keys.length-1){
					output +=',\n'
				} else {
					output += '\n'
				}
			})
			if(idx !== records.length-1){
				output += '},\n';
			} else {
				output += '}';
			}
		}, type)
		output += '};\n'
	})
	return output;
}

function writeTests(tree, output){
	forEach(tree.tests, function(test, idx){
		var key = Object.keys(test.data)[0];
		var type = tree.getType(test.type);
		var propType = type.get(key);
		console.log(test, key)
		var cmp = test.get(key)[1];
		var comparator = test.get(key)[0];
		if(propType === 'string'){
			output += 'struct Value cmpVal_'+comparator+'_'+key+' = { { .string = { \"'+cmp+'\", '+cmp.length+'}}, \'s\', "test" };\n';
		} else {
			output += 'struct Value cmpVal_'+comparator+'_'+key+' = { { .number = '+cmp+' }, \'n\', "test" };\n';
		}
		// { { .string = { "John", 4 }}, 's', "name" }
		output += 'for(int i = 0; i < '+data[test.type].idx+'; i++){\n';
		if(comparator === 'eq'){

			output += 'int result = equalTo('+test.type+'_records[i].'+key+', cmpVal_'+comparator+'_'+key+');\n';
		}
		else if(comparator === 'lt'){
			output += 'int result = lessThan('+test.type+'_records[i].'+key+', cmpVal_'+comparator+'_'+key+');\n';
		}
		else if(comparator === 'gt'){
			output += 'int result = greaterThan('+test.type+'_records[i].'+key+', cmpVal_'+comparator+'_'+key+');\n';
		}
		output += 'if(result == 1){ printf(BLUE"'+test.type+'\"RESET\" with id \"RED\"%s\"RESET\" passes test \"GREEN\"'+test.name+'\"RESET\"\\n", '+test.type+'_records[i].id); }\n';
		output += '}\n';
	})
	return output;
}

function forEach(arr, fn, item){
	for(var i = 0, l = arr.length; i < l; i++){
		fn(arr[i], i, item);
	}
}

