#include "functions.h"
#include <stdio.h>

int greaterThan(struct Value a, struct Value b){
	if(a.type == 's' && b.type == 'n'){
		int len = a.data.string.length;
		int val = b.data.number;
		return len > val ? 1 : 0;
	} 
	else if(a.type == 'n' && b.type == 'n'){
		int val = a.data.number;
		int cmp = b.data.number;
		return val > cmp ? 1 : 0;	
	} else {
		printf("Error: comparator incompatible with property type\n");
		return 2;
	}
}

int lessThan(struct Value a, struct Value b){
	if(a.type == 's' && b.type == 'n'){
		int len = a.data.string.length;
		int val = b.data.number;
		return len > val ? 1 : 0;
	} 
	else if(a.type == 'n' && b.type == 'n'){
		int val = a.data.number;
		int cmp = b.data.number;
		return val > cmp ? 1 : 0;	
	} else {
		printf("Error: comparator incompatible with property type\n");
		return 2;
	}
}

int equalTo(struct Value a, struct Value b){
	if(a.type == 's' && b.type == 's'){
		return !strcmp(a.data.string.body, b.data.string.body) ? 1 : 0;
	}
	else if(a.type == 's' && b.type == 'n'){
		int len = a.data.string.length;
		int val = b.data.number;
		return len == val ? 1 : 0;
	}
	else if(a.type == 'n' && b.type == 'n'){
		int val = a.data.number;
		int cmp = b.data.number;
		return val == cmp ? 1 : 0;
	} else {
		printf("Error: comparator incompatible with property type\n");
		return 2;
	}
}
