#!/usr/bin/env node
var lib= require('../lib/index.js');
lib.watch(process.argv[2] || './')
