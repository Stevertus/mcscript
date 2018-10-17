#!/usr/bin/env node
const lib = require('../lib/index.js');
lib.genModals(process.argv[2] || './');
