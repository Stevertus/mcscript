const fs = require('fs');

const lexer = require('./lexer.js')
const parser = require('./parser.js')
const gen = require('./generator.js')

const compile = function(path){
  let num = 1
  if(fs.lstatSync(path).isFile()){
    readFile(path)
    console.log("\x1b[32m","Read " + num + " Files and compiled successfully","\x1b[0m")
  }
  // } else if(fs.lstatSync(path + '.mcscript').isFile()){
  //   readFile(path + '.mcscript')
  //   console.log("\x1b[32m","Read " + num + " Files and compiled successfully","\x1b[0m")
  // }
  else {
    if(fs.existsSync(path + "/mcscript")) gen.getFiles(path + "/mcscript","mcfunction").forEach((item) => {
      fs.unlink(item, () => false)
    })
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
    readFile(path, "modal")
    console.log("\x1b[32m","Read " + path + " and compiled to JSON","\x1b[0m")
  } else throw "Just one File accepted!"
}
const genAst = function(path){
  if(fs.lstatSync(path).isFile()){
    readFile(path, "json")
    console.log("\x1b[32m","Read " + path + " and compiled to JSON","\x1b[0m")
  } else throw "Just one File accepted!"
}

const watch = function(path){
  console.log("\x1b[32m","Now I watch your files on "+path+" to change! *-*","\x1b[0m")
  let counter = false
  fs.watch(path, { recursive: true }, (eventType, filename) => {
    filename = filename.replace(/\\/g, "/")
  if (filename && filename.split('.').pop() == 'mcscript' && counter) {
    console.log("\x1b[36m",filename + " changed and got compiled!","\x1b[0m")
    try {
      readFile(path + filename)
    } catch(err){
      console.log("\x1b[36m",err,"\x1b[0m")
    }
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
      if(item.trim() == "{"){
        data[data.indexOf(item) - 1] = data[data.indexOf(item) - 1].substr(0, data[data.indexOf(item) - 1].length -2)
      }
      if(",;({[".indexOf(item.trim().slice(-1)) == -1){
        data[data.indexOf(item)] += ";"
      }
    }
    data= data.join("\n")
    if(noParse == "modal") gen.getModals(parser.parse(lexer.lexer(data)),file)
    else if(noParse == "json") gen.getAst(parser.parse(lexer.lexer(data)),file)
    else gen.parseCode(parser.parse(lexer.lexer(data, file)),file)
    //else console.log(JSON.stringify(parser.parse(lexer.lexer(data, file))))
  })
}
exports.compile = compile
exports.watch = watch
exports.genModals = genModals
