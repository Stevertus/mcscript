const fs = require("fs");
const consoletheme = require("./consoletheme.js");

const FALSE = { type: "str", value: "" };

//  return parse function
exports.parse = function (input) {
  const PRECEDENCE = {
    "=": 1,
    "||": 2,
    "&&": 3,
    "<": 7,
    ">": 7,
    "<=": 7,
    ">=": 7,
    "==": 7,
    "!=": 7,
    "+": 10,
    "-": 10,
    "+=": 10,
    "-=": 10,
    "*": 20,
    "/": 20,
    "%": 20,
    "*=": 20,
    "/=": 20,
    "%=": 20,
  };

  return parse_toplevel();

  // is_punc method: checks if character equals punc
  function is_punc(ch) {
    let tok = input.peek();
    return tok && tok.type === "punc" && (!ch || tok.value === ch) && tok;
  }

  // is_kw method: checks if string is a keyword
  function is_kw(kw) {
    let tok = input.peek();
    return tok && tok.type === "kw" && (!kw || tok.value === kw) && tok;
  }

  // is_op method: checks if character is an operator
  function is_op(op) {
    let tok = input.peek();
    return tok && tok.type === "op" && (!op || tok.value === op) && tok;
  }

  // skip_punc method: skips a punc
  function skip_punc(chs) {
    if (is_punc(chs)) input.next();
    else input.croak('Expecting punctuation: "' + chs + '"');
  }

  // skip_kw method: skips a keyword
  function skip_kw(kw) {
    if (is_kw(kw)) input.next();
    else input.croak('Expecting keyword: "' + kw + '"');
  }

  // skip_op method: skips an operator
  function skip_op(op) {
    if (is_op(op)) input.next();
    else input.croak('Expecting operator: "' + op + '"');
  }

  // unexpected method: throws unexpected-token-error
  function unexpected() {
    input.croak("Unexpected token: " + JSON.stringify(input.peek()));
  }

  // maybe_binary method: parses a maybe binary
  function maybe_binary(left, my_prec) {
    const tok = is_op();

    if (left && left.type === "var" && input.peek().value === "++") {
      input.next();
      return {
        type: "binary",
        operator: "+=",
        left: left,
        right: { type: "num", value: 1 },
      };
    }

    if (left && left.type === "var" && input.peek().value === "--") {
      input.next();
      return {
        type: "binary",
        operator: "-=",
        left: left,
        right: { type: "num", value: 1 },
      };
    }

    if (left && left.type === "var" && left.value.slice(-2) === "--") {
      left.value = left.value.substr(0, left.value.length - 2);
      return {
        type: "binary",
        operator: "-=",
        left: left,
        right: { type: "num", value: 1 },
      };
    }

    if (tok) {
      const his_prec = PRECEDENCE[tok.value];
      if (his_prec > my_prec) {
        input.next();

        return maybe_binary(
          {
            type: tok.value === "=" ? "assign" : "binary",
            operator: tok.value,
            left: left,
            right: maybe_binary(parse_atom(), his_prec),
          },
          my_prec
        );
      }
    }
    return left;
  }

  // delimited method: pares delimited code
  function delimited(start, stop, separator, parser) {
    let a = [],
      first = true;

    skip_punc(start);

    while (!input.eof()) {
      if (is_punc(stop)) break;
      if (first) first = false;
      else skip_punc(separator);
      if (is_punc(stop)) break;
      a.push(parser());
    }

    skip_punc(stop);
    return a;
  }
  function delimitedNoSep(start, stop, parser) {
    var a = [],
      first = true;
    skip_punc(start);
    while (!input.eof()) {
      if (is_punc(stop)) break;
      if (first) first = false; // else skip_punc(separator);
      if (is_punc(stop)) break;
      a.push(parser());
    }
    skip_punc(stop);
    return a;
  }
  // parse_call method: parses a method call
  function parse_call(func) {
    ret = {
      type: "call",
      func: func,
      args: delimited("(", ")", ",", parse_expression),
    };

    if (is_punc("{")) ret.after = parse_expression();

    return ret;
  }

  // parse_varname method: parses a var name
  function parse_varname() {
    const name = input.next();
    if (name.type !== "var") input.croak("Expecting variable name");
    return name.value;
  }

  // parse_if method: parses a if statement
  function parse_if(isnot = false) {
    skip_kw(isnot ? "unless" : "if");
    const cond = parse_key_args();

    // negate everything if unless is used
    if (isnot) {
      cond.forEach((c) => (c.not = c.not ? false : true));
    }

    input.next();
    if (!is_punc("{"))
      input.croak("The statements must be in a {} block. Please add a {.");

    const then = parse_expression();
    const ret = {
      type: "if",
      cond: cond,
      then: then,
    };

    if (is_kw("else")) {
      input.next();
      ret.else = parse_expression();
    }
    return ret;
  }

  // parse_while method: parses while loop
  function parse_while() {
    skip_kw("while");
    const cond = parse_key_args();
    input.next();
    let custom;

    if (input.peek().type === "str") {
      custom = input.next();
    }

    if (!is_punc("{"))
      input.croak("The statements must be in a {} block. Please add a {.");
    const then = parse_expression();

    const ret = {
      type: "while",
      cond: cond,
      then: then,
    };

    if (custom) ret.customName = custom;
    return ret;
  }

  // parse_dowhile method: parses a dowhile block
  function parse_dowhile() {
    skip_kw("do");
    let custom;

    if (input.peek().type === "str") {
      custom = input.next();
    }

    if (!is_punc("{"))
      input.croak("The statements must be in a {} block. Please add a {.");
    const then = parse_expression();
    skip_kw("while");
    const cond = parse_key_args();
    input.next();

    const ret = {
      type: "dowhile",
      cond: cond,
      then: then,
    };

    if (custom) ret.customName = custom;
    return ret;
  }

  // parse_forEach method: parses a forEach block
  function parse_forEach() {
    skip_kw("forEach");
    input.next();
    let variable = parse_var(input.peek().value);

    if (!variable.assign)
      variable.assign = {
        type: "assign",
        operator: "=",
        left: { type: "var", value: variable.name },
        right: { type: "num", value: 0 },
      };
    input.next();
    let cond = parse_key_args(true);
    input.next();
    let binary = maybe_binary(input.next(), 0);
    input.next();
    let custom;
    if (input.peek().type === "str") {
      custom = input.next();
    }

    if (!is_punc("{"))
      input.croak("The statements must be in a {} block. Please add a {.");
    const then = parse_expression();

    const ret = {
      type: "forEach",
      cond: cond,
      var: variable,
      binary: binary,
      then: then,
    };

    if (custom) ret.customName = custom;
    return ret;
  }

  // parse_raycast method: parses a raycast block
  function parse_raycast() {
    skip_kw("raycast");

    let res = { type: "raycast", duration: 100, block: "air" };

    if (input.peek().value === "(") {
      input.next();

      if (input.peek().type === "num") {
        res.duration = input.next().value;
        input.next();
      }

      if (input.peek().value === "!") {
        res.notblock = true;
        input.next();
      }

      if (input.peek().type === "str") {
        res.block = input.next().value;
        input.next();
      }

      if (input.peek().value === "block") {
        input.next();

        if (input.peek().type === "str") {
          res.toBlock = input.next().value;
        }
      }

      if (input.peek().value === "entity") {
        input.next();

        if (input.peek().type === "selector" || input.peek().type === "var") {
          res.entity = input.next().value;
        }
      }
      if (input.peek().value === ")") input.next();
    }

    res.end = parse_prog();
    if (input.peek().value === ",") {
      input.next();
      res.while = parse_prog();
    }
    return res;
  }

  // parse_key_args method: parses keyword arguments
  function parse_key_args(punc_not_needed) {
    let cond = [];
    let before = { type: "op", value: "&&" };
    if (!punc_not_needed) {
      if (input.peek().value != "(" && input.peek().value != ",")
        input.croak("Please add () to specify arguments");
      else input.next();
    }
    while (input.peek().value != ")" && input.peek().value != ";") {
      let next = input.next();

      if (next.value == "!") {
        before = next;
        continue;
      }

      if (next.type == "selector") {
        if (before.type == "binary") before.right.selector = next;
        else if (before.type == "var") before.selector = next;
        else cond.push(next);
        continue;
      }

      if ("> < >= <= == != ".indexOf(next.value + " ") > -1) {
        cond.splice(cond.indexOf(before), 1);
        next = {
          type: "binary",
          left: before,
          operator: next.value,
          right: input.next(),
        };
        if (before.op) {
          next.op = before.op;
          delete next.left.op;
        }
        cond.push(next);
      }

      if (before.value == "&&") {
        cond.push(next);
      }

      if (before.value == "||" || before.value == ",") {
        next.op = "or";
        cond.push(next);
      }

      if (before.value == "!") {
        next.not = true;
        cond.push(next);
      }

      if (next.type == "var" && before.type == "var") {
        before.selector = next;
      } else {
        before = next;
      }
    }
    if (cond.length > 0) return cond;
    input.croak("Please specify at least one argument here");
  }

  // parse_keyword method: parses a keyword
  function parse_keyword(kw) {
    skip_kw(kw);
    var cond = parse_key_args();
    input.next();

    let next = input.peek();
    if (next.value == "{") {
    } // if next.value is { do nothing
    else if (next.value == ",") {
      input.next();
      let nest = parse_keyword(input.peek().value);
      let res = {
        type: kw,
        nest: [],
        cond: cond,
        then: nest.then,
      };
      res.nest.push({ type: nest.type, cond: nest.cond });
      if (nest.nest) res.nest = res.nest.concat(nest.nest);
      return res;
    } else input.croak("Please finish your arguments or add a {.");

    var then = parse_expression();

    var ret = {
      type: kw,
      cond: cond,
      then: then,
    };

    return ret;
  }

  // parse_for method: parse a for statement
  function parse_for() {
    skip_kw("for");

    let args = delimited("(", ")", ",", parse_expression);
    let then = parse_expression();

    var ret = {
      type: "for",
      args: args,
      after: then,
    };

    return ret;
  }

  // parse_var method: parse a variable
  function parse_var(kw) {
    skip_kw(kw);
    let name = input.next().value;
    let res = { type: "initvar", name: name };

    let next = input.peek();

    if (next.type == "kw" && next.value == "trigger") {
      skip_kw(next.value);
      res.trigger = true;
      next = input.peek();
    }

    // check for selector
    switch (next.type) {
      case "selector":
        res.selector = input.next();
        break;
      case "var":
        res.selector = { type: "selector", value: input.next().value };
        break;
    }

    let assign = maybe_binary(
      { type: "var", value: name, selector: res.selector },
      0
    );

    if (assign.type == "assign") res.assign = assign;
    return res;
  }

  // parse_bol method: parse a bol
  function parse_bol(kw) {
    skip_kw(kw);

    let name = input.next().value;
    let res = { type: "initbool", name: name };

    if (input.peek().type == "selector") res.selector = input.next();
    if (input.peek().type == "var")
      res.selector = { type: "selector", value: input.next().value };

    let assign = maybe_binary(
      { type: "var", value: name, selector: res.selector },
      0
    );

    if (assign.type == "assign" && assign.right.type == "bool")
      res.assign = assign;
    else
      input.croak(
        "Your assignment is not right! Please assign a boolean value."
      );

    return res;
  }

  // parse_const method: parse constant declaration
  function parse_const() {
    skip_kw("const");

    let name = input.next().value;

    input.next();

    let assign;
    if (is_kw("Map")) {
      assign = parse_map();
    }
    if (is_kw("Array")) {
      assign = parse_array();
    }

    if (!assign) assign = input.next();
    if (assign.type != "num" && assign.type != "str" && assign.type != "map")
      input.croak("You have to assign a string or number to a constant!");

    return {
      type: "const",
      value: name,
      assign: assign.value,
    };
  }
  // parse the map type
  function parse_map() {
    let ret = {};
    skip_kw("Map");
    input.next(); // skip {
    try {
      ret = {
        type: "map",
        value: JSON.parse("{" + input.next().value.replace(/;/g, "") + "}"),
      };
    } catch (err) {
      input.croak("Please use valid Json: " + err);
    }
    input.next(); // skip }
    return ret;
  }
  // parse the array type
  function parse_array() {
    skip_kw("Array");
    let ret = { type: "map", value: {} };
    input.next(); // skip {
    input
      .next()
      .value.replace(/(\n)|;|\r/g, "")
      .split(",")
      .forEach((element, i) => {
        try {
          ret.value[i] = JSON.parse(element);
        } catch (err) {
          input.croak("Please use valid Json: " + err);
        }
      });
    input.next(); // skip }
    return ret;
  }
  // parse_modal method: parse a modal declaration
  function parse_modal(override = false) {
    skip_kw("modal");
    let res = { type: "modal", call: parse_call(input.next().value) };
    if (override) res.override = true;
    return res;
  }

  // parse_override method: parses a override modal
  function parse_modaljs(override = false) {
    skip_kw("modaljs");
    let call = {
      type: "call",
      func: input.next().value,
      args: delimited("(", ")", ",", parse_expression),
    };
    call.after = delimitedNoSep("{", "}", input.next);
    let res = { type: "modaljs", call: call };
    if (override) res.override = true;
    return res;
  }
  function parse_override() {
    skip_kw("override");
    if (is_kw("modal")) return parse_modal(true);
  }

  // parse_switch method: parse a switch
  function parse_switch() {
    skip_kw("switch");

    let res = { type: "switch", var: {}, cases: [] };
    let variable = delimited("(", ")", ",", (x) => input.next());

    res.var = variable[0];
    if (variable[1] && variable[1].type == "selector")
      res.var.selector = variable[1];

    res.cases = delimited("{", "}", ",", () => {
      let def = false;

      if (input.peek().value == "default") {
        def = true;
        skip_kw("default");
      } else {
        skip_kw("case");
      }
      let cond = [];

      if (!def && input.peek().type == "op")
        cond.push(maybe_binary(res.var, 0));
      else if (!def && input.peek().type == "num")
        cond.push({
          type: "binary",
          left: res.var,
          right: input.next(),
          operator: "==",
        });

      let then;

      if (input.peek().value == "{") then = parse_prog();
      else then = parse_expression();

      if (input.peek().value == ";") skip_punc(";");

      return { type: def ? "default" : "case", cond: cond, then: then };
    });
    return res;
  }

  // parses the function keyword
  function parse_function(from_run = false) {
    skip_kw("function");
    if (input.peek().type != "str" && input.peek().type != "var")
      input.croak(
        "Please specify the name and path of the function using a string or one-word name"
      );
    let res = { type: "func" };
    res.name = input.next().value;
    if (input.peek().value == "{" || !from_run) {
      // Do I need to pass a program?
      res.prog = parse_prog();
    }
    return res;
  }

  function parse_run_function() {
    skip_kw("run");
    if (input.peek().value == "function")
      return { type: "run_func", func: parse_function(true) };
    else input.croak("Please specify a function");
  }

  // parse_debugger method: read a debug message
  function parse_debugger(tok) {
    tok.value = tok.value.substr(6).split(":");
    if (tok.value.length < 2)
      input.croak("You need to end your debug mode with a : !");
    let mode = tok.value[0];
    tok.value = tok.value.slice(1).join(":").trim();
    switch (mode) {
      case "message": {
        console.log(
          consoletheme.FgYellow,
          "[Debugger]" + consoletheme.FgCyan + " (message)",
          consoletheme.FgWhite,
          tok.value,
          consoletheme.Reset
        );
        break;
      }
      case "break": {
        input.debugError(tok.value, "break");
        break;
      }
      case "error": {
        input.debugError(tok.value, "err");
        break;
      }
      case "success": {
        console.log(
          consoletheme.FgGreen,
          "[Debugger]" + consoletheme.FgCyan + " (success)",
          consoletheme.FgWhite,
          tok.value,
          consoletheme.Reset
        );
        break;
      }
    }
    //if (input.peek().value == ";") input.next();
    return { type: "command", value: "" };
  }

  // parse_bool method: parse a bool
  function parse_bool() {
    return {
      type: "bool",
      value: input.next().value == "true",
    };
  }

  // returnKey function: return a keyword
  function returnKey(keyword) {
    skip_kw(keyword);
    return { type: keyword };
  }

  // maybe_call method: maybe call expression
  function maybe_call(expr) {
    expr = expr();
    return is_punc("(") ? parse_call(expr) : expr;
  }
  function parse_atom() {
    return maybe_call(function () {
      if (is_punc("(")) {
        input.next();
        var exp = parse_expression();
        skip_punc(")");
        return exp;
      }

      if (is_punc("{")) return parse_prog();
      if (is_kw("if")) return parse_if();
      if (is_kw("unless")) return parse_if(true);
      if (is_kw("const")) return parse_const();
      if (is_kw("var") || is_kw("score")) return parse_var(input.peek().value);
      if (is_kw("bool") || is_kw("tag") || is_kw("boolean"))
        return parse_bol(input.peek().value);
      if (is_kw("Map")) return parse_map();
      if (is_kw("Array")) return parse_array();
      if (
        is_kw("asat") ||
        is_kw("as") ||
        is_kw("at") ||
        is_kw("positioned") ||
        is_kw("align") ||
        is_kw("rotated") ||
        is_kw("anchored") ||
        is_kw("dimension") ||
        is_kw("in")
      )
        return parse_keyword(input.peek().value);
      if (is_kw("for")) return parse_for();
      if (is_kw("forEach")) return parse_forEach();
      if (is_kw("raycast")) return parse_raycast();
      if (is_kw("stop")) return returnKey("stop");
      if (is_kw("continue")) return returnKey("continue");
      if (is_kw("switch")) return parse_switch();
      //if (is_kw("selector")) return returnKey('selector');
      if (is_kw("while")) return parse_while();
      if (is_kw("do")) return parse_dowhile();
      if (is_kw("modal")) return parse_modal();
      if (is_kw("modaljs")) return parse_modaljs();
      if (is_kw("override")) return parse_override();
      if (is_kw("function")) return parse_function();
      if (is_kw("run")) return parse_run_function();
      if (is_kw("true") || is_kw("false")) return parse_bool();

      var tok = input.next();
      if (!tok) return { type: "command", value: "" };
      if (tok.type == "comment" || tok.type == "command") {
        return tok;
      }
      if (tok.type == "debugger") {
        return parse_debugger(tok);
      }
      if (tok.type == "var") {
        if (input.peek().type == "selector") {
          tok.selector = input.next();
        }

        if (input.peek().type == "var") {
          tok.selector = { type: "selector", value: input.next().value };
        }

        return tok;
      }
      if (tok.type == "op" && tok.value == "-") {
        let num = input.next();
        if (num.type != "num") {
          unexpected();
        }
        tok = { type: "num", value: -num.value };
      }
      if (tok.type == "op" && tok.value == "-") {
        let num = input.next();
        if (num.type != "num") {
          unexpected();
        }
        tok = { type: "num", value: -num.value };
      }
      if (tok.type == "num" || tok.type == "str") return tok;

      unexpected();
    });
  }
  // parse_toplevel method: parse toplevel
  function parse_toplevel() {
    var prog = [];
    while (!input.eof()) {
      prog.push(parse_expression());
      if (!input.eof()) skip_punc(";");
    }
    return { type: "prog", prog: prog };
  }

  // parse_prog method: parse programm
  function parse_prog() {
    var prog = delimited("{", "}", ";", parse_expression);
    if (prog.length == 0) return FALSE;
    if (prog.length == 1) return prog[0];
    return { type: "prog", prog: prog };
  }

  // parse_expression
  function parse_expression() {
    return maybe_call(function () {
      return maybe_binary(parse_atom(), 0);
    });
  }
};
