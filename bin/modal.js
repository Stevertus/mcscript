#!/usr/bin/env node
var lib= require('../lib/index.js');
lib.genModals(process.argv[2] || './')
