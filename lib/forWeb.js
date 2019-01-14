var isModalJs = 0;
function InputStream(input, file = '') {
  if(file) file = ' in file ' + file
  var pos = 0, line = 1, col = 0;

  // Export Methods
  return {
    next  : next,
    peek  : peek,
    peekNext  : peekNext,
    getCol  : getCol,
    eof   : eof,
    croak : croak,
    debugError : debugError
  };

  // next Method returns next token
  function next() {

    var ch = input.charAt(pos++);

    if (ch == "\n"){

      if(",;(){[".indexOf(input.charAt(pos--)) == -1){

        input[pos] = ";"

      }

      pos++
      line++
      col = 0

    }

    else col++;
    return ch;

  }

  // Peek() method Get Token from later in the file without skipping
  function peek() {

    return input.charAt(pos);

  }

  // Peek() method Get Token from later in the file without skipping
  function peekNext(num) {

    return input.charAt(pos + num);

  }


  //
  function getCol() {

    let num = col
    let pos2 = pos - 1

    while(" \r\n\t".indexOf(input.charAt(pos2)) >= 0 && num >= 1){

      pos2--
      num--

    }

    return num

  }

  // eof() Method: Test if end of file is reached
  function eof() {

    return peek() == "";

  }


  // Throws an error with actual position in File
  function croak(msg) {
     throw new Error(msg + " (" + (line - 1) + ":" + col + ")" + file);
   }
  function debugError(msg,type) {
    let filer = file.split("/")
    filer = filer[filer.length - 1]
    if(type == "err") throw new Error("[Debug](" + (line - 1) + ":" + col + "|" + filer + ") " + msg);
    else if(type == "break") throw new Error("[Brake](brake at " + (line - 1) + ":" + col + "|" + filer + ") " + msg)
  }
}

function TokenStream(input) {

  var current = null;

  // Keywords
  var keywords = " if then else true false for as at asat positioned modal align dimension rotated"
               + " anchored while do forEach raycast stop continue switch case default var bool"
               + " boolean tag score const override function run modaljs Map Array ";
  var operators = "+-*/%=&|<>!";
  var puncs     = ",;:(){}[]";
  var whitespaces = " \r\n\t";


  // Export Functions
  return {
    next  : next,
    peek  : peek,
    eof   : eof,
    croak : input.croak,
    debugError : input.debugError
  };

  // is_keyword method: test if character is keyword
  function is_keyword(x) {
    return keywords.indexOf(" " + x + " ") >= 0;
  }

  // is_digit method: test if character is a digit
  function is_digit(ch) {
    return /[0-9]/i.test(ch);
  }

  // is_id_start method: test if character is id start
  function is_id_start(ch) {
    return /[a-zÎ»_.]/i.test(ch);
  }

  // is_id method: test if character is id
  function is_id(ch) {
    return is_id_start(ch) || "?!-<>=0123456789".indexOf(ch) >= 0;
  }

  // is_op_char method: test if character is operator
  function is_op_char(ch) {
    return operators.indexOf(ch) >= 0;
  }

  // is_punc method: test if character is punc
  function is_punc(ch) {
    return puncs.indexOf(ch) >= 0;
  }

  // is_whitespace method: test if caracter is a witespace
  function is_whitespace(ch) {
    return whitespaces.indexOf(ch) >= 0;
  }

  // read_while method: read while given function returns true to peek
  function read_while(predicate) {

    var str = "";

    while (!input.eof() && predicate(input.peek())) {
      str += input.next();
    }

    return str;

  }

  //read_number method: read to end of number
  function read_number(isNegative = false) {

    var has_dot = false;

    var number = read_while(function(ch){

      if (ch == ".") {

        if (has_dot) return false;
        has_dot = true;
        return true;

      }

      return is_digit(ch); // check next char is digit, if not cancel

    });
    if(isNegative) number = '-' + number

    return { type: "num", value: parseFloat(number) }; // Return number object

  }

  //read_ident method: read full intendent
  function read_ident() {

    var id = read_while(is_id);
    if(id=="modaljs" || id=="Map" || id=="Array") {
      isModalJs=1;
    }
    return {
      type  : is_keyword(id) ? "kw" : "var",
      value : id
    };

  }

  // read_escaped method: read escaped content
  function read_escaped(end) {

    var escaped = false, str = "";

    input.next();

    while (!input.eof()) {

      var ch = input.next();

      if (escaped) {
        str += ch;
        escaped = false;
      } else if (ch == "\\") {
        escaped = true;
      } else if (ch == end) {
        break;
      } else {
        str += ch;
      }

    }

    return str;

  }

  // read_string method: Read Strings starting with "
  function read_string() {
    return { type: "str", value: read_escaped('"') };
  }


  // read_string2 method: Read Strings starting with '
  function read_string2() {
    return { type: "str", value: read_escaped("'") };
  }

  // skip_comment method: skip a comment
  function skip_comment() {
    read_while(function(ch){ return ch != "\n" });
    input.next();
  }

  function skip_line_comment() {
    read_while(function(ch){ return ch != "*" || input.peekNext(1) != "/" });
    input.next()
    input.next()
    input.next()
  }

  // readSelector method: read a selector
  function readSelector(){
    let value = input.next() + input.next()

    if(input.peek() == "[") {
      value += read_while(function(ch){ return ch != "]" }) + input.next()
    }

    return { type: "selector", value: value }
  }


  // read_comment method: Transfer comments starting with #
  function read_comment() {
    return { type: "comment", value: read_while(function(ch){ return ch != "\n" && ch != ";" }) }
  }
  function read_debug() {
    return { type: "debugger", value: read_while(function(ch){ return ch != "\n" && ch != ";" }) }
  }

  // read_command method: Transfer commands starting with /
  function read_command() {
    let command = read_while(function(ch){ return ch != "\n" && ch != ";" })
    if(command[0] == "/") command = command.substr(1)
    return { type: "command", value: command.split('run: ').join("")}
  }

  // read_next method: read next token
  function read_next() {

    var jsret = "";
    while(isModalJs>1){
      var ch =input.peek()
      if (ch=="{")isModalJs++;
      if (ch=="}")isModalJs--;
      if(isModalJs>1){
        jsret += ch;
        input.next();
      }
    }
    if(jsret != ""){
      isModalJs=0;
      return { type: "call", value: jsret};
    }

    // skip whitespaces
    read_while(is_whitespace);
    if (input.eof()) return null;

    // read next token
    var ch = input.peek();

    // skip comment
    if(ch == "/" && input.peekNext(1) == "/"){
      skip_comment()
      return read_next();
    }

    // skip line comment
    if(ch == "/" && input.peekNext(1) == "*"){
      skip_line_comment()
      read_next()
      return read_next()
    }

    // Transfer command
    if(ch == "r" && input.peekNext(1) == "u" && input.peekNext(2) == "n" && input.peekNext(3) == ":") {
      return read_command();
    }
    if(ch == "d" && input.peekNext(1) == "e" && input.peekNext(2) == "b" && input.peekNext(3) == "u" && input.peekNext(4) == "g") {
      return read_debug();
    }

    // Transfer command
    if(ch == "/" && input.getCol() === 0){
      return read_command();
    }

    // Replace variable
    if(ch == "$"){
      if(input.peekNext(1) == "("){
        let res = {type: "num", value: read_while(function(ch){ return ch != ")" }) + ")"}
        input.next()
        return res
      }
    }

    // Transfer mcfunction comment
    if (ch == "#") {
      return read_comment()
    }

    //read selector
    if (ch == "@") return readSelector();

    // read string
    if (ch == '"') return read_string();

    // read string2
    if (ch == "'") return read_string2();

    // read digit
    if (is_digit(ch)) return read_number();

    // read id
    if (is_id_start(ch)) return read_ident();

    // read punc
    if (is_punc(ch)){
      var val = input.next();
      if(val == "{" && isModalJs == 1) isModalJs = 2;
      return {
        type  : "punc",
        value : val
      };
    }

    // read operator
    if (is_op_char(ch)){
      if(ch == '-' && is_digit(input.peek())) return read_number(true);
      return {
        type  : "op",
        value : read_while(is_op_char)
      };
    }

    // error, if can't handle
    input.croak("Can't handle character: " + JSON.stringify(ch));
  }

  // peek method: get next character
  function peek() {
    return current || (current = read_next());
  }

  // next method: go to next character
  function next() {
    var tok = current;
    current = null;
    return tok || read_next();
  }
  function eof() {
    return peek() == null;
  }
}

parse = function (input) {

    const PRECEDENCE = {
        "=": 1,
        "||": 2,
        "&&": 3,
        "<": 7, ">": 7, "<=": 7, ">=": 7, "==": 7, "!=": 7,
        "+": 10, "-": 10, "+=": 10, "-=": 10,
        "*": 20, "/": 20, "%": 20, "*=": 20, "/=": 20, "%=": 20,
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
        else input.croak("Expecting punctuation: \"" + chs + "\"");
    }

    // skip_kw method: skips a keyword
    function skip_kw(kw) {
        if (is_kw(kw)) input.next();
        else input.croak("Expecting keyword: \"" + kw + "\"");
    }

    // skip_op method: skips an operator
    function skip_op(op) {
        if (is_op(op)) input.next();
        else input.croak("Expecting operator: \"" + op + "\"");
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
            return {type: "binary", operator: "+=", left: left, right: {type: 'num', value: 1}};
        }

        if (left && left.type === "var" && input.peek().value === "--") {
            input.next();
            return {type: "binary", operator: "-=", left: left, right: {type: 'num', value: 1}};
        }

        if (left && left.type === "var" && left.value.slice(-2) === "--") {
            left.value = left.value.substr(0, left.value.length - 2);
            return {type: "binary", operator: "-=", left: left, right: {type: 'num', value: 1}};
        }

        if (tok) {

            const his_prec = PRECEDENCE[tok.value];
            if (his_prec > my_prec) {

                input.next();

                return maybe_binary({
                    type: tok.value === "=" ? "assign" : "binary",
                    operator: tok.value,
                    left: left,
                    right: maybe_binary(parse_atom(), his_prec)
                }, my_prec);

            }
        }
        return left;
    }

    // delimited method: pares delimited code
    function delimited(start, stop, separator, parser) {

        let a = [], first = true;

        skip_punc(start);

        while (!input.eof()) {

            if (is_punc(stop)) break;
            if (first) first = false; else skip_punc(separator);
            if (is_punc(stop)) break;
            a.push(parser());

        }

        skip_punc(stop);
        return a;

    }
    function delimitedNoSep(start, stop, parser) {
      var a = [], first = true;
      skip_punc(start);
      while (!input.eof()) {
        if (is_punc(stop)) break;
        if (first) first = false;// else skip_punc(separator);
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
    function parse_if() {

        skip_kw("if");
        const cond = parse_key_args();
        input.next();
        if (!is_punc("{")) input.croak("The statements must be in a {} block. Please add a {.");

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

        if (!is_punc("{")) input.croak("The statements must be in a {} block. Please add a {.");
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

        if (!is_punc("{")) input.croak("The statements must be in a {} block. Please add a {.");
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

            if (!variable.assign) variable.assign = {
                type: 'assign',
                operator: '=',
                left: {type: 'var', value: variable.name},
                right: {type: 'num', value: 0}
            };
            input.next()
            let cond = parse_key_args(true);
            input.next();
            let binary = maybe_binary(input.next(), 0);
            input.next();
            let custom;
            if (input.peek().type === "str") {
                custom = input.next();
            }

            if (!is_punc("{")) input.croak("The statements must be in a {} block. Please add a {.");
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

        let res = {type: "raycast", duration: 100, block: "air"};

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
        let before = {type: 'op', value: "&&"};
        if (!punc_not_needed) {
            if (input.peek().value != "(" && input.peek().value != ",") input.croak("Please add () to specify arguments");
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
                next = {type: 'binary', left: before, operator: next.value, right: input.next()};
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

            before = next;
        }
        if (cond.length > 0) return cond;
        input.croak("Please specify at least one argument here")
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
            res.nest.push({type: nest.type, cond: nest.cond});
            if (nest.nest) res.nest = res.nest.concat(nest.nest);
            return res;
        }
        else input.croak("Please finish your arguments or add a {.");


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
            after: then
        };

        return ret;
    }

    // parse_var method: parse a variable
    function parse_var(kw) {

        skip_kw(kw);
        let name = input.next().value;
        let res = {type: "initvar", name: name};

        if (input.peek().type == "selector") res.selector = input.next();
        if (input.peek().type == "var") res.selector = {type: "selector", value: input.next().value};

        let assign = maybe_binary({type: "var", value: name, selector: res.selector}, 0);

        if (assign.type == "assign") res.assign = assign;
        return res;
    }

    // parse_bol method: parse a bol
    function parse_bol(kw) {
        skip_kw(kw);

        let name = input.next().value;
        let res = {type: "initbool", name: name};

        if (input.peek().type == "selector") res.selector = input.next();
        if (input.peek().type == "var") res.selector = {type: "selector", value: input.next().value};

        let assign = maybe_binary({type: "var", value: name, selector: res.selector}, 0);

        if (assign.type == "assign" && assign.right.type == "bool") res.assign = assign;
        else input.croak("Your assignment is not right! Please assign a boolean value.");

        return res;
    }

    // parse_const method: parse constant declaration
    function parse_const() {
        skip_kw('const');

        let name = input.next().value;

        input.next();

        let assign
        if(is_kw('Map')){
          assign = parse_map()
        }
        if(is_kw('Array')){
          assign = parse_array()
        }

        if(!assign) assign = input.next();
        if (assign.type != "num" && assign.type != "str" && assign.type != "map") input.croak("You have to assign a string or number to a constant!");

        return {
            type: "const",
            value: name,
            assign: assign.value
        };
    }
    // parse the map type
    function parse_map() {
        let ret = {};
        skip_kw('Map')
          input.next() // skip {
          try{
            ret = {type:'map',value: JSON.parse('{' + input.next().value.replace(/;/g,"") + '}')}
          } catch(err){
            input.croak("Please use valid Json: " + err)
          }
          input.next() // skip }
          return ret
    }
    // parse the array type
    function parse_array() {
        skip_kw('Array')
        let ret = {type:'map',value: {}}
        input.next() // skip {
        input.next().value.replace(/(\n)|;|\r/g,"").split(',').forEach((element,i) => {
            try{
                ret.value[i] = JSON.parse(element)
            } catch(err){
                input.croak("Please use valid Json: " + err)
            }
        })
        input.next() // skip }
        return ret
    }
    // parse_modal method: parse a modal declaration
    function parse_modal(override = false) {
        skip_kw("modal");
        let res = {type: "modal", call: parse_call(input.next().value)};
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
      call.after=delimitedNoSep("{","}",input.next);
      let res = {type: "modaljs", call: call};
      if(override) res.override = true
      return res
    }
    function parse_override() {
        skip_kw("override");
        if (is_kw('modal')) return parse_modal(true)
    }

    // parse_switch method: parse a switch
    function parse_switch() {

        skip_kw("switch");

        let res = {type: "switch", var: {}, cases: []};
        let variable = delimited("(", ")", ",", x => input.next());

        res.var = variable[0];
        if (variable[1] && variable[1].type == "selector") res.var.selector = variable[1];

        res.cases = delimited("{", "}", ",", () => {
            let def = false;

            if (input.peek().value == "default") {
                def = true;
                skip_kw("default");
            } else {
                skip_kw("case");
            }
            let cond = [];

            if (!def && input.peek().type == "op") cond.push(maybe_binary(res.var, 0));
            else if (!def && input.peek().type == "num") cond.push({
                type: "binary",
                left: res.var,
                right: input.next(),
                operator: "=="
            });

            let then;

            if (input.peek().value == "{") then = parse_prog();
            else then = parse_expression();

            if (input.peek().value == ";") skip_punc(";");

            return {type: def ? "default" : "case", cond: cond, then: then};
        });
        return res;
    }

    // parses the function keyword
    function parse_function(from_run = false) {
        skip_kw("function");
        if (input.peek().type != "str" && input.peek().type != "var") input.croak("Please specify the name and path of the function using a string or one-word name");
        let res = {type: "func"};
        res.name = input.next().value;
        if (input.peek().value == "{" || !from_run) { // Do I need to pass a program?
            res.prog = parse_prog()
        }
        return res
    }

    function parse_run_function() {
        skip_kw("run");
        if (input.peek().value == "function") return {type: "run_func", func: parse_function(true)};
        else input.croak("Please specify a function")
    }

    // parse_debugger method: read a debug message
    function parse_debugger(tok) {
        tok.value = tok.value.substr(6).split(":");
        if (tok.value.length < 2) input.croak("You need to end your debug mode with a : !");
        let mode = tok.value[0];
        tok.value = tok.value.slice(1).join(":").trim();
        switch (mode) {
            case "message": {
                console.log(consoletheme.FgYellow, "[Debugger]" + consoletheme.FgCyan + " (message)", consoletheme.FgWhite, tok.value, consoletheme.Reset);
                break
            }
            case "break": {
                input.debugError(tok.value, "break");
                break
            }
            case "error": {
                input.debugError(tok.value, "err");
                break
            }
            case "success": {
                console.log(consoletheme.FgGreen, "[Debugger]" + consoletheme.FgCyan + " (success)", consoletheme.FgWhite, tok.value, consoletheme.Reset);
                break
            }
        }
        //if (input.peek().value == ";") input.next();
        return {type: "command", value: ""}
    }

    // parse_bool method: parse a bool
    function parse_bool() {
        return {
            type: "bool",
            value: input.next().value == "true"
        };
    }

    // returnKey function: return a keyword
    function returnKey(keyword) {
        skip_kw(keyword);
        return {type: keyword};
    }

    // maybe_call method: maybe call expression
    function maybe_call(expr) {
        expr = expr();
        return is_punc("(") ? parse_call(expr) : expr;
    }
function parse_atom() {
    return maybe_call(function(){
      if (is_punc("(")) {
        input.next();
        var exp = parse_expression();
        skip_punc(")");
        return exp;
      }

      if (is_punc("{")) return parse_prog();
      if (is_kw("if")) return parse_if();
      if(is_kw("const")) return parse_const();
      if (is_kw("var")|| is_kw("score")) return parse_var(input.peek().value);
      if (is_kw("bool")|| is_kw("tag") || is_kw("boolean")) return parse_bol(input.peek().value);
      if(is_kw('Map')) return parse_map();
      if(is_kw('Array')) return parse_array();
      if (is_kw("asat") || is_kw("as") || is_kw("at") || is_kw("positioned") || is_kw("align") || is_kw("rotated") || is_kw("anchored") || is_kw("dimension")) return parse_keyword(input.peek().value);
      if (is_kw("for")) return parse_for();
      if (is_kw("forEach")) return parse_forEach();
      if (is_kw("raycast")) return parse_raycast();
      if (is_kw("stop")) return returnKey('stop');
      if (is_kw("continue")) return returnKey('continue');
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
      if(!tok) return {type:"command",value:""}
      if(tok.type == "comment" || tok.type == "command"){
        return tok;
      }
      if(tok.type == "debugger"){
        return parse_debugger(tok)
      }
      if (tok.type == "var") {

        if (input.peek().type == "selector") {
          tok.selector = input.next();
        }

        if (input.peek().type == "var") {
          tok.selector = {type: "selector", value: input.next().value};
        }

        return tok;

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
        return {type: "prog", prog: prog};
    }

    // parse_prog method: parse programm
    function parse_prog() {
        var prog = delimited("{", "}", ";", parse_expression);
        if (prog.length == 0) return FALSE;
        if (prog.length == 1) return prog[0];
        return {type: "prog", prog: prog};
    }

    // parse_expression
    function parse_expression() {
        return maybe_call(function () {
            return maybe_binary(parse_atom(), 0);
        });
    }
};
generate = function (exp, oldFile, prjName = "prjname", prjPath = "") {
    const modals = [{
        "type": "call",
        "func": "log",
        "args": [{"type": "var", "value": "text"}, {
            "type": "assign",
            "operator": "=",
            "left": {"type": "var", "value": "sel"},
            "right": {"type": "str", "value": "@a"}
        }],
        "after": "tellraw $(sel) [{\"text\":\"console => \",\"color\":\"aqua\"},{\"text\":\"$(text)\",\"color\":\"white\"}]"
    }, {
        "type": "call",
        "func": "newStand",
        "args": [{
            "type": "assign",
            "operator": "=",
            "left": {"type": "var", "value": "name"},
            "right": {"type": "str", "value": ""}
        }, {
            "type": "assign",
            "operator": "=",
            "left": {"type": "var", "value": "position"},
            "right": {"type": "str", "value": "~ ~ ~"}
        }, {
            "type": "assign",
            "operator": "=",
            "left": {"type": "var", "value": "tags"},
            "right": {"type": "str", "value": "[]"}
        }, {
            "type": "assign",
            "operator": "=",
            "left": {"type": "var", "value": "marker"},
            "right": {"type": "num", "value": 1}
        }, {
            "type": "assign",
            "operator": "=",
            "left": {"type": "var", "value": "invisible"},
            "right": {"type": "num", "value": 1}
        }, {
            "type": "assign",
            "operator": "=",
            "left": {"type": "var", "value": "noGravity"},
            "right": {"type": "num", "value": 1}
        }],
        "after": "summon armor_stand $(position) {CustomName:\"{\\\"text\\\":\\\"$(name)\\\"}\", Tags: $(tags),Invisible:$(invisible),Marker:$(marker),NoGravity:$(noGravity)}"
    }, {
        "type": "call",
        "func": "play",
        "args": [{"type": "var", "value": "sound"}, {
            "type": "assign",
            "operator": "=",
            "left": {"type": "var", "value": "selector"},
            "right": {"type": "str", "value": "@s"}
        }, {
            "type": "assign",
            "operator": "=",
            "left": {"type": "var", "value": "type"},
            "right": {"type": "str", "value": "master"}
        }],
        "after": "playsound $(sound) $(type) $(selector)\r"
    }, {
        "type": "call",
        "func": "cam.start",
        "args": [{
            "type": "assign",
            "operator": "=",
            "left": {"type": "var", "value": "entity"},
            "right": {"type": "str", "value": "@s"}
        }],
        "after": "execute as $(entity) run function cam:start\r"
    }, {
        "type": "call",
        "func": "cam.stop",
        "args": [{
            "type": "assign",
            "operator": "=",
            "left": {"type": "var", "value": "entity"},
            "right": {"type": "str", "value": "@s"}
        }],
        "after": "execute as $(entity) run function cam:stop\r"
    }, {
        "type": "call",
        "func": "cam.pos1",
        "args": [{
            "type": "assign",
            "operator": "=",
            "left": {"type": "var", "value": "location"},
            "right": {"type": "str", "value": "~ ~ ~"}
        }, {
            "type": "assign",
            "operator": "=",
            "left": {"type": "var", "value": "rotation"},
            "right": {"type": "str", "value": "~ ~"}
        }],
        "after": "execute positioned $(location) rotated $(rotation) run function cam:pos1\r"
    }, {
        "type": "call",
        "func": "cam.pos2",
        "args": [{
            "type": "assign",
            "operator": "=",
            "left": {"type": "var", "value": "location"},
            "right": {"type": "str", "value": "~ ~ ~"}
        }, {
            "type": "assign",
            "operator": "=",
            "left": {"type": "var", "value": "rotation"},
            "right": {"type": "str", "value": "~ ~"}
        }],
        "after": "execute positioned $(location) rotated $(rotation) run function cam:pos2\r"
    }, {
        "type": "call",
        "func": "cam.time",
        "args": [{
            "type": "assign",
            "operator": "=",
            "left": {"type": "var", "value": "length"},
            "right": {"type": "num", "value": 10}
        }, {
            "type": "assign",
            "operator": "=",
            "left": {"type": "var", "value": "entity"},
            "right": {"type": "str", "value": "@s"}
        }],
        "after": "scoreboard players set $(entity) camTime $(length)\r"
    }, {
        "type": "call",
        "func": "cam.noParticles",
        "args": [{
            "type": "assign",
            "operator": "=",
            "left": {"type": "var", "value": "entity"},
            "right": {"type": "str", "value": "@s"}
        }],
        "after": "tag $(entity) add camNoParticles\r"
    }, {
        "type": "call",
        "func": "cam.noText",
        "args": [{
            "type": "assign",
            "operator": "=",
            "left": {"type": "var", "value": "entity"},
            "right": {"type": "str", "value": "@s"}
        }],
        "after": "tag $(entity) add camNoText\r"
    }];
    let vars = [];
    let tags = [];
    let tagOhne = false;
    let consts = [];
    let processed = {};
    let genID = 1;
    let res = js(exp);
    res = res.split("run execute ").join("");
    for (let pro in processed)
        res += processed[pro];
    for (let cnst of consts) {
        res = gen_const(res,cnst.name,cnst.value)
    }
    return res;

    function js(exp) {
        switch (exp.type) {
            case "num"    :
            case "str"    :
            case "comment"   :return comment(exp);
            case "command"   :return exp.value;
            case "stop"   :return '#stop';
            case "continue"   :return '#continue';
            case "modal"   :return js_modal(exp);
            case "bool"   :return js_atom(exp);
            case "initbool"   :return js_initBool(exp);
            case "initvar"    :return js_init(exp);
            case "const"    :return js_const(exp);
            case "var"    :return js_var(exp);
            case "binary" :return js_binary(exp);
            case "assign" :return js_assign(exp);
            case "let"    :return js_let(exp);
            case "if"     :return make_if(exp);
            case "switch"     :return make_switch(exp);
            case "as"     :return make_indent(exp, "as");
            case "asat"     :return make_indent(exp, "asat");
            case "at"     :return make_indent(exp, "at");
            case "align"  :return make_indent(exp, "align");
            case "dimension":return make_indent(exp, "in");
            case "rotated"     :return make_indent(exp, "rotated");
            case "anchored"     :return make_indent(exp, "anchored");
            case "positioned"     : return make_indent(exp, "positioned");
            case "modaljs"   : return js_modaljs (exp);
            case "func"   : return gen_func(exp);
            case "run_func"   :return gen_run_func(exp);
            case "for"   :return gen_for(exp);
            case "forEach"   :return gen_forEach(exp);
            case "raycast"   :return gen_raycast(exp);
            case "while"   :return gen_while(exp);
            case "dowhile"   :return gen_while(exp, false, "dowhile$(id)");
            case "prog"   :return js_prog(exp);
            case "call"   :return js_call(exp);
            default:
                throw new Error("There is no way " + exp.type + " could generate in " + oldFile);
        }
    }
    function gen_const(text,oldVal,newVal){
        const con = text.split('$(' + oldVal + ')');
        con.forEach((x,i) => {
            let tempVal = newVal;
            // if repl method is called
            // see if value of map is called
            if(tempVal instanceof Object && x[0] == '.'){
              let key = ""
              let k = 1
              while(x[k] && x[k] != ' ' && x.substr(k, 5) !== '.repl' && x[k] != '\n' && x[k] != '\r'){
                key += x[k]
                k++
              }
              x = x.substr(k)
              con[i] = con[i].substr(k)
              tempVal = tempVal[key]
            }
            if (x.substr(0, 5) === '.repl') {
                let strArr = [];
                if (x.substr(6, 1) === "'") strArr = x.split("'");
                else strArr = x.split('"');
                // regExp or not?
                if (strArr[1][0] === '/') {
                    strArr[1] = strArr[1].substr(1, strArr[1].length - 2);
                    let regs = new RegExp(strArr[1]);
                    tempVal = newVal.replace(regs, strArr[3])
                } else tempVal = tempVal.split(strArr[1]).join(strArr[3]);
                con[i] = tempVal + strArr[4].substr(1)
            } else {
                if (i !== 0) con[i] = tempVal + con[i]
            }
        });
        return con.join('');
    }
    function comment(exp) {
        if (exp.value.trim() === '#') {
            return '';
        }
        if (exp.value.trim() === '##') {
            return '\n';
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
        else if (exp.operator === "+=" && vars.indexOf(exp.left.value) >= 0 && exp.right.type === "num") return 'scoreboard players add ' + selector.value + ' ' + exp.left.value + ' ' + exp.right.value;
        else if (exp.operator === "-=" && vars.indexOf(exp.left.value) >= 0 && exp.right.type === "num") return 'scoreboard players remove ' + selector.value + ' ' + exp.left.value + ' ' + exp.right.value;

        else if (exp.operator && vars.indexOf(exp.left.value) >= 0 && exp.right.type === "var" && vars.indexOf(exp.right.value) >= 0) return 'scoreboard players operation ' + selector.value + ' ' + exp.left.value + ' ' + exp.operator + ' ' + selector2.value + ' ' + exp.right.value;
        else throw exp.left.value + " is not declared or you messed something up!\n in: " + oldFile
    }

    // assign nodes are compiled the same as binary
    function js_assign(exp) {
        if(exp.left.value && exp.left.value.substr(0,3) === 'no!') exp.left.value = exp.left.value.substr(3)
        if (tags.indexOf(exp.name) < 0 && exp.right.type === "bool") return js_assignBool(exp);
        let selector = exp.left.selector ? exp.left.selector : exp.left;
        let selector2 = exp.right.selector ? exp.right.selector : exp.right;
        if (vars.indexOf(exp.left.value) >= 0 && exp.right.type === "num") return 'scoreboard players set ' + selector.value + ' ' + exp.left.value + ' ' + exp.right.value;
        if (vars.indexOf(exp.left.value) >= 0 && exp.right.type === "command") return 'execute store result score ' + selector.value + ' ' + exp.left.value + ' run ' + exp.right.value;
        else if (vars.indexOf(exp.left.value) >= 0 && exp.right.type === "var" && vars.indexOf(exp.right.value) >= 0) return 'scoreboard players operation ' + selector.value + ' ' + exp.left.value + ' = ' + selector2.value + ' ' + exp.right.value;
        else throw exp.left.value + " is not declared!\n in: " + oldFile;
    }

    function js_init(exp) {
        let genScore = true

        if(exp.name.substr(0,3) === 'no!'){
            genScore = false
            exp.name = exp.name.substr(3)
        }
        try {
        if (vars.indexOf(exp.name) < 0) {
            vars.push(exp.name);
            if(genScore){
                if(processed['mcscript/load']) processed['mcscript/load'] += 'scoreboard objectives add ' + exp.name + ' dummy\n';
                else processed['mcscript/load'] = '#extend: ' + prjPath + '/mcscript/load\n# please do not touch this file!\n# it is used by the compiler!\nscoreboard objectives add ' + exp.name + ' dummy\n';
            }
            if (exp.assign) return js_assign(exp.assign)
        } else {
            console.error("\x1b[31m", "The variable " + exp.name + " was declared multiple times!", "\x1b[0m");
            return js_assign(exp.assign)
        }
    } catch (error) {
            console.log(error);

    }
    }

    function js_initBool(exp) {
        if (tags.indexOf(exp.name) < 0) {
            tags.push(exp.name);
            if (exp.assign) return js_assignBool(exp.assign)
        } else {
            console.error("\x1b[31m", "The boolean " + exp.name + " was declared multiple times!", "\x1b[0m");
            return js_assignBool(exp.assign)
        }
    }

    function js_assignBool(exp) {
        if (!exp.left.selector && !tagOhne) {
            if (processed['mcscript/load']) processed['mcscript/load'] += 'execute unless entity @e[tag=mcscriptTags] at @p run summon armor_stand ~ ~ ~ {Tags:[mcscriptTags],Invisible:1,Invulnerable:1,NoGravity:1}\n';
            else processed['mcscript/load'] = '#extend: ' + prjPath + '/mcscript/load\n# please do not touch this file!\n# it is used by the compiler!\nexecute unless entity @e[tag=mcscriptTags] at @p run summon armor_stand ~ ~ ~ {Tags:[mcscriptTags],Invisible:1,Invulnerable:1,NoGravity:1}\n';
            tagOhne = true
        }
        let selector = exp.left.selector ? exp.left.selector.value : "@e[tag=mcscriptTags]";
        if (exp.right.value) return "tag " + selector + " add " + exp.left.value;
        return "tag " + selector + " remove " + exp.left.value
    }

    function js_const(exp) {
        if (exp.value && exp.assign != null) {
            consts.push({name: exp.value, value: exp.assign})
        }
        return ""
    }

    function js_let(exp) {
        if (exp.vars.length === 0)
            return js(exp.body);
        const iife = {
            type: "call",
            func: {
                type: "lambda",
                vars: [exp.vars[0].name],
                body: {
                    type: "let",
                    vars: exp.vars.slice(1),
                    body: exp.body
                }
            },
            args: [exp.vars[0].def || FALSE]
        };
        return "(" + js(iife) + ")";
    }

    function make_switch(exp) {
        let name = exp.var.value;
        let def = exp.cases.find(x => x.type === "default");
        let res = "";
        if (def) exp.cases.splice(exp.cases.indexOf(def), 1);
        for (let cased of exp.cases) {
            if (cased.then.type !== "prog") {
                let save = cased.then;
                cased.then = {type: "prog", prog: []};
                cased.then.prog.push(save)
            }
            cased.then.prog.push({type: "command", value: "tag @s add mcscriptSwitch"});
            cased.cond.push({type: "str", value: "entity @s[tag=!mcscriptSwitch]"});
            res += make_if(cased)
        }
        if (def) {
            def.cond = [{type: "str", value: "entity @s[tag=!mcscriptSwitch]"}];
            res += make_if(def)
        }
        res += "tag @s remove mcscriptSwitch";
        return res
    }

    function make_if(exp) {
        let res = make_indent(exp, "if");
        let _else = "";
        if (exp.else) {
            exp.then = exp.else;
            _else = make_indent(exp, "unless")
        }
        return res + "\n" + _else
    }

    function gen_func(exp) {
        let name = exp.name.replace("./", "");
        if (exp.prog) {
            processed[name] = "#file: ./" + name + "\n# this file is generated based on a function specified in" + oldFile + "\n";
            processed[name] += js(exp.prog)
        }
        return ""
    }

    function gen_run_func(exp) {
        if (exp.func.prog) {
            gen_func(exp.func);
            return "function " + prjName + ":" + exp.func.name.replace("./", "")
        }
        if (exp.func.name) return "function " + prjName + ":" + exp.func.name.replace("./", "");
        throw "don´t know how to generate run function in " + filename
    }

    function testforBinary(cond) {
        let selector = cond.left.selector ? cond.left.selector : cond.left;
        let selector2 = cond.right.selector ? cond.right.selector : cond.right;
        if (cond.right.type === "var") {
            return " score " + selector.value + ' ' + cond.left.value + ' ' + cond.operator + ' ' + selector2.value + ' ' + cond.right.value
        } else if (cond.right.type === "num" && cond.operator === "==") {
            return " score " + selector.value + ' ' + cond.left.value + ' matches ' + cond.right.value
        }
        else if (cond.right.type === "num" && cond.operator === ">") {
            return " score " + selector.value + ' ' + cond.left.value + ' matches ' + (cond.right.value + 1) + '..'
        }
        else if (cond.right.type === "num" && cond.operator === "<") {
            return " score " + selector.value + ' ' + cond.left.value + ' matches ..' + (cond.right.value - 1)
        }
        else if (cond.right.type === "num" && cond.operator === ">=") {
            return " score " + selector.value + ' ' + cond.left.value + ' matches ' + cond.right.value + '..'
        }
        else if (cond.right.type === "num" && cond.operator === "<=") {
            return " score " + selector.value + ' ' + cond.left.value + ' matches ..' + cond.right.value
        }
        else throw "Don´t know what you mean with " + cond.operator + '?\n In: ' + oldFile
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
            if (cond.type === "selector" && (name === "unless" || name === "if")) nameOp += " entity";
            if (cond.type === "var" && tags.indexOf(cond.value) !== -1 && (name === "unless" || name === "if")) {
                nameOp += " entity";
                if (cond.selector && cond.selector.value.slice(-1) === "]") cond.value = cond.selector.value.substr(0, cond.selector.value.length - 1) + ",tag=" + cond.value + "]";
                else if (cond.selector) cond.value = cond.selector.value + "[tag=" + cond.value + "]";
                else cond.value = "@e[tag=mcscriptTags,tag=" + cond.value + "]"
            } else if (cond.type === "var" && vars.indexOf(cond.value) !== -1 && (name === "unless" || name === "if")) {
                nameOp += " score";
                if (cond.selector) cond.value = cond.selector.value + "matches 1..";
                else cond.value = cond.value + " matches 1.."
            }

            if (name === "asat") {
                nameOp = "as " + cond.value + " at";
                cond.value = "@s"
            }

            if (exp.nest) {
                for (let nested of exp.nest) {
                    for (let nestedCond of nested.cond) {
                        let keyWord = nested.type;
                        let additions = "";
                        if (nestedCond.not && nested.type === "if") keyWord = "unless";
                        if (nestedCond.not && nested.type === "unless") keyWord = "if";
                        if (nested.type === "dimension") keyWord = "in";
                        if (nestedCond.type === "selector" && (nested.type === "if" || nested.type === "unless")) keyWord += " entity";
                        if (nested.type === "asat") {
                            keyWord = "as " + nestedCond.value + " at";
                            nestedCond.value = "@s"
                        }

                        if (nestedCond.op && nestedCond.op === "or") {
                            savedExtendedCommands.push("execute" + " " + nameOp + " " + cond.value + " " + keyWord + " " + nestedCond.value + " run ")
                        } else {

                            if (nestedCond.value !== undefined) nestedMiddle += " " + keyWord + " " + nestedCond.value + additions;
                            else if (cond.type === "binary" && (name === "if" || name === "unless")) {
                                nestedMiddle += ' ' + keyWord + testforBinary(cond)
                            }
                        }
                    }
                }
            }
            if (cond.op && cond.op === "or") {
                if (cond.value !== undefined) savedExtendedCommands.push("execute" + " " + nameOp + " " + cond.value + nestedMiddle + " run ");
                else if (cond.type === "binary") savedExtendedCommands.push("execute" + " " + nameOp + " " + testforBinary(cond) + nestedMiddle + " run ")
            } else {
                if (cond.value !== undefined) middle += " " + nameOp + " " + cond.value;
                if (cond.type === "binary" && (name === "unless" || name === "if")) {
                    middle += ' ' + nameOp + testforBinary(cond)
                }
            }
        }
        for (let sT of subTree) {
            if (sT === "") continue;
            commands.push("execute" + middle + nestedMiddle + " run " + sT);
            for (let saved of savedExtendedCommands) {
                commands.push(saved + sT)
            }
        }
        return commands.join("\n")
    }

    function js_prog(exp) {
        return "" + exp.prog.map(js).join("\n") + "";
    }

    function js_call(exp) {
        for (let mod of modals) {
            if (mod.func === exp.func.value) {
                return gen_modal(mod, exp)
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
                variable = exp.args[2].value
            }
            for (let i = exp.args[0].value; i <= exp.args[1].value; i++) {
                output.push(js(exp.after).split("$(" + variable + ")").join(i))
            }
            return output.join("\n")
        } else {
            throw new Error("Check your Loop arguments")
        }
    }

    function gen_raycast(exp) {
        let id = genID + 1;
        let init =
            {
                type: 'initvar',
                name: 'mcscript_raycast',
                assign:
                    {
                        type: 'assign',
                        operator: '=',
                        left: {type: 'var', value: 'mcscript_raycast', selector: 'raycast' + id},
                        right: {type: 'num', value: 0}
                    }
            };
        let res = js_init(init);
        let whileObj = {cond: {}, then: {type: "prog", prog: []}, after: {type: "prog", prog: []}};
        if (exp.while) {
            if (exp.while.type === "prog") whileObj.then = exp.while;
            else whileObj.then.prog.push(exp.while)
        }
        whileObj.then.prog.push({
            type: "command",
            value: "scoreboard players add raycast" + id + " mcscript_raycast 1"
        });
        let end = {
            "type": "if",
            "cond": [{
                "type": "str",
                "value": "score raycast" + id + " mcscript_raycast matches .." + exp.duration + " if entity @s[tag=mcscriptStop] positioned ^ ^ ^1"
            }],
            "then": exp.end
        };
        whileObj.after.prog.push(end);
        let operator = "unless";
        if (exp.notblock) operator = "if";
        if (exp.toBlock) operator = "if block ~ ~ ~ " + exp.toBlock + " " + operator;
        if (exp.entity) {
            let entity = exp.entity;
            if (entity.slice(-1) === "]") entity = entity.substr(0, entity.length - 1) + ",distance=..0.7,sort=nearest]";
            else entity += "[distance=..0.7,sort=nearest]";
            whileObj.after.prog[0].cond[0].value += " as " + entity.replace("0.7", "2") + " at @s";
            whileObj.then.prog.push({
                type: "command",
                value: "execute positioned ^ ^ ^1 if entity " + entity + " run tag @s add mcscriptStop"
            });
            whileObj.then.prog.push({
                type: "command",
                value: "execute positioned ^ ^ ^1 positioned ~ ~-1 ~ if entity " + entity + " run tag @s add mcscriptStop"
            })
        } else whileObj.then.prog.push({
            type: "command",
            value: "execute positioned ^ ^ ^1 " + operator + " block ~ ~ ~ " + exp.block + " run tag @s add mcscriptStop"
        });
        whileObj.cond = [{"type": "str", "value": "block ~ ~ ~ " + exp.block, not: exp.notblock}, {
            "type": "str",
            "value": "score raycast" + id + " mcscript_raycast matches .." + exp.duration
        }];
        gen_while(whileObj, true, "raycast$(id)", " positioned ^ ^ ^1");
        return 'scoreboard players set raycast' + id + ' mcscript_raycast 0\nexecute positioned ~ ~1 ~ run function ' + prjName + ':mcscript/raycast' + id + '\n'
    }
    function gen_forEach(exp) {
        let res = js_init(exp.var);
        if (exp.then.type === "prog") {
            exp.then.prog.push(exp.binary)
        } else {
            let save = exp.then;
            exp.then = {type: "prog", prog: []};
            exp.then.prog.push(save);
            exp.then.prog.push(exp.binary)
        }
        res += '\n' + gen_while(exp, true, "foreach$(id)");
        return res
    }

    function gen_while(exp, checkBefore = true, customName = "while$(id)", prefix = "") {
        genID++;
        if (exp.customName) customName = exp.customName.value;
        customName = customName.replace("$(id)", genID);
        retString = "#file: " + prjPath + '/mcscript/' + customName + '\n';
        if (exp.then) retString += js(exp.then) + '\n';
        retString = retString.split('#stop').join('tag @s add mcscriptStop');
        retString = retString.split('#continue').join("function " + prjName + ':mcscript/' + customName);
        let middle = "";
        if (exp.cond.length < 1) throw("You must specify an argument for while! (" + oldFile + ")");
        for (let cond of exp.cond) {
            let nameOp = "if";
            if (cond.not) nameOp = "unless";
            if (cond.type === "binary") {
                middle += ' ' + nameOp + testforBinary(cond)
            }

            if (cond.op && cond.op === "or") {
                retString += "execute" + prefix + " if entity @s[tag=!mcscriptStop]" + " " + nameOp + " " + cond.value + " run function " + prjName + ':mcscript/' + customName + '\n'
            } else {
                if (cond.value) middle += " " + nameOp + " " + cond.value
            }
        }
        retString += "execute" + prefix + " if entity @s[tag=!mcscriptStop]" + middle + " run function " + prjName + ':mcscript/' + customName + '\n';
        if (exp.after) retString += js(exp.after);
        retString += 'tag @s[tag=mcscriptStop] remove mcscriptStop\n';
        processed[customName] = retString;
        if (checkBefore) return "execute" + middle + " run function " + prjName + ':mcscript/' + customName;
        return "function " + prjName + ':mcscript/' + customName
    }

    function js_modal(exp) {
        exp.call.after = js(exp.call.after);
        if (exp.override) {
            let old = modals.find(x => x.func === exp.call.func);
            if (old) {
                modals[modals.indexOf(old)] = exp.call
            } else console.error("\x1b[31m", "You cannot override " + exp.call.func + ", because it does not exist. in: " + oldFile, "\x1b[0m")
        } else {
            modals.push(exp.call)
        }

    }

    function gen_modal(modal, exp) {
      if (modal.type=="calljs")
      return gen_modaljs(modal,exp);
        let after = modal.after;
        modal.args.forEach((arg, num) => {
            if (exp.args[num] || arg.type === 'assign') {
                let newVal;
                let oldVal;
                if (arg.type === 'assign') {
                    newVal = exp.args[num] ? exp.args[num].value : arg.right.value;
                    oldVal = arg.left.value
                } else {
                    newVal = exp.args[num].value;
                    oldVal = arg.value
                }
                after = gen_const(after,oldVal,newVal)
            }
            else throw "At modal call \"" + modal.func + "\" no " + num + ". argument was found!"
        });
        return after
    }
    function js_modaljs(exp){
      exp.call.type = "calljs"
      if(exp.override){
        let old =  modals.find(x => x.func == exp.call.func)
        if(old){
          modals[modals.indexOf(old)] = exp.call
        } else console.error( "\x1b[31m","You cannot override " + exp.call.func + ", because it does not exist. in: " + oldFile,"\x1b[0m")
      } else {
        modals.push(exp.call)
      }
      return
    }
    function gen_modaljs(modal,exp){
      let jsArgs ={};
      for(var i = 0; i < modal.args.length; i++){
        if(modal.args[i].type=="var"){
          jsArgs[modal.args[i].value]=exp.args[i].value;
        }else if (modal.args[i].type=="assign"){
          jsArgs[modal.args[i].left.value] = modal.args[i].right.value;
          if(exp.args[i]){
            jsArgs[modal.args[i].left.value] = exp.args[i].value;
          }
        }
      }
      // nodejs way (more secure in a seperate vm)
      // jsArgs.console = console
      // let virtualRes = vm.runInNewContext("var res = function(){"+modal.after[0].value+"};res = res()",jsArgs);
      // return jsArgs.res
      // vanilla way for browser usage
      let virtualRes = new Function(...Object.keys(jsArgs).concat([modal.after[0].value]))
      return virtualRes(...Object.values(jsArgs));
    }
};
function checkFilename(data,oldFile,then,ignoreSingle = false){
  if(data[0] != ""){
    let file = oldFile.replace(".mcscript","")
    then(file,data[0].split("\n"))
  }
  if(data.length > 1){
    for(let i = 1; i < data.length; i++){
      let dat = data[i]
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
    }
  } else {
    let file = oldFile.replace(".mcscript","")
    if(!ignoreSingle) then(file,data)
  }
}
handleFiles = function (data, oldFile) {
    let files = [];
    if (oldFile.endsWith('load.mcscript')) {
        data = '#file: ./mcscript/load\n#file: ./load\nfunction ' + prjName + ':mcscript/load' + "\n" + data.replace("#file: ./load", "")
    }
    let savedData = data;
    let extendArr = [];
    data = data.split("#file: ");
    for (let datChunk of data) {
        let extended = datChunk.split("#extend: ");
        if (extended.length > 1) {
            extendArr = extended.slice(1);
            data[data.indexOf(datChunk)] = extended[0]
        }
    }
    checkFilename(data, oldFile, function (file, dat) {
        files.push({name: file + '.mcfunction', data: dat.join("\n")})
    });
    extendArr.push("");
    checkFilename(extendArr, oldFile, function (file, dat) {
        dat = "\n# Extended from " + oldFile + " to " + file + ".mcfunction\n" + dat.join("\n");
        let editFiles = files.find(function (obj) {
            return obj.name === file + '.mcfunction'
        });
        if (editFiles) files[files.indexOf(editFiles)].data += "\n" + dat;
        else {
            files.push({name: file + '.mcfunction', data: dat})
        }
    }, true);
    return files
};
const compile = function (input, oldFile) {
    input = input.split("\n");
    for (let item of input) {
        if (",;({[".indexOf(item.trim().slice(-1)) === -1) {
            input[input.indexOf(item)] += ";"
        }
    }
    input = input.join("\n");
    let ast = parse(TokenStream(InputStream(input)));
    return handleFiles(generate(ast, oldFile), oldFile)
};
var myExtObject = (function() {
  return {
    compile: function(files){
      let output = []
      for(let file of files){
        try{
          output = output.concat(compile(file.content, file.name))
        }
        catch(err){
          if(err) console.log(err.message + file.name)
        }
      }
      return output
    }
  }
})(myExtObject||{})
