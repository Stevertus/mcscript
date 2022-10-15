const fs = require("fs");

const lexer = require("./lexer.js");
const parser = require("./parser.js");
const gen = require("./generator.js");
const consoletheme = require("./consoletheme.js");

let preOptions;

const compile = function (path, fullErr = false, sync = false) {
	if (sync) {
		let num = 1;
		gen.clearVars();
		if (fs.lstatSync(path).isFile()) {
			// The path is a single file
			readFile(path, {}, sync);
			console.log(consoletheme.FgGreen, "Read " + num + " Files and compiled successfully", consoletheme.Reset);
		} else {
			// TODO synchronously
			// Remove ./mcscript/*.mcfunction first

			if (fs.existsSync(path + "/mcscript")) {
				gen.getFiles(path + "/mcscript", "mcfunction").forEach((item) => fs.unlink(item, () => false));
			}

			preOptions = {
				vars: [],
				modals: [],
				tags: [],
				consts: [],
			};

			// all files here
			let files = gen.getFiles(path);

			// find all files ends with gl.mcscript, and move them from {files} to {globals}
			let global_files = files.filter((x) => {
				if (x.split(".").slice(-2).join(".") === "gl.mcscript") {
					files.splice(files.indexOf(x), 1);
					return true;
				}
				return false;
			});

			// Should not compile .mcscript until all .gl.mcscript files are compiled.

			let promises_global = [];
			let promises_notglobal = [];
			let isAllSuccess = true;
			for (let file of global_files) {
				try {
					readFile(file, { noParse: "vars", fullErr: fullErr }, sync);
				} catch (err) {
					isAllSuccess = false;
					console.error(err);
				}
			}
			for (let file of files) {
				num++;
				try {
					readFile(file, { fullErr: fullErr }, sync);
				} catch (err) {
					isAllSuccess = false;
					console.error(err);
				}
			}
			if (isAllSuccess) {
				console.log(consoletheme.FgGreen, "Read " + num + " Files and compiled successfully", consoletheme.Reset);
			}
		}
	} else {
		return new Promise(function (resolve, reject) {
			let num = 1;
			gen.clearVars();
			if (fs.lstatSync(path).isFile()) {
				// The path is a single file
				readFile(path).then(resolve);
				console.log(consoletheme.FgGreen, "Read " + num + " Files and compiled successfully", consoletheme.Reset);
			} else {
				// Remove ./mcscript/*.mcfunction first
				if (fs.existsSync(path + "/mcscript")) gen.getFiles(path + "/mcscript", "mcfunction").forEach((item) => fs.unlink(item, () => false));

				preOptions = {
					vars: [],
					modals: [],
					tags: [],
					consts: [],
				};
				let files = gen.getFiles(path);

				// find all files ends with gl.mcscript, and move them from {files} to {globals}
				let globals = files.filter((x) => {
					if (x.split(".").slice(-2).join(".") === "gl.mcscript") {
						files.splice(files.indexOf(x), 1);
						return true;
					}
					return false;
				});

				// Should not compile .mcscript until all .gl.mcscript files are compiled.

				let promises_global = [];
				let promises_notglobal = [];

				for (let file of globals) {
					promises_global.push(readFile(file, { noParse: "vars", fullErr: fullErr }));
				}
				for (let file of files) {
					num++;
					promises_notglobal.push(readFile(file, { fullErr: fullErr }));
				}

				Promise.all(promises_global).then(() => {
					Promise.all(promises_notglobal).then(() => {
						console.log(consoletheme.FgGreen, "Read " + num + " Files and compiled successfully", consoletheme.Reset);
						resolve();
					});
				});
			}
		});
	}
};

function changeOptions(opt) {
	preOptions.vars = preOptions.vars.concat(opt.vars.filter((x) => preOptions.vars.indexOf(x) === -1));

	preOptions.modals = preOptions.modals.concat(opt.modals.filter((x) => preOptions.modals.indexOf(x) === -1));

	preOptions.tags = preOptions.tags.concat(opt.tags.filter((x) => preOptions.tags.indexOf(x) === -1));

	preOptions.consts = preOptions.consts.concat(opt.consts.filter((x) => preOptions.consts.indexOf(x) === -1));
}

const genModals = function (path) {
	if (fs.lstatSync(path).isFile()) {
		readFile(path, { noParse: "modal" });
		console.log(consoletheme.FgGreen, "Read " + path + " and compiled to JSON", consoletheme.Reset);
	} else {
		throw "Just one File accepted!";
	}
};

const watch = function (path, fullErr, sync = false) {
	console.log(consoletheme.FgGreen, "Now I watch your files on " + path + " to change! *-*", consoletheme.Reset);

	let counter = false;

	fs.watch(path, { recursive: true }, (eventType, filename) => {
		if (filename === null) return;
		filename = filename.replace("/\\/g", "/");

		if (filename && filename.split(".").pop() === "mcscript" && counter) compile(path, { fullErr: fullErr }, sync);
		counter = !counter;
	});
};

// readFile means load file content and compile it, then generate .mcfunction files.
function readFile(file, options = {}, sync = false) {
	if (sync) {
		let data = fs.readFileSync(file) + "";
		{
			// TODO prehandling.
			data = data.replace(/\)[\n \t]+\{/g, "){");
		}

		data = data.split("\n");
		for (let item of data) {
			if (item.trim() === "{") {
				data[data.indexOf(item) - 1] = data[data.indexOf(item) - 1].substr(0, data[data.indexOf(item) - 1].length - 2);
			}
			if (",;({[".indexOf(item.trim().slice(-1)) === -1) {
				data[data.indexOf(item)] += ";";
			}
		}
		data = data.join("\n");

		if (options.noParse === "modal") gen.getModals(parser.parse(lexer.lexer(data)), file, sync);
		else if (options.noParse === "json") gen.getAst(parser.parse(lexer.lexer(data)), file, sync);
		else if (options.noParse === "vars") {
			changeOptions(gen.getVars(parser.parse(lexer.lexer(data)), file, preOptions, true));
		} else {
			try {
				gen.parseCode(parser.parse(lexer.lexer(data, file)), file, preOptions, true);
			} catch (err) {
				if (err.message && err.message.substr(0, 7) === "[Debug]") {
					console.log(err.message);
					let oldMess = err.message.split(" ")[0].substr(7);
					err.message = err.message.split(" ").slice(1).join(" ");
					console.log(consoletheme.FgRed, "[Debugger]", consoletheme.FgCyan, oldMess, consoletheme.FgWhite, err, consoletheme.Reset);
				} else if (!options.fullErr) {
					console.error(consoletheme.FgRed, "[Error]", err.message || err, "\n\n " + file + " was not compiled!", consoletheme.Reset);
					console.error(err.stack);
				} else {
					console.log(err);
				}
			}
		}
	} else {
		return new Promise(function (resolve, reject) {
			fs.readFile(file, { encoding: "utf8" }, function (err, data) {
				{
					// TODO prehandling.
					data = data.replace(/\)[\n \t]+\{/g, "){");
				}

				data = data.split("\n");
				for (let item of data) {
					if (item.trim() === "{") {
						data[data.indexOf(item) - 1] = data[data.indexOf(item) - 1].substr(0, data[data.indexOf(item) - 1].length - 2);
					}
					if (",;({[".indexOf(item.trim().slice(-1)) === -1) {
						data[data.indexOf(item)] += ";";
					}
				}
				data = data.join("\n");

				if (options.noParse === "modal") gen.getModals(parser.parse(lexer.lexer(data)), file);
				else if (options.noParse === "json") gen.getAst(parser.parse(lexer.lexer(data)), file);
				else if (options.noParse === "vars") changeOptions(gen.getVars(parser.parse(lexer.lexer(data)), file, preOptions));
				else
					try {
						gen.parseCode(parser.parse(lexer.lexer(data, file)), file, preOptions).then(resolve);
					} catch (err) {
						if (err.message && err.message.substr(0, 7) === "[Debug]") {
							console.log(err.message);
							let oldMess = err.message.split(" ")[0].substr(7);
							err.message = err.message.split(" ").slice(1).join(" ");
							console.log(consoletheme.FgRed, "[Debugger]", consoletheme.FgCyan, oldMess, consoletheme.FgWhite, err, consoletheme.Reset);
						} else if (!options.fullErr) {
							console.log(consoletheme.FgRed, "[Error]", err.message || err, "\n\n " + file + " was not compiled!", consoletheme.Reset);
						} else {
							console.log(err);
						}
					}
			});
		});
	}
}

exports.compile = compile;
exports.watch = watch;
exports.genModals = genModals;
