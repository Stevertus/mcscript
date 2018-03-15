const fs = require('fs');
const path = require('path')
const basicModals = require('./modals/basic.json')
var modals = []
var genID = 1
var vars = []
var consts = []
modals = modals.concat(basicModals)
generate = function(exp,oldFile) {
  let processed = {}

  let prjPath = oldFile.split("/").indexOf("functions")
  let prjName =oldFile.split("/")[prjPath - 1]
  prjPath = oldFile.split("/").slice(0,prjPath + 1).join("/").replace(".//","")

  let res = js(exp)
  for(let pro in processed){
    res += processed[pro]
  }
  for(let cnst of consts){
    res = res.split('$(' + cnst.name + ')').join(cnst.value);
  }
  return res

  function js(exp) {
    switch (exp.type) {
      case "num"    :
      case "str"    :
      case "comment"   : return comment(exp);
      case "command"   : return exp.value;
      case "stop"   : return '#stop'
      case "continue"   : return '#continue'
      case "modal"   : return js_modal (exp);
      case "bool"   : return js_atom   (exp);
      case "initvar"    : return js_init(exp);
      case "const"    : return js_const(exp);
      case "var"    : return js_var    (exp);
      case "binary" : return js_binary (exp);
      case "assign" : return js_assign (exp);
      case "let"    : return js_let    (exp);
      case "if"     : return make_if(exp);
      case "as"     : return make_indent(exp,"as");
      case "at"     : return make_indent(exp,"at");
      case "align"  : return make_indent(exp,"align");
      case "dimension": return make_indent(exp,"in");
      case "rotated"     : return make_indent(exp,"rotated");
      case "anchored"     : return make_indent(exp,"anchored");
      case "positioned"     : return make_indent(exp,"positioned");
      case "for"   : return gen_for   (exp);
      case "while"   : return gen_while   (exp);
      case "prog"   : return js_prog   (exp);
      case "call"   : return js_call   (exp);
      default:
      throw new Error("Dunno how to generate mcfunction for " +exp.type+" in" + oldFile);
    }
  }
  function comment(exp){
    if(exp.value.trim() == '#'){
      return ''
    }
    if(exp.value.trim() == '##'){
      return '\n'
    }
    return exp.value
  }
  function js_atom(exp) {
    return JSON.stringify(exp.value); // cheating ;-)
  }
  function make_var(name) {
    return name;
  }
  function js_var(exp) {
    return make_var(exp.value);
  }
  function js_binary(exp) {
    let selector = exp.left.selector ? exp.left.selector : exp.left
    let selector2 = exp.right.selector ? exp.right.selector : exp.right
    if(exp.operator == "=") return js_assign(exp)
    else if(exp.operator == "+=" && vars.indexOf(exp.left.value) >= 0 && exp.right.type == "num") return 'scoreboard players add ' + selector.value  + ' ' + exp.left.value + ' ' + exp.right.value
    else if(exp.operator == "-=" && vars.indexOf(exp.left.value) >= 0 && exp.right.type == "num") return 'scoreboard players remove ' + selector.value  + ' ' + exp.left.value + ' ' + exp.right.value

    else if(exp.operator && vars.indexOf(exp.left.value) >= 0 && exp.right.type == "var" && vars.indexOf(exp.right.value) >= 0) return 'scoreboard players operation ' + selector.value  + ' ' + exp.left.value + ' '+exp.operator+' ' + selector2.value + ' ' + exp.right.value
    else throw exp.left.value + " is not declared or you messed something up!\n in: " + oldFile
  }
  // assign nodes are compiled the same as binary
  function js_assign(exp) {
    let selector = exp.left.selector ? exp.left.selector : exp.left
    let selector2 = exp.right.selector ? exp.right.selector : exp.right
    if(vars.indexOf(exp.left.value) >= 0 && exp.right.type == "num") return 'scoreboard players set ' + selector.value  + ' ' + exp.left.value + ' ' + exp.right.value
    else if(vars.indexOf(exp.left.value) >= 0 && exp.right.type == "var" && vars.indexOf(exp.right.value) >= 0) return 'scoreboard players operation ' + selector.value  + ' ' + exp.left.value + ' = ' + selector2.value + ' ' + exp.right.value
    else throw exp.left.value + " is not declared!\n in: " + oldFile
  }
  function js_init(exp){
    if(vars.indexOf(exp.name) < 0){
    vars.push(exp.name)
    let selector = exp.selector ? exp.selector.value : exp.name
    if(processed['mcscript/load']) processed['mcscript/load'] += 'scoreboard objectives add ' + exp.name + ' dummy\n' + 'scoreboard players set ' + selector + ' ' + exp.name + ' 0\n'
    else processed['mcscript/load'] = '#extend: '+ prjPath +'/mcscript/load\n# please do not touch this file!\n# it is used by the compiler!\nscoreboard objectives add ' + exp.name + ' dummy\n'  + 'scoreboard players set ' + selector + ' ' + exp.name + ' 0\n'
    if(exp.assign) return js_assign(exp.assign)
  } else console.error( "\x1b[31m","The varible " + exp.name + " was declared multiple times!","\x1b[0m")
  }
  function js_const(exp){
    if(exp.value && exp.assign != null){
      consts.push({name: exp.value, value: exp.assign})
    }
    return ""
  }
  function js_let(exp) {
    if (exp.vars.length == 0)
    return js(exp.body);
    var iife = {
      type: "call",
      func: {
        type: "lambda",
        vars: [ exp.vars[0].name ],
        body: {
          type: "let",
          vars: exp.vars.slice(1),
          body: exp.body
        }
      },
      args: [ exp.vars[0].def || FALSE ]
    };
    return "(" + js(iife) + ")";
  }
  function make_if(exp){
    let res = make_indent(exp,"if")
    let _else = ""
    if(exp.else){
      exp.then = exp.else
      _else = make_indent(exp,"unless")
    }
    return res + "\n" + _else
  }
  function testforBinary(cond){
    let selector = cond.left.selector ? cond.left.selector : cond.left
    let selector2 = cond.right.selector ? cond.right.selector : cond.right
    if(cond.right.type == "var"){
      return " score " + selector.value+ ' '+ cond.left.value + ' ' + cond.operator.value + ' '+ selector2.value + ' ' + cond.right.value
    } else if(cond.right.type == "num" && cond.operator.value == "=="){
      return " score " + selector.value+ ' '+ cond.left.value + ' matches ' + cond.right.value
    }
    else if(cond.right.type == "num" && cond.operator.value == ">"){
      return " score " + selector.value+ ' '+ cond.left.value + ' matches ' + (cond.right.value + 1) + '..'
    }
    else if(cond.right.type == "num" && cond.operator.value == "<"){
      return " score " + selector.value+ ' '+ cond.left.value + ' matches ..' + (cond.right.value - 1)
    }
    else if(cond.right.type == "num" && cond.operator.value == ">="){
      return " score " + selector.value+ ' '+ cond.left.value + ' matches ' + cond.right.value + '..'
    }
    else if(cond.right.type == "num" && cond.operator.value == "<="){
      return " score " + selector.value+ ' '+ cond.left.value + ' matches ..' + cond.right.value
    }
    else throw "Don´t know what you mean with " + cond.operator.value + '?\n In: ' + oldFile
  }
  function make_indent(exp,name) {
    let commands = []
    let subTree = []
    subTree = subTree.concat(js(exp.then).split("\n"))
    for(let sT of subTree){
      if(sT == "") continue
      let middle = ""
      let nestedMiddle = ""
      for(let cond of exp.cond){
        let nameOp = name
        if(cond.not && name == "if") nameOp = "unless"
        if(cond.not && name == "unless") nameOp = "if"
        if(cond.type == "selector" && name == "if") nameOp += " entity"
        if(cond.type == "binary" && name == "if"){
          middle += testforBinary(cond)
        }

        if(exp.nest){
          for(let nested of exp.nest){
            for(let nestedCond of nested.cond){
              let keyWord = nested.type
              if(nestedCond.not && nested.type == "if") keyWord = "unless"
              if(nestedCond.not && nested.type == "unless") keyWord = "if"
              if(nestedCond.type == "selector" && (nested.type == "if" || nested.type == "unless")) keyWord += " entity"
              if(nestedCond.op && nestedCond.op == "or"){
                commands.push("execute" + " " + nameOp +" " + cond.value + " " + keyWord +" " + nestedCond.value + " run " + sT)
              } else nestedMiddle += " " + keyWord +" " + nestedCond.value
            }
          }
        }
        if(cond.value) middle += " " + nameOp +" " + cond.value

        if(cond.op && cond.op == "or"){
          commands.push("execute" + " " + nameOp +" " + cond.value + nestedMiddle + " run " + sT)
        }
      }
      commands.push("execute" + middle + nestedMiddle + " run " + sT)
    }
    return commands.join("\n")
  }
  function js_prog(exp) {
    return "" + exp.prog.map(js).join("\n") + "";
  }
  function js_call(exp) {
    for(let mod of modals){
      if(mod.func == exp.func.value){
        return gen_modal(mod, exp)
      }
    }
    if(exp.func.value == "for") return gen_for(exp)
    return js(exp.func) + "(" + exp.args.map(js).join(", ") + ")";
  }
  function gen_for(exp){
    if(exp.args[0].type == "num" && exp.args[1].type == "num"){
      let output = []
      let variable = "i"
      if(exp.args[2]){
        variable = exp.args[2].value
      }
      for(let i = exp.args[0].value; i <= exp.args[1].value; i++){
        output.push(js(exp.after).split("$("+variable+")").join(i))
      }
      return output.join("\n")
    } else {
      throw new Error("Check your Loop arguments")
    }
  }
  function gen_while(exp){
    genID++
    retString = "#file: " + prjPath + '/mcscript/while_' + genID + '\n'
    retString += js(exp.then) + '\n'
    retString = retString.split('#stop').join('tag @s add mcscriptStop')
    retString = retString.split('#continue').join("function " + prjName + ':mcscript/while_' + genID)
    let middle = ""
    if(exp.cond.length < 1) throw("You must specify an argument for while! ("+oldFile+")")
    for(let cond of exp.cond){
      let nameOp = "if"
      if(cond.not) nameOp = "unless"
      if(cond.type == "binary"){
        middle += testforBinary(cond)
      }

      if(cond.op && cond.op == "or"){
        retString += "execute if entity @s[tag=!mcscriptStop]" + " " + nameOp +" " + cond.value + " run function " + prjName + ':mcscript/while_' + genID + '\n'
      } else {
        if(cond.value) middle += " " + nameOp +" " + cond.value
      }
    }
    retString += "execute if entity @s[tag=!mcscriptStop]" + middle + " run function " + prjName + ':mcscript/while_' + genID + '\n'
    retString += 'tag @s[tag=mcscriptStop] remove mcscriptStop'
    processed['while_' + genID] = retString
    return "function " + prjName + ':mcscript/while_' +genID
  }
  function js_modal(exp){
    exp.call.after = js(exp.call.after)
    modals.push(exp.call)
    return
  }
  function gen_modal(modal,exp){
    let after = modal.after
    modal.args.forEach((arg, num) => {
      if(exp.args[num] || arg.type == 'assign') {
        let newVal
        let oldVal
        if(arg.type == 'assign'){
          newVal = exp.args[num] ? exp.args[num].value : arg.right.value
          oldVal = arg.left.value
        } else {
          newVal = exp.args[num].value
          oldVal = arg.value
        }
        after = after.split('$(' + oldVal + ')').join(newVal)
      }
      else throw "At modal call \"" + modal.func + "\" no " + num+ ". argument was found!"
    })
    return after
  }
}

function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

getFiles = function(dir) {
  var results = [];
  var list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    var stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      /* Recurse into a subdirectory */
      results = results.concat(getFiles(file));
    } else {
      /* Is a file */
      if(file.split(".").pop() == "mcscript") results.push(file);
    }
  });
  return results;
}

exports.getFiles = getFiles
exports.getModals = function(ast,oldFile){
  let data = generate(ast)
  let file = oldFile.replace(".mcscript","")
  ensureDirectoryExistence(file)
  fs.writeFile(file + '.json', JSON.stringify(modals), (err) => {
    if (err) throw err;
    console.log("\x1b[36m","Generated Modal file ","\x1b[33m",file + '.json',"\x1b[0m")
  });
}
exports.parseCode = function(ast,oldFile){
  // let stream = InputStream(str)
  // let output = TokenStream(stream)
  // let ast = parse(output)
  // console.log(JSON.stringify(ast))
  let data = generate(ast,oldFile)
  fs.writeFile('test.mcfunction', data, (err) => {
    if (err) throw err;
    console.log("\x1b[36m","Generated ","\x1b[33m",file + '.mcfunction',"\x1b[0m")
  });
  if(oldFile.split("/").splice(-2).join('/') == 'functions/load.mcscript'){
    data = '#file: ./mcscript/load\n' + data
  }
  let savedData = data
  let extendArr = []
  data = data.split("#file: ")
  for(let datChunk of data){
    let extended = datChunk.split("#extend: ")
    if(extended.length > 1){
      extendArr = extended.slice(1)
      data[data.indexOf(datChunk)] = extended[0]
    }
  }
  checkFilename(data,oldFile,function(file,dat){
    dat =  "#######\n# Compiled from "+oldFile.split("/").splice(-4).join('/')+"\n# to "+ file.split("\\").splice(-4).join('/') + ".mcfunction\n#\n# Generated by Minecraft Script for 1.13\n######\n" + dat.join("\n")

    ensureDirectoryExistence(file)
    fs.writeFile(file + '.mcfunction', dat, (err) => {
      if (err) throw err;
      console.log("\x1b[36m","Generated ","\x1b[33m",file + '.mcfunction',"\x1b[0m")
    });
  })

  // extend file
  extendArr.push("")
  checkFilename(extendArr,oldFile,function(file,dat){
    dat =  "\n# Extended from "+oldFile.split("/").splice(-4).join('/')+"\n# to "+ file.split("\\").splice(-4).join('/') + ".mcfunction\n" + dat.join("\n")

    ensureDirectoryExistence(file)
    fs.appendFile(file + '.mcfunction', dat, (err) => {
      if (err) throw err;
      console.log("\x1b[36m","Extended ","\x1b[33m",file + '.mcfunction',"\x1b[0m")
    });
  },true)
}

function checkFilename(data,oldFile,then,ignoreSingle = false){
  if(data.length > 1){
    data.forEach(dat => {
      if(dat != ""){
        dat = dat.split("\n")
        let file = dat[0].trim()
        if(file.substring(0,2) == "./") {
          file = oldFile.substring(0,oldFile.lastIndexOf('/') + 1) + file.substring(2,file.length)
        }
        if(file.substring(0,3) == "../") {
          let uri = oldFile.split("\\")
          uri.splice(uri.length - 1)
          file = uri.join("/") + file.substring(3,file.length)
        }
        dat.shift(0)
        then(file,dat)
      }
    })
  } else {
    let file = oldFile.replace(".mcscript","")
    if(!ignoreSingle) then(file,data)
  }
}
// fs.readFile('./code.mcjs', {encoding: "utf8"}, function(err, data) {
//   parseCode(data)

// let array = []
// let iscurrent = true
// while(iscurrent){
//   let d = output.next()
//   if(d){
//     array.push(d)
//     iscurrent = true
//   } else iscurrent = false
// }
// console.log(array)
// });
