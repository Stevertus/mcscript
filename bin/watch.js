#!/usr/bin/env node
const lib = require('../lib/index.js');
lib.watch(process.argv[2] || './');
