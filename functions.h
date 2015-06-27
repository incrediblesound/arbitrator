#ifndef FUNCTIONS_H_
#define FUNCTIONS_H_

#include "structures.h"
#include <string.h>

int greaterThan(struct Value a, struct Value b);
int lessThan(struct Value a, struct Value b);
int equalTo(struct Value a, struct Value b);
int excluding(struct Value list, struct Value b);
int including(struct Value list, struct Value b);
int all(struct Value list, struct Value list_b);

#endif