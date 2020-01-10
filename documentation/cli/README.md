---
sidebar: auto
footer: MIT Licensed | Copyright © 2020 Stevertus
prev: /guide/
next: /files/
---

# 2)  CLI Commands


You can now use the tool by launching the Command Line in your datapacks folder  
(with Shift + rightclick on directory -> open command line)  
Now you can use the commands like that:

## 2.1 mcscript new

Creates a new datapack for you with all basic files in a scripts folder. Takes as argument the datapack id!

## 2.2 mcscript compile

This command converts all .mcscript files into .mcfunction format. You can read [here](#syntax) what you can do in the mcscript files.  
The console displays all generated files or throws an error if something was not correct.

Alternatively you can use `mcscript compile *filepath*` to set an custom directory or file.
With an additional `-fullErr` flag you can view full errors and code positions.

## 2.3 mcscript watch

This will automatically compile your code if you make any changes (save). So you do not have to enter the above command with every change.

Again, a path and `-fullErr` can be specified.

## 2.4 mcscript add [url or package]
This command adds a custom datapack to your directory.
As argument an url to the resource or a *mcScript Extension* name can be used.

Get a list of all supported packages by running just`mcscript add`


## 2.5 Dev: mcscript modals

!!This command is intended only for developers who want to install their modals in the compiler.  
A file must be specified and then the modals out of this file are written to a configuration file.