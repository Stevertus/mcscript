const fs = require('fs');
const path = require('path')
const Finder = require('fs-finder')
const basicModals = require('./modals/basic.json')
var modals = []
modals = modals.concat(basicModals)

generate = function(exp) {
  return js(exp);

  function js(exp) {
    switch (exp.type) {
      case "num"    :
      case "str"    :
      case "comment"   : return comment(exp);
      case "command"   : return exp.value;
      case "modal"   : return js_modal (exp);
      case "bool"   : return js_atom   (exp);
      case "var"    : return js_var    (exp);
      case "binary" : return js_binary (exp);
      case "assign" : return js_assign (exp);
      case "let"    : return js_let    (exp);
      case "lambda" : return js_lambda (exp);
      case "if"     : return make_if(exp);
      case "as"     : return make_indent(exp,"as");
      case "at"     : return make_indent(exp,"at");
      case "align"  : return make_indent(exp,"align");
      case "dimension": return make_indent(exp,"in");
      case "rotated"     : return make_indent(exp,"rotated");
      case "anchored"     : return make_indent(exp,"anchored");
      case "positioned"     : return make_indent(exp,"positioned");
      case "for"   : return gen_for   (exp);
      case "prog"   : return js_prog   (exp);
      case "call"   : return js_call   (exp);
      default:
      throw new Error("Dunno how to make_js for " + JSON.stringify(exp));
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
    return "" + js(exp.left) + exp.operator + js(exp.right) + "";
  }
  // assign nodes are compiled the same as binary
  function js_assign(exp) {
    return js_binary(exp);
  }
  function js_lambda(exp) {
    var code = "(function ";
    if (exp.name)
    code += make_var(exp.name);
    code += "(" + exp.vars.map(make_var).join(", ") + ") {";
    code += "return " + js(exp.body) + " })";
    return code;
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

        if(exp.nest){
          for(let nested of exp.nest){
            for(let nestedCond of nested.cond){
              console.log(nestedCond)
              if(nestedCond.not && nestedCond.type == "if") nestedCond.type = "unless"
              if(nestedCond.not && nestedCond.type == "unless") nestedCond.type = "if"
              if(nestedCond.op && nestedCond.op == "or"){
                commands.push("execute" + " " + nameOp +" " + cond.value + " " + nested.type +" " + nestedCond.value + " run " + sT)
              } else nestedMiddle += " " + nested.type +" " + nestedCond.value
            }
          }
        }
        middle += " " + nameOp +" " + cond.value

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

exports.getFiles = function (dir){
  var files = Finder.from(dir).findFiles('*.mcscript');
  return files
}
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
  let data = generate(ast)
  data = data.split("#file: ")
  if(data.length > 1){
    data.forEach(dat => {
      if(dat != ""){
        dat = dat.split("\n")
        let file = dat[0].trim()
        if(file.substring(0,2) == "./") {
          file = oldFile.substring(0,oldFile.lastIndexOf('\\') + 1) + file.substring(2,file.length)
        }
        if(file.substring(0,3) == "../") {
          let uri = oldFile.split("\\")
          uri.splice(uri.length - 1)
          file = uri.join("/") + file.substring(3,file.length)
        }
        dat.shift(0)
        dat =  "#######\n# Compiled from "+oldFile.split("\\").splice(-4).join('/')+"\n# to "+ file.split("\\").splice(-4).join('/') + ".mcfunction\n#\n# Generated by Minecraft Script for 1.13\n######\n" + dat.join("\n")

        //console.log(path.dirname(oldFile.split("/").shift()))
        ensureDirectoryExistence(file)
          fs.writeFile(file + '.mcfunction', dat, (err) => {
            if (err) throw err;
            console.log("\x1b[36m","Generated ","\x1b[33m",file + '.mcfunction',"\x1b[0m")
          });
      }
    })
  } else {
    let file = oldFile.replace(".mcscript","")
    data =  "#######;\n# Compiled from "+oldFile+";\n# to "+ file + ".mcfunction;\n#;\n# Generated by Minecraft Script for 1.13;\n######;\n" + data[0]
    if(ensureDirectoryExistence(file) == true){
      fs.writeFile(file + '.mcfunction', data, (err) => {
        if (err) throw err;
        console.log("\x1b[36m","Generated ","\x1b[33m",file + '.mcfunction',"\x1b[0m")
      });
    }
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
