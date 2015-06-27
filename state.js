module.exports = function(){
	return {
		status: 'out',
		index: 0,
		text: null,
		done: false,
		current: function(){ return this.text[this.index]; },
		advance: function(){ this.index++ },
		getValue: getValue,
		nextValue: nextValue,
		nextBracket: nextBracket,
		getBody: getBody,
		letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_',
		isLetter: isLetter,
		numbers: '1234567890',
		isNumber: isNumber,
		openBracket: compare('{'),
		closeBracket: compare('}'),
		openParen: compare('('),
		closeParen: compare(')'),
		isColon: compare(':'),
		isComma: compare(','),
		isSpace: compare(' '),
		cleanArray: cleanArray,
		makeArray: makeArray
	}
}

function compare(target){
	return function(ch){
		if(!ch){
			return this.current() === target;
		} else {
			return ch === target;
		}
	}
}
function getValue(){
	var result = '';
	while(this.isLetter(this.current()) ||
		  this.isNumber(this.current())){
		result += this.current();
		this.advance();
	}
	return result;
}

function getBody(){
	var result = '';
	while(!this.closeBracket()){
		result += this.current();
		this.advance();
	}
	return result;
}

function isLetter(ch){
	return this.letters.indexOf(ch) !== -1;
}

function isNumber(ch){
	return this.numbers.indexOf(ch) !== -1;
}

function openBracket(ch){
	return ch === this.brackets[0];
}

function closeBracket(ch){
	return ch === this.brackets[1]
}

function openParen(ch){
	return ch === this.parens[0];
}

function closeParen(ch){
	return ch === this.parens[1]
}

function nextValue(){
	while(!this.isLetter(this.current()) &&
		  !this.isNumber(this.current())){
		this.advance();
		var remaining = this.text.substring(this.index, this.text.length);
		if(remaining.length < 4){
			this.done = true;
			break;
		}
	}
}

function cleanArray(arry){
	var result = [];
	var blackList = ['{','}','',' '];
	for(var i = 0, l = arry.length; i < l; i++){
		if(blackList.indexOf(arry[i]) === -1){
			result.push(arry[i]);
		}
	}
	return result;
}

function nextBracket(){
	while(!this.openBracket(this.current())){
		this.advance();
	}
}

function makeArray(string, splitter, isProperty){
	var result;
	var array = cleanArray(string.split(splitter));
	forEach(array, function(item, idx){
		array[idx] = cleanString(item);
	})
	if(isProperty){
		result = [];
		var list = [];
		result.push(array.shift());
		forEach(array, function(item){
			list.push(item);
		})
		result.push(list);
	}
	return result === undefined ? array : result;
}

function cleanString(string){
	while(string[0] === ' '){
		string = string.substring(1);
	}
	while(string[string.length-1] === ' '){
		string = string.substring(0, string.length-1);
	}
	return string;
}

function forEach(arr, fn){
	for(var i = 0, l = arr.length; i < l; i++){
		fn(arr[i], i);
	}
}