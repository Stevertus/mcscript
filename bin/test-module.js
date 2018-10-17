#!/usr/bin/env node

const lib = require('../lib/index.js');
const addPack = require('./add.js');
const gen_new = require('../lib/gen_new.js');
const consoletheme = require('../lib/consoletheme.js');

let fullError = false;
if(process.argv.indexOf("-fullErr") !== -1){ //does our flag exist?
    fullError = true;
    process.argv.splice(process.argv.indexOf("-fullErr"),1)
}

switch(process.argv[2]){
  case 'compile':
    lib.compile(process.argv[3] || './',fullError);
    break;
  case 'watch':
    lib.watch(process.argv[3] || './',fullError);
    break;
  case 'modal':
    lib.genModals(process.argv[3] || './');
    break;
  case 'new':
    if(process.argv[3]) gen_new.new(process.argv[3]);
    else console.log(consoletheme.FgRed,"You have to enter a datapack id!",consoletheme.Reset);
    break;
  case 'add':
    addPack.addPack(process.argv[3] || "");
    break;
  default:
    console.log(consoletheme.FgRed,"Please select a sub command",consoletheme.Reset);
    break;
}
