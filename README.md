# Arbitrator
An interpreted language for rule-based matching on data sets

Arbitrator is a simple language with three parts: types, records, and rules. When you run the code, Arbitrator will tell you which records pass the tests defined by your rules.

## Types
A type defines a schema for a certain class of record. Types have a label followed by a set of properties with data-types for each property. The format consists of the word type followed by the label in parenthesis, and then property name/type pairs divided by colons. Currently properties can have type string, number or list.

```code
type(Person){
  name: string
  age: number
  hobbies: list
}
type(Route){
  name: string
  length: number
  intersections: list
}
```
## Records
A record is a concrete instance of a type. A record should have a property and a value for each property defined in the type. The declaration consists of the type name, the id of the record in parenthesis, and then properties and value in brackets.

```code
Person(1){
  name: Bob
  age: 30
  hobbies: Swimming, Dancing
}
Person(2){
  name: Adam
  age: 24
  hobbies: Singing, Running
}
```

##Rules
A rule is a test that returns matches when the program is run. A rule consists of the word match followed by the type implicated in the rule and the name of the rule in parenthesis. The body of the rule, the part in brackets, consists of a property and a constraint expression separated by a colon.
###Constraint Expressions
Constraint expressions are composed of a function and a value. The value type of the value given to the constrain function defaults to the value type of the property as defined in the type declaration, but this can be overrided by providing a value type as a second argument to the constraint function.    
gt() -- greater than    
lt() -- less than    
eq() -- equal to     
incl() -- including; list includes this value    
excl() -- excluding; list doesn't include this value    
all() -- all; list contains all these values    

Here are some examples:
```code
match(Person, teen){
  age: lt(20)
  age: gt(12)
}
match(Person, Scholar){
  hobbies: all(Art, Science, Literature)
  hobbies: excl(Debauchery)
}
match(Person, long_name){
  name: gt(15, number)
}
```
Notice how we tell the interpreter that the 15 is a number. This is necessary because the property "age" in the type "Person" will default to string. Running number matches against a string will compare against number of characters.

##Running the code
Running an Arbitrator script is easy: put your types, records and rules in a .txt file and run like this:
```shell
node arbitrate.js myscript
./myscript
```
