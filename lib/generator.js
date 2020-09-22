const fs = require("fs");
const path = require("path");
const basicModals = require("./modals/basic.json");
const camModals = require("./modals/cam.json");
const vm = require("vm");

let modals = [];
let genID = 0;
let vars = [];
let tags = [];
let tagOhne = false;
let consts = [];
modals = modals.concat(basicModals);
modals = modals.concat(camModals);

// generate method
generate = function (
  exp,
  oldFile,
  prjPath = oldFile.split("/").indexOf("functions"),
  prjName = "noname"
) {
  let processed = {};

  let res = js(exp);
  res = res.split("run execute ").join("");
  for (let pro in processed) res += processed[pro];
  for (let cnst of consts) {
    res = gen_const(res, cnst.name, cnst.value);
  }
  return res;

  function js(exp) {
    if (exp)
      switch (exp.type) {
        case "num":
        case "str":
        case "comment":
          return comment(exp);
        case "command":
          return exp.value;
        case "stop":
          return "#stop";
        case "continue":
          return "#continue";
        case "modal":
          return js_modal(exp);
        case "bool":
          return js_atom(exp);
        case "initbool":
          return js_initBool(exp);
        case "initvar":
          return js_init(exp);
        case "const":
          return js_const(exp);
        case "var":
          return js_var(exp);
        case "binary":
          return js_binary(exp);
        case "assign":
          return js_assign(exp);
        case "let":
          return js_let(exp);
        case "if":
          return make_if(exp);
        case "switch":
          return make_switch(exp);
        case "as":
          return make_indent(exp, "as");
        case "asat":
          return make_indent(exp, "asat");
        case "at":
          return make_indent(exp, "at");
        case "align":
          return make_indent(exp, "align");
        case "dimension":
          return make_indent(exp, "in");
        case "in":
          return make_indent(exp, "in");
        case "rotated":
          return make_indent(exp, "rotated");
        case "anchored":
          return make_indent(exp, "anchored");
        case "positioned":
          return make_indent(exp, "positioned");
        case "modaljs":
          return js_modaljs(exp);
        case "func":
          return gen_func(exp);
        case "run_func":
          return gen_run_func(exp);
        case "for":
          return gen_for(exp);
        case "forEach":
          return gen_forEach(exp);
        case "raycast":
          return gen_raycast(exp);
        case "while":
          return gen_while(exp);
        case "dowhile":
          return gen_while(exp, false, "dowhile$(id)");
        case "prog":
          return js_prog(exp);
        case "call":
          return js_call(exp);
        default:
          throw new Error(
            "There is no way " + exp.type + " could generate in " + oldFile
          );
      }
  }
  function gen_const(text, oldVal, newVal) {
    const con = text.split("$(" + oldVal + ")");
    con.forEach((x, i) => {
      let tempVal = newVal;
      // if repl method is called
      // see if value of map is called
      if (tempVal instanceof Object && x[0] == ".") {
        let key = "";
        let k = 1;
        while (
          x[k] &&
          x[k] != " " &&
          x.substr(k, 5) !== ".repl" &&
          x[k] != "\n" &&
          x[k] != "\r"
        ) {
          key += x[k];
          k++;
        }
        x = x.substr(k);
        con[i] = con[i].substr(k);
        tempVal = tempVal[key];
      }
      if (x.substr(0, 5) === ".repl") {
        let strArr = [];
        if (x.substr(6, 1) === "'") strArr = x.split("'");
        else strArr = x.split('"');
        // regExp or not?
        if (strArr[1][0] === "/") {
          strArr[1] = strArr[1].substr(1, strArr[1].length - 2);
          let regs = new RegExp(strArr[1]);
          tempVal = newVal.replace(regs, strArr[3]);
        } else tempVal = tempVal.split(strArr[1]).join(strArr[3]);
        con[i] = tempVal + strArr[4].substr(1);
      } else {
        if (i !== 0) con[i] = tempVal + con[i];
      }
    });
    return con.join("");
  }
  function comment(exp) {
    if (exp.value.trim() === "#") {
      return "";
    }
    if (exp.value.trim() === "##") {
      return "\n";
    }
    return exp.value;
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
    let selector = exp.left.selector ? exp.left.selector : exp.left;
    let selector2 = exp.right.selector ? exp.right.selector : exp.right;
    if (exp.operator === "=") return js_assign(exp);
    else if (
      exp.operator === "+=" &&
      vars.indexOf(exp.left.value) >= 0 &&
      exp.right.type === "num"
    )
      return (
        "scoreboard players add " +
        selector.value +
        " " +
        exp.left.value +
        " " +
        exp.right.value
      );
    else if (
      exp.operator === "-=" &&
      vars.indexOf(exp.left.value) >= 0 &&
      exp.right.type === "num"
    )
      return (
        "scoreboard players remove " +
        selector.value +
        " " +
        exp.left.value +
        " " +
        exp.right.value
      );
    else if (
      exp.operator &&
      vars.indexOf(exp.left.value) >= 0 &&
      exp.right.type === "var" &&
      vars.indexOf(exp.right.value) >= 0
    )
      return (
        "scoreboard players operation " +
        selector.value +
        " " +
        exp.left.value +
        " " +
        exp.operator +
        " " +
        selector2.value +
        " " +
        exp.right.value
      );
    else
      throw (
        exp.left.value +
        " is not declared or you messed something up!\n in: " +
        oldFile
      );
  }

  // assign nodes are compiled the same as binary
  function js_assign(exp) {
    if (exp.left.value && exp.left.value.substr(0, 3) === "no!")
      exp.left.value = exp.left.value.substr(3);
    if (tags.indexOf(exp.name) < 0 && exp.right.type === "bool")
      return js_assignBool(exp);
    let selector = exp.left.selector ? exp.left.selector : exp.left;
    let selector2 = exp.right.selector ? exp.right.selector : exp.right;
    if (vars.indexOf(exp.left.value) >= 0 && exp.right.type === "num")
      return (
        "scoreboard players set " +
        selector.value +
        " " +
        exp.left.value +
        " " +
        exp.right.value
      );
    if (vars.indexOf(exp.left.value) >= 0 && exp.right.type === "command")
      return (
        "execute store result score " +
        selector.value +
        " " +
        exp.left.value +
        " run " +
        exp.right.value
      );
    else if (
      vars.indexOf(exp.left.value) >= 0 &&
      exp.right.type === "var" &&
      vars.indexOf(exp.right.value) >= 0
    )
      return (
        "scoreboard players operation " +
        selector.value +
        " " +
        exp.left.value +
        " = " +
        selector2.value +
        " " +
        exp.right.value
      );
    else throw exp.left.value + " is not declared!\n in: " + oldFile;
  }

  function js_init(exp) {
    let genScore = true;
    let type = "dummy";

    if (exp.name.substr(0, 3) === "no!") {
      genScore = false;
      exp.name = exp.name.substr(3);
    }
    if (exp.trigger) {
      type = "trigger";
    }

    try {
      if (vars.indexOf(exp.name) < 0) {
        vars.push(exp.name);
        if (genScore) {
          if (processed["mcscript/load"])
            processed["mcscript/load"] +=
              "scoreboard objectives add " + exp.name + " " + type + "\n";
          else
            processed["mcscript/load"] =
              "#extend: " +
              prjPath +
              "/mcscript/load\n# please do not touch this file!\n# it is used by the compiler!\nscoreboard objectives add " +
              exp.name +
              " " +
              type +
              "\n";
        }
        if (exp.assign) return js_assign(exp.assign);
      } else {
        console.error(
          "\x1b[31m",
          "The variable " + exp.name + " was declared multiple times!",
          "\x1b[0m"
        );
        return js_assign(exp.assign);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function js_initBool(exp) {
    if (tags.indexOf(exp.name) < 0) {
      tags.push(exp.name);
      if (exp.assign) return js_assignBool(exp.assign);
    } else {
      console.error(
        "\x1b[31m",
        "The boolean " + exp.name + " was declared multiple times!",
        "\x1b[0m"
      );
      return js_assignBool(exp.assign);
    }
  }

  function js_assignBool(exp) {
    if (!exp.left.selector && !tagOhne) {
      if (processed["mcscript/load"])
        processed["mcscript/load"] +=
          "execute unless entity @e[tag=mcscriptTags] at @p run summon armor_stand ~ ~ ~ {Tags:[mcscriptTags],Invisible:1,Invulnerable:1,NoGravity:1}\n";
      else
        processed["mcscript/load"] =
          "#extend: " +
          prjPath +
          "/mcscript/load\n# please do not touch this file!\n# it is used by the compiler!\nexecute unless entity @e[tag=mcscriptTags] at @p run summon armor_stand ~ ~ ~ {Tags:[mcscriptTags],Invisible:1,Invulnerable:1,NoGravity:1}\n";
      tagOhne = true;
    }
    let selector = exp.left.selector
      ? exp.left.selector.value
      : "@e[tag=mcscriptTags]";
    if (exp.right.value) return "tag " + selector + " add " + exp.left.value;
    return "tag " + selector + " remove " + exp.left.value;
  }

  function js_const(exp) {
    if (exp.value && exp.assign != null) {
      consts.push({ name: exp.value, value: exp.assign });
    }
    return "";
  }

  function js_let(exp) {
    if (exp.vars.length === 0) return js(exp.body);
    const iife = {
      type: "call",
      func: {
        type: "lambda",
        vars: [exp.vars[0].name],
        body: {
          type: "let",
          vars: exp.vars.slice(1),
          body: exp.body,
        },
      },
      args: [exp.vars[0].def || FALSE],
    };
    return "(" + js(iife) + ")";
  }

  function make_switch(exp) {
    let name = exp.var.value;
    let def = exp.cases.find((x) => x.type === "default");
    let res = "";
    if (def) exp.cases.splice(exp.cases.indexOf(def), 1);
    for (let cased of exp.cases) {
      if (cased.then.type !== "prog") {
        let save = cased.then;
        cased.then = { type: "prog", prog: [] };
        cased.then.prog.push(save);
      }
      cased.then.prog.push({
        type: "command",
        value: "tag @s add mcscriptSwitch",
      });
      cased.cond.push({ type: "str", value: "entity @s[tag=!mcscriptSwitch]" });
      res += make_if(cased);
    }
    if (def) {
      def.cond = [{ type: "str", value: "entity @s[tag=!mcscriptSwitch]" }];
      res += make_if(def);
    }
    res += "tag @s remove mcscriptSwitch";
    return res;
  }

  function make_if(exp) {
    let res = make_indent(exp, "if");
    let _else = "";
    if (exp.else) {
      exp.then = exp.else;
      _else = make_indent(exp, "unless");
    }
    return res + "\n" + _else;
  }

  function gen_func(exp) {
    let name = exp.name.replace("./", "");
    if (exp.prog) {
      processed[name] =
        "#file: ./" +
        name +
        "\n# this file is generated based on a function specified in" +
        oldFile +
        "\n";
      processed[name] += js(exp.prog);
    }
    return "";
  }

  function gen_run_func(exp) {
    if (exp.func.prog) {
      gen_func(exp.func);
      return "function " + prjName + ":" + exp.func.name.replace("./", "");
    }
    if (exp.func.name)
      return "function " + prjName + ":" + exp.func.name.replace("./", "");
    throw "don´t know how to generate run function in " + filename;
  }

  function testforBinary(cond) {
    let selector = cond.left.selector ? cond.left.selector : cond.left;
    let selector2 = cond.right.selector ? cond.right.selector : cond.right;
    if (cond.right.type === "var") {
      return (
        " score " +
        selector.value +
        " " +
        cond.left.value +
        " " +
        cond.operator +
        " " +
        selector2.value +
        " " +
        cond.right.value
      );
    } else if (cond.right.type === "num" && cond.operator === "==") {
      return (
        " score " +
        selector.value +
        " " +
        cond.left.value +
        " matches " +
        cond.right.value
      );
    } else if (cond.right.type === "num" && cond.operator === ">") {
      return (
        " score " +
        selector.value +
        " " +
        cond.left.value +
        " matches " +
        (cond.right.value + 1) +
        ".."
      );
    } else if (cond.right.type === "num" && cond.operator === "<") {
      return (
        " score " +
        selector.value +
        " " +
        cond.left.value +
        " matches .." +
        (cond.right.value - 1)
      );
    } else if (cond.right.type === "num" && cond.operator === ">=") {
      return (
        " score " +
        selector.value +
        " " +
        cond.left.value +
        " matches " +
        cond.right.value +
        ".."
      );
    } else if (cond.right.type === "num" && cond.operator === "<=") {
      return (
        " score " +
        selector.value +
        " " +
        cond.left.value +
        " matches .." +
        cond.right.value
      );
    } else
      throw (
        "Don´t know what you mean with " + cond.operator + "?\n In: " + oldFile
      );
  }

  function make_indent(exp, name) {
    let commands = [];
    let subTree = [];
    subTree = subTree.concat(js(exp.then).split("\n"));
    let middle = "";
    let nestedMiddle = "";
    let savedExtendedCommands = [];
    for (let cond of exp.cond) {
      let nameOp = name;
      if (cond.not && name === "if") nameOp = "unless";
      if (cond.not && name === "unless") nameOp = "if";
      if (cond.type === "selector" && (name === "unless" || name === "if"))
        nameOp += " entity";
      if (
        cond.type === "var" &&
        tags.indexOf(cond.value) !== -1 &&
        (name === "unless" || name === "if")
      ) {
        nameOp += " entity";
        if (cond.selector && cond.selector.value.slice(-1) === "]")
          cond.value =
            cond.selector.value.substr(0, cond.selector.value.length - 1) +
            ",tag=" +
            cond.value +
            "]";
        else if (cond.selector)
          cond.value = cond.selector.value + "[tag=" + cond.value + "]";
        else cond.value = "@e[tag=mcscriptTags,tag=" + cond.value + "]";
      } else if (
        cond.type === "var" &&
        vars.indexOf(cond.value) !== -1 &&
        (name === "unless" || name === "if")
      ) {
        nameOp += " score";
        if (cond.selector) cond.value = cond.selector.value + "matches 1..";
        else cond.value = cond.value + " matches 1..";
      }

      if (name === "asat") {
        nameOp = "as " + cond.value + " at";
        cond.value = "@s";
      }

      if (exp.nest) {
        for (let nested of exp.nest) {
          for (let nestedCond of nested.cond) {
            let keyWord = nested.type;
            let additions = "";
            if (nestedCond.not && nested.type === "if") keyWord = "unless";
            if (nestedCond.not && nested.type === "unless") keyWord = "if";
            if (nested.type === "dimension") keyWord = "in";
            if (
              nestedCond.type === "selector" &&
              (nested.type === "if" || nested.type === "unless")
            )
              keyWord += " entity";
            if (nested.type === "asat") {
              keyWord = "as " + nestedCond.value + " at";
              nestedCond.value = "@s";
            }

            if (nestedCond.op && nestedCond.op === "or") {
              savedExtendedCommands.push(
                "execute" +
                  " " +
                  nameOp +
                  " " +
                  cond.value +
                  " " +
                  keyWord +
                  " " +
                  nestedCond.value +
                  " run "
              );
            } else {
              if (nestedCond.value !== undefined)
                nestedMiddle +=
                  " " + keyWord + " " + nestedCond.value + additions;
              else if (
                cond.type === "binary" &&
                (name === "if" || name === "unless")
              ) {
                nestedMiddle += " " + keyWord + testforBinary(cond);
              }
            }
          }
        }
      }
      if (cond.op && cond.op === "or") {
        if (cond.value !== undefined)
          savedExtendedCommands.push(
            "execute" + " " + nameOp + " " + cond.value + nestedMiddle + " run "
          );
        else if (cond.type === "binary")
          savedExtendedCommands.push(
            "execute" +
              " " +
              nameOp +
              " " +
              testforBinary(cond) +
              nestedMiddle +
              " run "
          );
      } else {
        if (cond.value !== undefined) middle += " " + nameOp + " " + cond.value;
        if (cond.type === "binary" && (name === "unless" || name === "if")) {
          middle += " " + nameOp + testforBinary(cond);
        }
      }
    }
    for (let sT of subTree) {
      if (sT === "") continue;
      commands.push("execute" + middle + nestedMiddle + " run " + sT);
      for (let saved of savedExtendedCommands) {
        commands.push(saved + sT);
      }
    }
    return commands.join("\n");
  }

  function js_prog(exp) {
    return "" + exp.prog.map(js).join("\n") + "";
  }

  function js_call(exp) {
    for (let mod of modals) {
      if (mod.func === exp.func.value) {
        return gen_modal(mod, exp);
      }
    }
    if (exp.func.value === "for") return gen_for(exp);
    return js(exp.func) + "(" + exp.args.map(js).join(", ") + ")";
  }

  function gen_for(exp) {
    if (exp.args[0].type === "num" && exp.args[1].type === "num") {
      let output = [];
      let variable = "i";
      if (exp.args[2]) {
        variable = exp.args[2].value;
      }
      for (let i = exp.args[0].value; i <= exp.args[1].value; i++) {
        output.push(
          js(exp.after)
            .split("$(" + variable + ")")
            .join(i)
        );
      }
      return output.join("\n");
    } else {
      throw new Error("Check your Loop arguments");
    }
  }

  function gen_raycast(exp) {
    let id = genID + 1;
    let init = {
      type: "initvar",
      name: "mcscript_raycast",
      assign: {
        type: "assign",
        operator: "=",
        left: {
          type: "var",
          value: "mcscript_raycast",
          selector: "raycast" + id,
        },
        right: { type: "num", value: 0 },
      },
    };
    let res = js_init(init);
    let whileObj = {
      cond: {},
      then: { type: "prog", prog: [] },
      after: { type: "prog", prog: [] },
    };
    if (exp.while) {
      if (exp.while.type === "prog") whileObj.then = exp.while;
      else whileObj.then.prog.push(exp.while);
    }
    whileObj.then.prog.push({
      type: "command",
      value: "scoreboard players add raycast" + id + " mcscript_raycast 1",
    });
    let end = {
      type: "if",
      cond: [
        {
          type: "str",
          value:
            "score raycast" +
            id +
            " mcscript_raycast matches .." +
            exp.duration +
            " if entity @s[tag=mcscriptStop] positioned ^ ^ ^1",
        },
      ],
      then: exp.end,
    };
    whileObj.after.prog.push(end);
    let operator = "unless";
    if (exp.notblock) operator = "if";
    if (exp.toBlock)
      operator = "if block ~ ~ ~ " + exp.toBlock + " " + operator;
    if (exp.entity) {
      let entity = exp.entity;
      if (entity.slice(-1) === "]")
        entity =
          entity.substr(0, entity.length - 1) + ",distance=..0.7,sort=nearest]";
      else entity += "[distance=..0.7,sort=nearest]";
      whileObj.after.prog[0].cond[0].value +=
        " as " + entity.replace("0.7", "2") + " at @s";
      whileObj.then.prog.push({
        type: "command",
        value:
          "execute positioned ^ ^ ^1 if entity " +
          entity +
          " run tag @s add mcscriptStop",
      });
      whileObj.then.prog.push({
        type: "command",
        value:
          "execute positioned ^ ^ ^1 positioned ~ ~-1 ~ if entity " +
          entity +
          " run tag @s add mcscriptStop",
      });
    } else
      whileObj.then.prog.push({
        type: "command",
        value:
          "execute positioned ^ ^ ^1 " +
          operator +
          " block ~ ~ ~ " +
          exp.block +
          " run tag @s add mcscriptStop",
      });
    whileObj.cond = [
      { type: "str", value: "block ~ ~ ~ " + exp.block, not: exp.notblock },
      {
        type: "str",
        value:
          "score raycast" + id + " mcscript_raycast matches .." + exp.duration,
      },
    ];
    gen_while(whileObj, true, "raycast$(id)", " positioned ^ ^ ^1");
    return (
      "scoreboard players set raycast" +
      id +
      " mcscript_raycast 0\nexecute positioned ~ ~1 ~ run function " +
      prjName +
      ":mcscript/raycast" +
      id +
      "\n"
    );
  }
  function gen_forEach(exp) {
    let res = js_init(exp.var);
    if (exp.then.type === "prog") {
      exp.then.prog.push(exp.binary);
    } else {
      let save = exp.then;
      exp.then = { type: "prog", prog: [] };
      exp.then.prog.push(save);
      exp.then.prog.push(exp.binary);
    }
    res += "\n" + gen_while(exp, true, "foreach$(id)");
    return res;
  }

  function gen_while(
    exp,
    checkBefore = true,
    customName = "while$(id)",
    prefix = ""
  ) {
    genID++;
    if (exp.customName) customName = exp.customName.value;
    customName = customName.replace("$(id)", genID);
    retString = "#file: " + prjPath + "/mcscript/" + customName + "\n";
    if (exp.then) retString += js(exp.then) + "\n";
    retString = retString.split("#stop").join("tag @s add mcscriptStop");
    retString = retString
      .split("#continue")
      .join("function " + prjName + ":mcscript/" + customName);
    let middle = "";
    if (exp.cond.length < 1)
      throw "You must specify an argument for while! (" + oldFile + ")";
    for (let cond of exp.cond) {
      let nameOp = "if";
      if (cond.not) nameOp = "unless";
      if (cond.type === "binary") {
        middle += " " + nameOp + testforBinary(cond);
      }

      if (cond.op && cond.op === "or") {
        retString +=
          "execute" +
          prefix +
          " if entity @s[tag=!mcscriptStop]" +
          " " +
          nameOp +
          " " +
          cond.value +
          " run function " +
          prjName +
          ":mcscript/" +
          customName +
          "\n";
      } else {
        if (cond.value) middle += " " + nameOp + " " + cond.value;
      }
    }
    retString +=
      "execute" +
      prefix +
      " if entity @s[tag=!mcscriptStop]" +
      middle +
      " run function " +
      prjName +
      ":mcscript/" +
      customName +
      "\n";
    if (exp.after) retString += js(exp.after);
    retString += "tag @s[tag=mcscriptStop] remove mcscriptStop\n";
    processed[customName] = retString;
    if (checkBefore)
      return (
        "execute" +
        middle +
        " run function " +
        prjName +
        ":mcscript/" +
        customName
      );
    return "function " + prjName + ":mcscript/" + customName;
  }

  function js_modal(exp) {
    exp.call.after = js(exp.call.after);
    if (exp.override) {
      let old = modals.find((x) => x.func === exp.call.func);
      if (old) {
        modals[modals.indexOf(old)] = exp.call;
      } else
        console.error(
          "\x1b[31m",
          "You cannot override " +
            exp.call.func +
            ", because it does not exist. in: " +
            oldFile,
          "\x1b[0m"
        );
    } else {
      modals.push(exp.call);
    }
  }

  function gen_modal(modal, exp) {
    if (modal.type == "calljs") return gen_modaljs(modal, exp);
    let after = modal.after;
    modal.args.forEach((arg, num) => {
      if (exp.args[num] || arg.type === "assign") {
        let newVal;
        let oldVal;
        if (arg.type === "assign") {
          newVal = exp.args[num] ? exp.args[num].value : arg.right.value;
          oldVal = arg.left.value;
        } else {
          newVal = exp.args[num].value;
          oldVal = arg.value;
        }
        after = gen_const(after, oldVal, newVal);
      } else
        throw (
          'At modal call "' +
          modal.func +
          '" no ' +
          num +
          ". argument was found!"
        );
    });
    return after;
  }
  function js_modaljs(exp) {
    exp.call.type = "calljs";
    if (exp.override) {
      let old = modals.find((x) => x.func == exp.call.func);
      if (old) {
        modals[modals.indexOf(old)] = exp.call;
      } else
        console.error(
          "\x1b[31m",
          "You cannot override " +
            exp.call.func +
            ", because it does not exist. in: " +
            oldFile,
          "\x1b[0m"
        );
    } else {
      modals.push(exp.call);
    }
    return;
  }
  function gen_modaljs(modal, exp) {
    let jsArgs = {};
    for (var i = 0; i < modal.args.length; i++) {
      if (modal.args[i].type == "var") {
        jsArgs[modal.args[i].value] = exp.args[i].value;
      } else if (modal.args[i].type == "assign") {
        jsArgs[modal.args[i].left.value] = modal.args[i].right.value;
        if (exp.args[i]) {
          jsArgs[modal.args[i].left.value] = exp.args[i].value;
        }
      }
    }
    // nodejs way (more secure in a seperate vm)
    jsArgs.console = console;
    jsArgs.Math = Math;
    let virtualRes = vm.runInNewContext(
      "var res = function(){" + modal.after[0].value + "};res = res()",
      jsArgs
    );
    return jsArgs.res;
    // vanilla way for browser usage
    /*
      let virtualRes = new Function(...Object.keys(jsArgs).concat([modal.after[0].value]))
      return virtualRes(...Object.values(jsArgs));
      */
  }
};

function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

getFiles = function (dir, end) {
  if (!end) end = "mcscript";
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function (file) {
    file = dir + "/" + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      /* Recurse into a subdirectory */
      results = results.concat(getFiles(file, end));
    } else {
      /* Is a file */
      if (file.split(".").pop() === end) results.push(file);
    }
  });
  return results;
};
exports.clearVars = function () {
  modals = [];
  genID = 0;
  vars = [];
  tags = [];
  tagOhne = false;
  consts = [];
  modals = modals.concat(basicModals);
  modals = modals.concat(camModals);
};
exports.getFiles = getFiles;
exports.getModals = function (ast, oldFile) {
  let data = generate(ast, oldFile);
  let file = oldFile.replace(".mcscript", "");
  ensureDirectoryExistence(file);
  fs.writeFile(file + ".json", JSON.stringify(modals), (err) => {
    if (err) throw err;
    console.log(
      "\x1b[36m",
      "Generated Modal file ",
      "\x1b[33m",
      file + ".json",
      "\x1b[0m"
    );
  });
};
exports.getAst = function (ast, oldFile) {
  let file = oldFile.replace(".mcscript", "");
  ensureDirectoryExistence(file);
  fs.writeFile(file + ".json", JSON.stringify(ast), (err) => {
    if (err) throw err;
    console.log(
      "\x1b[36m",
      "Generated Json file ",
      "\x1b[33m",
      file + ".json",
      "\x1b[0m"
    );
  });
};
const parseCode = function (ast, oldFile, preOptions = null) {
  return new Promise(function (resolve, reject) {
    if (preOptions) {
      vars = vars.concat(preOptions.vars.filter((x) => vars.indexOf(x) === -1));

      modals = modals.concat(
        preOptions.modals.filter((x) => modals.indexOf(x) === -1)
      );

      tags = tags.concat(preOptions.tags.filter((x) => tags.indexOf(x) === -1));

      consts = consts.concat(
        preOptions.consts.filter((x) => consts.indexOf(x) === -1)
      );
    }
    if (oldFile.split(".").slice(-2).join(".") === "gl.mcscript")
      oldFile = oldFile.replace("gl.", "");
    oldFile = oldFile.replace(/scripts\//, "functions/");
    // let stream = InputStream(str)
    // let output = TokenStream(stream)
    // let ast = parse(output)
    // console.log(JSON.stringify(ast))
    let prjPath = oldFile.split("/").indexOf("functions");
    let prjName = "noname";
    if (prjPath > -1) {
      prjName = oldFile.split("/")[prjPath - 1];
      prjPath = oldFile
        .split("/")
        .slice(0, prjPath + 1)
        .join("/")
        .replace(".//", "");
    } else {
      prjPath = ".";
    }
    let data = generate(ast, oldFile, prjPath, prjName);
    if (
      oldFile.split("/").splice(-2).join("/") === "functions/load.mcscript" ||
      oldFile.split("/").splice(-2).join("/") === "scripts/load.mcscript"
    ) {
      data =
        "#file: ./mcscript/load\n#file: ./load\nfunction " +
        prjName +
        ":mcscript/load" +
        "\n" +
        data.replace("#file: ./load", "");
      if (tags.length)
        data +=
          "\nexecute unless entity @e[tag=mcscriptTags] at @p run summon armor_stand ~ ~ ~ {Tags:[mcscriptTags],Invisible:1,Invulnerable:1,NoGravity:1}";
    }
    let extendArr = [];
    data = data.split("#file: ");
    for (let datChunk of data) {
      let extended = datChunk.split("#extend: ");
      if (extended.length > 1) {
        extendArr = extended.slice(1);
        data[data.indexOf(datChunk)] = extended[0];
      }
    }
    checkFilename(data, oldFile, function (file, dat) {
      dat =
        "#######\n# Compiled from " +
        oldFile.split("/").splice(-4).join("/") +
        "\n# to " +
        file.split("\\").splice(-4).join("/") +
        ".mcfunction\n#\n# Generated by Minecraft Script for 1.16\n######\n" +
        dat.join("\n");

      ensureDirectoryExistence(file);
      fs.writeFile(file + ".mcfunction", dat, (err) => {
        if (err) throw err;
        console.log(
          "\x1b[36m",
          "Generated ",
          "\x1b[33m",
          file + ".mcfunction",
          "\x1b[0m"
        );
        resolve();
      });
    });

    // extend file
    extendArr.push("");
    checkFilename(
      extendArr,
      oldFile,
      function (file, dat) {
        dat =
          "\n# Extended from " +
          oldFile.split("/").splice(-4).join("/") +
          "\n# to " +
          file.split("\\").splice(-4).join("/") +
          ".mcfunction\n" +
          dat.join("\n");
        ensureDirectoryExistence(file);
        fs.appendFile(file + ".mcfunction", dat, (err) => {
          if (err) throw err;
          console.log(
            "\x1b[36m",
            "Extended ",
            "\x1b[33m",
            file + ".mcfunction",
            "\x1b[0m"
          );
        });
      },
      true
    );
  });
};
exports.parseCode = parseCode;
// only node.js
exports.getVars = function (ast, oldFile, preOptions = null) {
  parseCode(ast, oldFile, preOptions);
  return {
    vars: vars,
    modals: modals,
    tags: tags,
    consts: consts,
  };
};

function checkFilename(data, oldFile, then, ignoreSingle = false) {
  if (data.length > 1) {
    data.forEach((dat) => {
      if (dat !== "") {
        dat = dat.split("\n");
        let file = dat[0].trim();
        if (file.substring(0, 2) === "./") {
          file =
            oldFile.substring(0, oldFile.lastIndexOf("/") + 1) +
            file.substring(2, file.length);
        }
        if (file.substring(0, 3) === "../") {
          let uri = oldFile.split("\\");
          uri.splice(uri.length - 1);
          file = uri.join("/") + file.substring(3, file.length);
        }
        dat.shift(0);
        then(file, dat);
      }
    });
  } else {
    let file = oldFile.replace(".mcscript", "");
    if (!ignoreSingle) then(file, data);
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
