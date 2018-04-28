#!/usr/bin/env node

var lib= require('../lib/index.js');
var addPack = require('./add.js');
var gen_new = require('../lib/gen_new.js');
// lib.compile(process.argv[2] || './')
switch(process.argv[2]){
  case 'compile':
  lib.compile(process.argv[3] || './');
  break
  case 'watch': lib.watch(process.argv[3] || './');
  break
  case 'modal': lib.genModals(process.argv[3] || './');
  break
  case 'new':
    if(process.argv[3]) gen_new.new(process.argv[3])
    else console.log("\x1b[31m","You have to enter a datapack id!","\x1b[0m")
    break
  case 'add':
   addPack.addPack(process.argv[3] || "")
    break
  default: console.log("\x1b[31m","Please select a sub command","\x1b[0m")
}
