

Minecraft Script Dokumentation
==============================

Minecraft Script is a programming language for developers of mcfunctions, Minecraft Maps and packages. The .mcscript files are therefor compiled and generated to the function format. This enables the developer extended possibilities, such as Modals, Loops, Varibles, Constants and Command-Wrapping.

Everyone who wants to try, can visit my playground [stevertus.ga/tools/mcscript](http://www.stevertus.ga/tools/mcscript) and can play with its function.

German documentation [here](https://github.com/Stevertus/mcscript/blob/master/README-DE.md)
##  Installation


The Compiler gets offered as [Node.js/](https://nodejs.org/en/download/) Package that is installed locally on your machine. It enables much more features than the online version  
For example: compile all files in a directory, direct output in new files, watch your files on changes, etc.

### 1.1 Installation of Node.js

The installation requires the Node.js environment and the Node Package Manager.

This is achieved the best way by using the installer: [nodejs.org/en/download/](https://nodejs.org/en/download/)  
Just run it and install.

### 1.2 Installation of Minecraft Script

Now open your PCs console. (search CMD).

There you have to type in this command: `npm install -g mcscript`  
If a successful answer apears you have done everything right and can start.

##  CLI Commands


You can now use the tool by launching the Command Line in your datapacks folder  
(with Shift + rightclick on directory -> open command line)  
Now you can use the commands like that:

### 2.1 mcscript new

Creates a new datapack for you with all basic files. Takes as argument the datapack id!

### 2.2 mcscript compile

This command converts all .mcscript files into .mcfunction format. You can read [here](#syntax) what you can do in the mcscript files.  
The console displays all generated files or throws an error if something was not correct.

Alternatively you can use `mcscript-compile *filepath*` to set an custom directory or file.

### 2.3 mcscript watch

This will automatically compile your code if you make any changes (save). So you do not have to enter the above command with every change.

Again, a path can be specified.

### 2.4 Dev: mcscript-modals

!!This command is intended only for developers who want to install their modals in the compiler.  
A file must be specified and then the modals out of this file are written to a configuration file.

##  Minecraft Script Syntax


The code is written in files with the extension .mcscript. It is recommended to manage the files and to highlight the syntax in a code editor (IDE). explore more [here](#ide).  

Unlike mcfunction, each command is injected with a "/" or "run:".

Comments are announced with "//", if comments should also appear in the new file with "#"

Blank lines and skipping lines are ignored.  
If a blank line is desired in the mcfunction, express this with a '#' without a comment.  
Two blank lines are reached with "##".

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


### 3.2 Command Grouping / Wrapping

"as, at, positioned,align,dimension,rotated,anchored" can be grouped together:


    as('@a'){	 
    	/commands 	=> /execute positioned ~ ~ ~ run command
    }		 


The Argument / Arguments in the brackets have to be a string! (with ' ' or " ")

"Groups can be listed like so:


    as('@p'), at('@s'), positioned('~ ~1 ~'){
    	/say command
    }
    ==> /execute as @p at @s positioned ~ ~-1 ~ run say command

    // also with if
    as('@p'), at('@s'), positioned('~ ~1 ~'), if(entity @s[tag=mytag]){
    	/say command
    }
    ==> /execute as @p at @s positioned ~ ~-1 ~ if entity @s[tag=mytag] run say command


### 3.3 If/Else Statements

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

### 3.4 Logical operators

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

### 3.5 For-Loops

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


### 3.6 Modals

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

### 3.7 System Modals

There are already some helpful predefined modals. Please read the specific documentation [here](#).

You have ideas which modals should be a standart? Send me your [configuration file](#ownmodal) to check.

##  IDEs and Syntax Hightlighting


*   GitHubs Atom Editor: link here (credit: [MrYurihi](https://atom.io/users/MrYurihi))
*   Notepad++: link here

Now there´s nothing left than: **Happy Developing**
---------------------------------------------------

Thanks to all who use Minecraft Script and read this documentation. Contact me if you have a proposal, problem or error.
