#!/usr/bin/env node

var lib= require('../lib/index.js');
lib.compile(process.argv[2] || './')
