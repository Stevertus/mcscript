
Minecraft Script Changes
==============================
> Update your Version by running: `npm install -g mcscript@`
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
