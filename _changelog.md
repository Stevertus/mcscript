
Minecraft Script Changes
==============================
> Update your Version by running: `npm install -g mcscript@`
### v0.2.1
* added: new JavaScript Modal [here](https://github.com/Stevertus/mcscript#modaljs) by cblech.
* added: Map const type
* added: Array const type
* new structured documentation at [stevertus.com/mcscript/documentation](https://stevertus.com/mcscript/documentation)
* refactored the code
* fixed: extend bugs. I am very sorry that this took so long :(
* fixed: forEach operation
### v0.2
This is the first full release version of Minecraft Script! The language has all the necessary features now. I am open for new suggestions nevertheless.
* added: a brand new error handling system. If you find some nonsense errors please report an issue and I will fix it.
* added: the function and run function feature. Read more about its capabilities [here](https://github.com/Stevertus/mcscript#functions).
* added: a few more debugging options with the debug keyword. Read more [here](https://github.com/Stevertus/mcscript#debugging).
* added: a -fullErr flag for compile and watch to see full Errors and files references
* changed: if an execute command is generated after an execute command they will be combined now.
* changed: if an error accures in a file you will be notified and the other files generate nevertheless.
* fixed: an load.mcfunction issue that it generates random stuff sometimes
* fixed: modal calls inside modals should work again (thanks to coolsa)
* fixed: the watch mode crashes no longer if an error accures
* fixed: if a #file tag was added after commands the compiler used to create a file with the name of the first command
### v0.1.5
* added: multiline comments
* added: global variables and `.gl.mcscript` files | Take a look at the documentation.
* added: save the command response in a variable `var test = run: command`
* added: a replace function on constant values and modals.
* added: override keyword to change old modals
* fixed: the common asat issue, should run now
* fixed: while declaring the same variable twice, nothing generates
* changed: the watch feature. Now it generates all files on change, not only the changed
* changed the overall variable handling (but outputs are the same)

### v0.1.4
* added: a `mcscript add` package command
* reduced file size

### v0.1.3
* added: Minecraft Cam datapack modals
* added: Core Modal documentation
* changed: the load.mcscript will automaticly generate the mcscript/load file and execute it
* changed: the corresponding file generator for load.mcscript
* changed: . are now allowed in variable names
* changed: the mcscript folder will be automaticly deleted! save important files!!
* fixed: the forWeb.js file

### v0.1.2
* changed: fixed asat to  "at @s"
* changed: raycasting is more accurate
* changed raycast performance
* added a not block operator for Raycasting
* added raycast entity option
* added raycast target option
* added Nodepad++ Highlighting
## v0.1.1
* fixed: forEach function was written uppercase, which is not allowed by Minecraft
* fixed: raycast score didn´t reset and messed up
* added: now cases can accept a direct value instead of "== [value]"
## v0.1
* added a changelog
* added table of contents for documentation
* modified documentation
* added asat([selector]) wrapper
* added var++ and var--
* added new modal play()
* changed: while executes only if the statement at entry is true now
* added do-while loop
* added forEach loop
* added a raycast feature
* added boolean variables (tags) and if check
* changed: selector behaviour with variables
* added a custom scripts folder for all files
* added a switch functionality
____
