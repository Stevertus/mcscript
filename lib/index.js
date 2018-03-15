const fs = require('fs');

const lexer = require('./lexer.js')
const parser = require('./parser.js')
const gen = require('./generator.js')

const compile = function(path){
  let num = 1
  if(fs.lstatSync(path).isFile()){
    readFile(path)
    console.log("\x1b[32m","Read " + num + " Files and compiled successfully","\x1b[0m")
  } else {
    //console.log(gen.getFiles(path))
    for(file of gen.getFiles(path)){
      num++
      readFile(file)
    }
    console.log("\x1b[32m","Read " + num + " Files and compiled successfully","\x1b[0m")
  }
}
const genModals = function(path){
  if(fs.lstatSync(path).isFile()){
    readFile(path, true)
    console.log("\x1b[32m","Read " + path + " and compiled to JSON","\x1b[0m")
  } else throw "Just one File accepted!"
}

const watch = function(path){
  console.log("\x1b[32m","Now I watch your files on "+path+" to change! *-*","\x1b[0m")
  let counter = false
  fs.watch(path, { recursive: true }, (eventType, filename) => {
  if (filename && filename.split('.').pop() == 'mcjs' && counter) {
    console.log("\x1b[36m",filename + " changed and got compiled!","\x1b[0m")
    readFile(filename)
  }
  counter = !counter
});
}

function readFile(file, noParse){
  fs.readFile(file, {encoding: "utf8"}, function(err, data) {
    //console.dir(parser.parse(lexer.lexer(data)))
    //console.log(JSON.stringify(parser.parse(lexer.lexer(data))))
    data = data.split("\n")
    for(let item of data){
      if(",;({[".indexOf(item.trim().slice(-1)) == -1){
        data[data.indexOf(item)] += ";"
      }
    }
    data= data.join("\n")
    if(noParse) gen.getModals(parser.parse(lexer.lexer(data)),file)
    else gen.parseCode(parser.parse(lexer.lexer(data, file)),file)
    //else console.log(JSON.stringify(parser.parse(lexer.lexer(data, file))))
  })
}
exports.compile = compile
exports.watch = watch
exports.genModals = genModals
