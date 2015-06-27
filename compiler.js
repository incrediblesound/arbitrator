var fs = require('fs');
var exec = require('child_process').exec;
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
	exec('gcc -c output.c -o output.o\n'+
		 'gcc -c functions.c -o funcs.o\n'+
		 'gcc output.o funcs.o -o '+name, function(err){
		if(err) console.log(err);
		// exec('rm -rf output.c');
		return;
	});
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
				} else if(valType === 'number') {
					output += '{ { .number = '+value+' }, ';
					output += '\'n\', \"'+key+'\" }'
				} else {
					output += '{ {.list = {'+value.length+', { '
					forEach(value, function(item, idx){
						output += '{\"'+item+'\", '+item.length+'}';
						if(idx !== value.length-1){
							output += ', ';
						}
					})
					output += '}}}, \'l\', \"'+key+'\" }';
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
		var testData = test.get(key);
		var type = tree.getType(test.type);
		var cmp = testData[1];
		var comparator = testData[0];
		var propType = testData[2] || type.get(key);
		if(propType === 'string' || ( propType === 'list' && !Array.isArray(cmp) )){
			output += 'struct Value cmpVal_'+comparator+'_'+key+' = { { .string = { \"'+cmp+'\", '+cmp.length+'}}, \'s\', "test" };\n';
		} else if(propType === 'number') {
			output += 'struct Value cmpVal_'+comparator+'_'+key+' = { { .number = '+cmp+' }, \'n\', "test" };\n';
		} else {
			output += 'struct Value cmpVal_'+comparator+'_'+key+' = { { .list = {'+cmp.length+', {';
			forEach(cmp, function(item, idx){
				output += '{\"'+item+'\", '+item.length+'}';
				if(idx !== cmp.length-1){
					output += ', ';
				}
			})
			output += '}}}, \'l\', "test" };\n';
		}
		// { { .string = { "John", 4 }}, 's', "name" }
		output += 'for(int i = 0; i < '+data[test.type].idx+'; i++){\n';
		var func = funcMap(comparator);
		output += 'int result = '+func+'('+test.type+'_records[i].'+key+', cmpVal_'+comparator+'_'+key+');\n';
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

function funcMap(abbreviation){
	var map = {
		eq: 'equalTo',
		lt: 'lessThan',
		gt: 'greaterThan',
		excl: 'excluding',
		incl: 'including',
		all: 'all'
	}
	return map[abbreviation];
}