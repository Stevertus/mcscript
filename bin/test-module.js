#!/usr/bin/env node

const lib = require("../lib/index.js");
const addPack = require("./add.js");
const gen_new = require("../lib/gen_new.js");
const consoletheme = require("../lib/consoletheme.js");

const subCommands = {
	compile: () => {
		lib.compile(process.argv[3] || "./", fullError);
	},
	watch: () => {
		lib.watch(process.argv[3] || "./", fullError);
	},
	modal: () => {
		lib.genModals(process.argv[3] || "./");
	},
	new: () => {
		if (process.argv[3]) {
			gen_new.new(process.argv[3]);
		} else {
			console.log(
				consoletheme.FgRed,
				"You have to enter a datapack id!",
				consoletheme.Reset
			);
		}
	},
	add: () => {
		addPack.addPack(process.argv[3] || "");
	},
};

let fullError = false;
if (process.argv.indexOf("-fullErr") !== -1) {
	//does our flag exist?
	fullError = true;
	process.argv.splice(process.argv.indexOf("-fullErr"), 1);
}

let subcmd = process.argv[2];
if (subcmd in subCommands) {
	subCommands[subcmd]();
} else {
	console.log(consoletheme.FgRed);
	if (subcmd !== "") console.log(`Unknown sub command: ${subcmd}`);
	console.log("Please select a sub command:");
	for (let subCmd in subCommands) console.log("    " + subCmd);
	console.log(consoletheme.Reset);
}
