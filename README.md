
![](https://i.imgur.com/YedWe7W.png)

Minecraft Script Documentation
==============================
> Update 0.1.4: [All Changes](https://github.com/Stevertus/mcscript/releases)

Minecraft Script is a programming language for developers of mcfunctions, Minecraft maps and packages. The .mcscript files are therefore compiled and generated to the function format. This enables the developer extended possibilities, such as Modals, Loops, Varibles, Constants and Command-Wrapping.

Everyone who wants to try, can visit my online Editor [stevertus.ga/mcscript7code](http://www.stevertus.ga/mcscript/code) and can play with its functionality.

German documentation [here](https://github.com/Stevertus/mcscript/blob/master/README-DE.md)
## Table of Contents
1) [Installation](#install)
    - [Installation of Node.js](#install-nodejs)
    - [Installation of Minecraft Script](#install-mcscript)
2) [Cli Commands](#cli)
    - [mcscript new](#cli-new)
    - [mcscript compile](#cli-compile)
    - [mcscript watch](#cli-watch)
    - [mcscript add](#cli-add)
3) [Syntax](#syntax)
    - [file setup](#files)
    - [expand files](#extend)
    - [Command Grouping](#groups)
    - [Variables](#vars)
    - [Boolean Variablen](#boolean)
    - [Constants](#consts)
    - [If Statements](#if)
    - [Operators](#operators)
    - [Switches](#switch)
    - [For loop](#for)
    - [Raycasting](#raycast)
    - [while loops](#while)
    - [do-while loops](#dowhile)
    - [forEach loops](#foreach)
    - [Modals](#modals)
    - [System Modals](#systemModals)
4) [IDEs and Syntax Highlighting](#ide)
<a id="install"></a>
##  Installation


The Compiler gets offered as [Node.js/](https://nodejs.org/en/download/) Package that is installed locally on your machine. It enables much more features than the online version  
For example: compile all files in a directory, direct output in new files, watch your files on changes, etc.
<a id="install-nodejs"></a>
### 1.1 Installation of Node.js

The installation requires the Node.js environment and the Node Package Manager.

This is achieved the best way by using the installer: [nodejs.org/en/download/](https://nodejs.org/en/download/)  
Just run it and install.
<a id="install-mcscript"></a>
### 1.2 Installation of Minecraft Script

Now open your PCs console. (search CMD).

There you have to type in this command:
> ```npm install -g mcscript```  

If a successful answer apears you have done everything right and can start.
<a id="cli"></a>
##  CLI Commands


You can now use the tool by launching the Command Line in your datapacks folder  
(with Shift + rightclick on directory -> open command line)  
Now you can use the commands like that:
<a id="cli-new"></a>
### 2.1 mcscript new

Creates a new datapack for you with all basic files in a scripts folder. Takes as argument the datapack id!
<a id="cli-compile"></a>
### 2.2 mcscript compile

This command converts all .mcscript files into .mcfunction format. You can read [here](#syntax) what you can do in the mcscript files.  
The console displays all generated files or throws an error if something was not correct.

Alternatively you can use `mcscript compile *filepath*` to set an custom directory or file.
<a id="cli-watch"></a>
### 2.3 mcscript watch

This will automatically compile your code if you make any changes (save). So you do not have to enter the above command with every change.

Again, a path can be specified.
<a id="cli-add"></a>
### 2.4 mcscript add [url or package]
This command adds a custom datapack to your directory.
As argument an url to the resource or a *mcScript Extension* name can be used.

Get a list of all supported packages by running just`mcscript add`

<a id="cli-modals"></a>
### 2.5 Dev: mcscript modals

!!This command is intended only for developers who want to install their modals in the compiler.  
A file must be specified and then the modals out of this file are written to a configuration file.
<a id="syntax"></a>
##  Minecraft Script Syntax


The code is written in files with the extension .mcscript. It is recommended to manage the files and to highlight the syntax in a code editor (IDE). explore more [here](#ide).  

Unlike mcfunction, each command is injected with a "/" or "run:".

Comments are announced with "//", if comments should also appear in the new file with "#"

Blank lines and skipping lines are ignored.  
If a blank line is desired in the mcfunction, express this with a '#' without a comment.  
Two blank lines are reached with "##".
<a id="files"></a>
### 3.1 File setup

The generated files have always the same name as their root.

A custom name can be set with `#file: *name*.`  
Please without .mcfunction!!

Instead of the name, you can enter a whole path where the new file should be:

*   `#file: C:/test/new`
*   `#file: ./new` (in same directory)
*   `#file: ./subfolder/new`
*   `#file: ../new` (a directory above)
*   `#file: ../subfolder/new`

You can also specify several files:

    #file: new
    //commands here
    #file: two
    //Commands for two

Also very well combinable with [for-loops](#loops):

    #file: new
    //commands here
    for(1,5){
    	#file: test$(i)
    	//Commands for every file here
    }
<a id="extend"></a>
### 3.2 extend files
A already existing file, that is generated before with `#file:`, can be expanded in other files and new code is easily attached:
```
#extend: ./test
/commands here
```
<a id="groups"></a>
### 3.3 Command Grouping / Wrapping
> ```[subcommand]([argument]){  [wrapped actions]   }```

"as, at, positioned,align,dimension,rotated,anchored" can be grouped together:


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
    as('@p'), at('@s'), positioned('~ ~1 ~'), if(entity @s[tag=mytag]){
    	/say command
    }
    ==> /execute as @p at @s positioned ~ ~-1 ~ if entity @s[tag=mytag] run say command
<a id="vars"></a>
### 3.4 Variablen
Like every other programming language there are variables. They are initialized as follows:
`var test`
The variable can take in a value:
```
var test = 5
# or
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
Every value is saved in an independent scoreboard with it´s name or selector. So they are accessible with normal methods:
```
var test
test @s = 10
/scoreboard players get @s test ==> 10
/scoreboard players set @s test 5
# etc
```

Variables can be merged together:
```
var test = 10
var new = 5
#  For the sake of simplicity, I start again and again with these values. The program makes it naturally different!

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
<a id="boolean"></a>
### 3.5 Boolean Variables (Tags)
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
<a id="consts"></a>
### 3.6 Constants

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

<a id="if"></a>
### 3.6 If/Else Statements

If functions are similar to grouping:


    if('statement'){
    	/commands 	=> /execute if statement run command
    }		 


With some additional features:

*   In front of every argument a "!" can be inserted to reverse the meaning:


        if(!'statement'){
        	/commands 	=> /execute unless statement run command
        }		 


*   After the end an "else" can be attached:
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

*   even "else if" is possible:
```
    if('statement'){
    	/commands 				=> /execute if statement run command
    } else if('statement2') {	   /execute unless statement if statement2 run command2
    	/commands2
    }
```
<a id="operators"></a>
### 3.8 Logical operators

In combination with grouping and if-else statements logical operators can be used:

*   The or operator can be used in two ways:
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

*   The and operator is defined like so (makes only really sense with if)
```
    if('entity @s'&&'entity @p'){
    	/command 	
    }
    ==> execute if entity @s if entity @p run command
```
*   check variables:
```
var test = 5

# equally
if(test == 5){
    /commands
}

# greater/smaller or equal
if(test >= 5){
    /commands
}

# greater/smaller
if(test > 5){
    /commands
}

# also avalible as comparison
if(test > test2){
    /commands
}

# or with variables with entitys
if(test @s > test2 @a){
    /commands
}
```
<a id="switch"></a>
### 3.9 Switch-Cases
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
<a id="for"></a>
### 3.10 For-Loops

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

with $(var_name) the loop variable can be accessed

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
<a id="raycast"></a>
### 3.11 Raycasting
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
<a id="while"></a>
### 3.12 while loops
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
# ==> The commands are executed 10x in one tick
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
<a id="dowhile"></a>
### 3.13 do-while-Loops
```
do {
    /commands
} while([cond])
```
The do-while loop works in a similar way to the while loop, with the small difference that the code block is executed and then the condition is checked.
So the loop is executed at least one time.
<a id="foreach"></a>
### 3.14 forEach-Loop
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
<a id="modals"></a>
### 3.15 Modals

Modals are like functions or methods. That means you can define them:


    modal newModal(argument){
    	/say $(argument)
    }	 					


A modal is always introduced with the keyword followed by the name and the arguments in the brackets.

The arguments are accessible inside with $(argument_name).

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
<a id="systemModals"></a>
### 3.11 System Modals

There are already some helpful predefined modals. Please read the specific documentation [here](https://github.com/Stevertus/mcscript/blob/master/Core%20Modals.md).

You have ideas which modals should be a standart? Send me your [configuration file](#ownmodal) to check.
<a id="ide"></a>
##  IDEs and Syntax Highlighting

> Not available yet

*   GitHubs Atom Editor: link here (credit: [MrYurihi](https://atom.io/users/MrYurihi))
*   Notepad++: [see code](https://github.com/Stevertus/mcscript/blob/master/Nodepad%2B%2B%20Highlighter.xml) | [download](http://download1496.mediafire.com/x2k7loq5imbg/4534q4tual7zccm/Nodepad+++Highlighter.xml)

Now there´s nothing left than: **Happy Developing**
---------------------------------------------------

Thanks to all who use Minecraft Script and read this documentation. Contact me if you have a proposal, problem or error.
