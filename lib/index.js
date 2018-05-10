const fs = require('fs');

const lexer = require('./lexer.js')
const parser = require('./parser.js')
const gen = require('./generator.js')
const consoletheme = require("./consoletheme.js")

const compile = function(path){

  let num = 1;
  if(fs.lstatSync(path).isFile()){

    readFile(path);
    console.log(consoletheme.FgGreen,"Read " + num + " Files and compiled successfully",consoletheme.Reset);

  } else {

    if(fs.existsSync(path + "/mcscript")) gen.getFiles(path + "/mcscript","mcfunction").forEach((item) => {
      fs.unlink(item, () => false);
    });


    for(file of gen.getFiles(path)){
      num++;
      readFile(file);
    }

    console.log(consoletheme.FgGreen,"Read " + num + " Files and compiled successfully",consoletheme.Reset);
  }
}

const genModals = function(path){

  if(fs.lstatSync(path).isFile()){

    readFile(path, "modal");
    console.log(consoletheme.FgGreen,"Read " + path + " and compiled to JSON",consoletheme.Reset);

  } else {
    throw "Just one File accepted!";
  }
}

const genAst = function(path){

  if(fs.lstatSync(path).isFile()){

    readFile(path, "json");
    console.log(consoletheme.FgGreen,"Read " + path + " and compiled to JSON",consoletheme.Reset);

  } else {
    throw "Just one File accepted!";
  }
}

const watch = function(path){

  console.log(consoletheme.FgGreen,"Now I watch your files on "+path+" to change! *-*",consoletheme.Reset)

  let counter = false;

  fs.watch(path, { recursive: true }, (eventType, filename) => {

    filename = filename.replace(/\\/g, "/");

    if (filename && filename.split('.').pop() == 'mcscript' && counter) {

      console.log(consoletheme.FgCyan,filename + " changed and got compiled!",consoletheme.Reset);

      try {
        readFile(path + filename);
      } catch(err){
        console.log(consoletheme.FgCyan,err,consoletheme.Reset);
      }

    }
    counter = !counter;
  });
}

function readFile(file, noParse){

  fs.readFile(file, {encoding: "utf8"}, function(err, data) {

    data = data.split("\n");
    for(let item of data) {

      if(item.trim() == "{"){
        data[data.indexOf(item) - 1] = data[data.indexOf(item) - 1].substr(0, data[data.indexOf(item) - 1].length -2)
      }

      if(",;({[".indexOf(item.trim().slice(-1)) == -1){
        data[data.indexOf(item)] += ";"
      }

    }
    data= data.join("\n");
    if(noParse == "modal") gen.getModals(parser.parse(lexer.lexer(data)),file);
    else if(noParse == "json") gen.getAst(parser.parse(lexer.lexer(data)),file)
    else gen.parseCode(parser.parse(lexer.lexer(data, file)),file)

  });
}
exports.compile = compile;
exports.watch = watch;
exports.genModals = genModals;
