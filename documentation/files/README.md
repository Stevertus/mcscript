---
sidebar: auto
footer: MIT Licensed | Copyright © 2020 Stevertus
prev: /cli/
next: /syntax/
---

# 3) File system
## 3.1 File setup

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

## 3.2 Extend Files
A already existing file, that is generated before with `#file:`, can be expanded in other files and new code is easily attached:
```
#extend: ./test
/commands here
```

## 3.3 Global Files
Variables (#vars), [constants] (#consts), and [Modals] (#modals) are stored separately for each file.
Now you can create a global file with the extension '. gl. mcscript '. The compiler automatically detects globals and uses the declared objects in other files as well.
For example, you can write the modals to a separate file.