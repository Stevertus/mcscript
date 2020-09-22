---
sidebar: auto
footer: MIT Licensed | Copyright © 2020 Stevertus
prev: /files/
next: /ides/
---

# 4) Minecraft Script Syntax

The code is written in files with the extension .mcscript. It is recommended to manage the files and to highlight the syntax in a code editor (IDE). explore more [here](#ide).

Unlike mcfunction, each command is injected with a "/" or "run:".

Comments are announced with "//", if comments should also appear in the new file with "#"

Blank lines and skipping lines are ignored.  
If a blank line is desired in the mcfunction, express this with a '#' without a comment.  
Two blank lines are reached with "##".

A comment across multiple lines can be expressed with:

```
/*
 comment
*/
```

## 4.1 Command Grouping / Wrapping

> `[subcommand]([argument]){ [wrapped actions] }`

"as, at, positioned,align,in,dimension,rotated,anchored" can be grouped together:

    as(@a){
    	/commands 	=> /execute positioned ~ ~ ~ run command
    }

The Argument / Arguments in the brackets have to be a string! (with ' ' or " ")
It is also possible to use `asat()` for this:

```
asat(@s){
    /commands => execute as @s at @s run commands
}
```

"Groups can be listed like so:

    as(@p), at(@s), positioned('~ ~1 ~'){
    	/say command
    }
    ==> /execute as @p at @s positioned ~ ~-1 ~ run say command

    // also with if
    as(@p), at(@s), positioned('~ ~1 ~'), if(entity @s[tag=mytag]){
    	/say command
    }
    ==> /execute as @p at @s positioned ~ ~-1 ~ if entity @s[tag=mytag] run say command

## 4.2 Functions

```
[run] function "name|path" {
/commands
}
```

> run optional
> a path should be given as string
> a name consisting of only characters, can be given without ""

A function generates a new mcfunction with the given name or path. You can also execute the function directly with the `run` keyword.
This is an alternative to a more complicated varient with `#file:`.

e.g:

```
run function test {
	/say function
}
/say not function
=
/function prj:test
/say not function

file: ./test
/say function
```

## 4.3 Variables

Like every other programming language there are variables. They are initialized as follows:
`var test`
The variable can take in a value:

```
var test = 5
 or
var test
test = 6
```

This value can be changed as often as you like.

```
var test
test @s = 10
```

Values can be assigned also only to special Minecraft selector like so.
Also possible with playernames and placeholders:

```
test player = 10
```

Do you want to have a trigger scoreboard? Just include the trigger keyword after the variable name:

```
var test trigger @s = 10
/scoreboard objectives add test trigger
/scoreboard players set @s test 10
```

Every value is saved in an independent scoreboard with it´s name or selector. So they are accessible with normal methods:

```
var test
test @s = 10
/scoreboard players get @s test ==> 10
/scoreboard players set @s test 5
 etc
```

Variables can be merged together:

```
var test = 10
var new = 5
  For the sake of simplicity, I start again and again with these values. The program makes it naturally different!

test += 2 ==> 12
test -= 2 ==> 8
```

Bit shorter:

```
test++ ==> test += 1
test-- ==> test -= 1

test += new ==> 15
test -= new ==> 5
test *= new ==> 50
test /= new ==> 2
test %= new ==> 0
```

** Save command response to variable: **

```
var res = run: command
==> execute store result score res res run command
```

The result of the command is written to the variable res.
Example with `/data get`:
' var varResult = run: data get entity @s Pos[0] '

## 4.4 Boolean Variables (Tags)

> `bool [name] [selector](optional) = true|false`

Boolean values can be declared like this.
`bool isCool = true => tag [global] add isCool`
The variable can be changed later:
`isCool = false => tag [global] remove isCool`

With [If](#if) testable:

```
if(isCool){
    /commands => execute if entity [global][tag=isCool] run commands
}
```

## 4.5 Constants

Another type of variable is the constant, declared as following:
`const test = [value]`
This type cannot be changed!

You can use it with `$ (var_name)` somewhere in your code to avoid long strings and repetitive phrases:

```
const aString = "Here can be a string"
const aNum = 5

/say $(aString)       ==> /say Here can be a string
var test = $(aNum)   ==> var test = 5
```

**Replace constants**
The value of an constant can still be changed when used. To do this, add '.repl()' to the constant:

> `$(const).repl([search],[replacement])`

In our example, we want to replace `a`:

```
/say $(aString).repl(" a "," the ") ==> /say Here can be the string
```

Also a [RegEx](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/RegExp) can be inserted here and can be also accessed with '\$&' in the replacement:
`$(aString).repl([/regex/],["$&"])`

### Maps

Maps are essentially key-value pairs kind of like a dictionary. We define it with the Map-operator:

```js
const testMap = Map{

}
```

In the brackets you can define as many pairs as you like:

```js
const testMap = Map{
	"key1":"value",
	"key2":"value2"
}
```

It then can be accessed with

```js
/say $(testMap).key1

⇒ /say value
```

### Arrays

Arrays are pretty similar to Maps, but use a list of values instead of pairs:

```js
const testArr = Array{
	"value", // index 0
	"value2" // index 1
}
```

The values can be accessed by the index of the item starting with 0.

```js
/say $(testArr).0
⇒ /say value
/say $(testArr).1
⇒ /say value2
```

## 4.6 If/Else Statements

If functions are similar to grouping:

    if('statement'){
    	/commands 	=> /execute if statement run command
    }

With some additional features:

- In front of every argument a "!" can be inserted to reverse the meaning:

      if(!'statement'){
      	/commands 	=> /execute unless statement run command
      }

- After the end an "else" can be attached:

```
    if('statement'){
    	/commands 	=> /execute if statement run command
    } else {		   /execute unless statement run command2
    	/commands2
    }
```

    Important: Do not change the argument!

```
    if('entity @s[tag=test]'){
    	/tag @s remove test
    } else {
    	/tag @s remove test
    }
```

    They are both executed!! Improved:

```
    if('entity @s[tag=test]'){
    	/tag @s add testIf
    }
    if('entity @s[tag=testIf]'){
    	/tag @s remove test
    	} else {
    	/tag @s remove test
    }
```

even "else if" is possible:

```
    if('statement'){
    	/commands 				=> /execute if statement run command
    } else if('statement2') {	   /execute unless statement if statement2 run command2
    	/commands2
    }
```

use the unless keyword to negate the entire condition:

```
    unless('statement'){
    	/commands 	=> /execute unless statement run command
    }
```

## 4.7 Logical operators

In combination with grouping and if-else statements logical operators can be used:

- The or operator can be used in two ways:

```
    as('@s'||'@p'){
    	/command
    }
    ==> execute as @s run command
        execute at @p run command

    # or as list
    if('entity @s[tag=entity1]','entity @s[tag=entity2]'){
    	/command
    }
    ==> execute if entity @s[tag=entity1] run command
        execute if entity @s[tag=entity2] @p run command
```

- The and operator is defined like so (makes only really sense with if)

```
    if('entity @s'&&'entity @p'){
    	/command
    }
    ==> execute if entity @s if entity @p run command
```

- check variables:

```
var test = 5

 equally
if(test == 5){
    /commands
}

 greater/smaller or equal
if(test >= 5){
    /commands
}

 greater/smaller
if(test > 5){
    /commands
}

 also avalible as comparison
if(test > test2){
    /commands
}

 or with variables with entitys
if(test @s > test2 @a){
    /commands
}
```

## 4.8 Switch-Cases

```
switch([var_name]){
    case <=|<|==|>|>= [other_var]|[number] {
        [actions]
    },
    default(optional) {
        [default actions]
    }
}
```

Switches makes the case distinction much easier. It´s able to test easily and clearly certain variables.
e.g:

```
var test = 10
switch(test){
    case > 10 {
        /say var is over 10
    },
    case < 10 {
        /say var is under 10
    },
    default {
        /say no match
    }
}
```

Here test is checked for more than 10, if that does not apply to less than 10 and finally outputed as default.
Also abbreviable:

```
var test = 10
switch(test){
    case > 10 run: say var is over 10
    , case < 10 run: say var is under 10
    , default run: say no match
}
```

## 4.9 For-Loops

One of the most helpful features is the for loop. It takes in neutral numbers.

From `first Argument` to `second Argument` is optional outputed as `third Argument`

```
 for(1,5){
	/commands
	# is outputed 5 times
}
```

```
 for(1,5){
	/say $(i)
	# say with 1 - 5 is outputed 5 times
}
```

with \$(var_name) the loop variable can be accessed

var_name is out of the box defined as "i", but can be changed with the third argument:

    for(1,5,X){
    	/say $(X)
    	# say with 1 - 5 is outputed 5 times}

That makes especially with two-dimensional loops sence:

    for(1,5,i){
    	for(1,2,j){
    		/say $(i).$(j)
    	}
    	# say with 1.1 - 5,2 is outputed 10 times
    }

## 4.10 Raycasting

```
raycast([distance](optional), [block to travel through](optional),entity | block [target](optional) ){
    [actions on hitted block or entity]
},{
    [actions for every flight step]
}
default distance = 100 Blocks
default block = air
default target = any block
```

Raycasting is a big thing in Minecraft 1.13 and provides unlimeted opportunities. But it is a bit difficult, so why not making it easier? With Minecraft Script this is really really easy now:

```
raycast {
    /setblock ~ ~ ~ stone
}
```

This alone sets everywhere where you look a stone
Particles and block limits are also pretty easy:

```
raycast(10) {
    /setblock ~ ~ ~ stone
}, {
    /particle flame ~ ~ ~
}
```

Now there are beautiful effects and a max range of 10 blocks.
The second argument sets the porous blocks.

```
raycast(10,"air") {
    /setblock ~ ~ ~ stone
}
```

So the ray only goes through air.
You can also negate the porous blocks and set with a "!" the not porous blocks:

```
raycast(10,!"white_wool") {
    /setblock ~ ~ ~ stone
}
```

The ray goes through all blocks, but white wool.

As third optional argument a target can be set:

```
raycast(10,"air",block "white_wool") {
    /setblock ~ ~ ~ stone
}
```

Now Mcscript knows that the target is a block and executes the command only if the block is white wool.

```
raycast(10,"air",entity @e[type=armor_stand]) {
    /say test
}
```

Now Mcscript knows that the target is an entity and executes as the entity if it´s hitted.
So the armor stand would say test.

## 4.11 while loops

The while loop is defined like so:

```
while([cond]){
    /commands
}
```

The grouped commands are executed as long as the condition [cond] is true.

> If the condition to start is not true, the grouping will not be executed!

As a condition, all operators and arguments of the If conditions can be used. e.g.

```
var test = 0
while(test < 10){
    /commands here
    test += 1
}
 ==> The commands are executed 10x in one tick
```

For while-loops you can also use stop and continue:

```
var test = 0
while(test < 10){
    test += 1
    if(test == 5){
        continue
        # If test is equal to 5 the other commands are skipped
    }
    /commands hier
    if(test >= 9){
        stop
        # If test is equal to or over 5 the loop is stopped
    }
}
```

## 4.12 do-while-Loops

```
do {
    /commands
} while([cond])
```

The do-while loop works in a similar way to the while loop, with the small difference that the code block is executed and then the condition is checked.
So the loop is executed at least one time.

## 4.13 forEach-Loop

```
forEach(var [var_name] = [start value]; [var_name] ==|>|<|<=|>=|!= [other_var]|[number]; [varname]++){
    /commands
}
```

The forEach Loop is a loop found in almost any programming language.
It is similar to Minecraft Script's for-loop, but it works dynamically (it does not run on generate, but in Minecraft)

e.g:

```
forEach(var i = 0; i < 10; i++){
    /say hey
}
```

The Command is executed 10 times and the current value is saved each in the scoreboard i.
Der Command wird also 10mal ausgeführt und der aktuelle Wert jeweils in dem scoreboard i gespeichert.
You can also access the value like so. e.g. Faculty:

```
var result = 1
forEach(var i = 2; i <= 10; i++){
    result *= i
}
==> result = 1 * 2 * 3 * 4 * 5 * 6 * 7 * 8 * 9 * 10
```

## 4.14 Modals

Modals are like functions or methods. That means you can define them:

> ```
> modal [name]([arguments]){
>     [actions]
> }
> ```

A modal is always introduced with the keyword followed by the name and the arguments in the brackets.

The arguments are accessible inside with \$(argument_name).

    modal newModal(argument){
    	/say $(argument)
    }

    newModal('test')

    # => say test

If you use the modal like that, the values are used and it outputs everything.

    modal createCommand(command,argument1,argument2){
    	/$(command) $(argument1) $(argument2)
    }

    createCommand('say', 'hallo', 'du')

    # => say hallo du

You are also able to use multiple arguments.

There are optional and predefined arguments, too:

    modal say(argument = "hallo"){
    	/say $(argument)
    }

    say()
    # => say hallo

    say('test')
    # => say test

**Using Maps and Arrays**
You can also use the [Map](#maps) and [Array](#arrays) type of constants in modals:

```js
modal defaultMap(args = Map{"key":"value"}){
    /say $(args).key
}
defaultMap()
defaultMap(Map{
    "key":"value2"
})

⇒ /say value
⇒ /say value2
```

**Override Modals**
Modals that have already been created can be overridden within the process:

> ```
> override modal [name]([arguments]){
>    [actions]
> }
> ```

Arguments and actions are exchanged completely and used for the ongoing process.

**Replace arguments**
The value of an argument can still be changed when used. To do this, add '.repl()' to the argument:

> `$(argument).repl([search],[replacement])`

In our example, we want to replace an entered test:

```
/say $(argument).repl("test","no test") ==> /say no test
```

Also a [RegEx](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/RegExp) can be inserted here and can be also accessed with '\$&' in the replacement:
`$(argument).repl([/regex/],["$&"])`

## 4.15 JavaScript Modals

JavaScript Modals are modals, you can write in JavaScript. You can define them like other modals:

> ```
> modaljs [name]([arguments]){
>     [actions]
>     return [Text]
> }
> ```

The JavaScript Modal must end with the return statement. The returned value will end up in the `.mcfunction` file as plain text.

    modaljs newModal(){
    	return "say hi";
    }

    newModal()

    # => say hi

For multi line output I recommend doing something like this:

    modaljs newModal(){
    	var ret = "";

    	ret += "say hi\n";
    	ret += "say ho\n";

    	return ret;
    }

    newModal()

    # => say hi
    # => say ho

Note: You need to add line breaks manually with `\n`.

A JavaScript modal is always introduced with the keyword followed by the name and the arguments in the brackets.

The arguments are accessible inside with their names.

    modaljs newModal(argument){
    	return "say " + argument;
    }

    newModal('test')

    # => say test

You are also able to use multiple arguments.

    modaljs newModal(text,monster){
    	var ret = "";

    	ret += "say " + text + "\n";
    	ret += "summon " + monster + "\n";

    	return ret;
    }

    newModal("Brains!!!","minecraft:zombie")

    # => say Brains!!!
    # => summon minecraft:zombie

There are optional and predefined arguments, too:

    modaljs say(argument = "hallo"){
    	return "say " + argument ;
    }

    say()
    # => say hallo

    say('test')
    # => say test

**Tips and tricks**

Use `console.log()` to output some information to the console while compiling without effecting the return value.

## 4.16 System Modals

There are already some helpful predefined modals. Please read the specific documentation [here](https://github.com/Stevertus/mcscript/blob/master/Core%20Modals.md).

You have ideas which modals should be a standart? Send me your [configuration file](#ownmodal) to check.

## 4.17 Error handling and Debugging

Minecraft Script shows since the version 0.2 only limeted errors with line and file displayed.
Please use the flag `-fullErr` at generation to get the old full errors back, if you want so.

If you find errors that make no sense in the context, please notify the team.

**Debug keyword**
You can debug your code with the keyword "Debug" and find some errors in Minecraft Script much easier. You can place these anywhere in your code and they have no affect on the compiled output.

- `debug message: [message]`
  Sends a simple message with line and file references.
- `debug success: [message]`
- Sends a successful message in green with line and file references.
- `debug break: [message]`
  Your program breakes at this point and sends the message obove .
- `debug error: [message]`
  Your program breakes at this point and sends a critical error with system information and relevant code positions.
