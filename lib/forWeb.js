
InputStream = function(input,file = '') {
  if(file) file = ' in file ' + file
  var pos = 0, line = 1, col = 0;
  return {
    next  : next,
    peek  : peek,
    peekNext  : peekNext,
    getCol  : getCol,
    eof   : eof,
    croak : croak,
  };
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
  function peek() {
    return input.charAt(pos);
  }
  function peekNext(num) {
    return input.charAt(pos + num);
  }
  function getCol() {
    let num = col
    let pos2 = pos - 1
    while(" \r\n\t".indexOf(input.charAt(pos2)) >= 0 && num >= 1){
      pos2--
      num--
    }
    return num
  }
  function eof() {
    return peek() == "";
  }
  function croak(msg) {
    throw new Error(msg + " (" + line + ":" + col + ")" + file);
  }
}

var TokenStream = function(input) {
  var current = null;
  var keywords = " if then else true false for as at asat positioned modal align dimension rotated anchored while do forEach raycast stop continue switch case default var bool boolean tag score const ";
  return {
    next  : next,
    peek  : peek,
    eof   : eof,
    croak : input.croak
  };
  function is_keyword(x) {
    return keywords.indexOf(" " + x + " ") >= 0;
  }
  function is_digit(ch) {
    return /[0-9]/i.test(ch);
  }
  function is_id_start(ch) {
    return /[a-zÎ»_]/i.test(ch);
  }
  function is_id(ch) {
    return is_id_start(ch) || "?!-<>=0123456789".indexOf(ch) >= 0;
  }
  function is_op_char(ch) {
    return "+-*/%=&|<>!".indexOf(ch) >= 0;
  }
  function is_punc(ch) {
    return ",;(){}[]".indexOf(ch) >= 0;
  }
  function is_whitespace(ch) {
    return " \r\n\t".indexOf(ch) >= 0;
  }
  function read_while(predicate) {
    var str = "";
    while (!input.eof() && predicate(input.peek()))
    str += input.next();
    return str;
  }
  function read_number() {
    var has_dot = false;
    var number = read_while(function(ch){
      if (ch == ".") {
        if (has_dot) return false;
        has_dot = true;
        return true;
      }
      return is_digit(ch);
    });
    return { type: "num", value: parseFloat(number) };
  }
  function read_ident() {
    var id = read_while(is_id);
    return {
      type  : is_keyword(id) ? "kw" : "var",
      value : id
    };
  }
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
  function read_string() {
    return { type: "str", value: read_escaped('"') };
  }
  function read_string2() {
    return { type: "str", value: read_escaped("'") };
  }
  function skip_comment() {
    read_while(function(ch){ return ch != "\n" });
    input.next();
  }
  function readSelector(){
    let value = input.next() + input.next()
    if(input.peek() == "[") {
      value += read_while(function(ch){ return ch != "]" }) + input.next()
    }
    return { type: "selector", value: value }
  }
  function read_comment() {
    return { type: "comment", value: read_while(function(ch){ return ch != "\n" && ch != ";" }) }
  }
  function read_command() {
    let command = read_while(function(ch){ return ch != "\n" && ch != ";" })
    if(command[0] == "/") command = command.substr(1)
    return { type: "command", value: command.split('run: ').join("")}
  }
  function read_next() {
    read_while(is_whitespace);
    if (input.eof()) return null;
    var ch = input.peek();
    if(ch == "/" && input.peekNext(1) == "/"){
      skip_comment()
      return read_next();
    }
    if(ch == "r" && input.peekNext(1) == "u" && input.peekNext(2) == "n" && input.peekNext(3) == ":") {
      return read_command();
    }
    if(ch == "/" && input.getCol() === 0){
      return read_command();
    }
    if(ch == "$"){
      console.log(input.peekNext(1))
      if(input.peekNext(1) == "("){
        let res = {type: "num", value: read_while(function(ch){ return ch != ")" }) + ")"}
        input.next()
        return res
      }
    }
    if (ch == "#") {
      return read_comment()
    }
    if (ch == "@") return readSelector()
    if (ch == '"') return read_string();
    if (ch == "'") return read_string2();
    if (is_digit(ch)) return read_number();
    if (is_id_start(ch)) return read_ident();
    if (is_punc(ch)) return {
      type  : "punc",
      value : input.next()
    };
    if (is_op_char(ch)) return {
      type  : "op",
      value : read_while(is_op_char)
    };
    input.croak("Can't handle character: " + JSON.stringify(ch));
  }
  function peek() {
    return current || (current = read_next());
  }
  function next() {
    var tok = current;
    current = null;
    return tok || read_next();
  }
  function eof() {
    return peek() == null;
  }
}

parse = function(input) {
  var PRECEDENCE = {
    "=": 1,
    "||": 2,
    "&&": 3,
    "<": 7, ">": 7, "<=": 7, ">=": 7, "==": 7, "!=": 7,
    "+": 10, "-": 10, "+=": 10, "-=": 10,
    "*": 20, "/": 20, "%": 20, "*=": 20, "/=": 20, "%=": 20,
  };
  return parse_toplevel();
  function is_punc(ch) {
    var tok = input.peek();
    return tok && tok.type == "punc" && (!ch || tok.value == ch) && tok;
  }
  function is_kw(kw) {
    var tok = input.peek();
    return tok && tok.type == "kw" && (!kw || tok.value == kw) && tok;
  }
  function is_op(op) {
    var tok = input.peek();
    return tok && tok.type == "op" && (!op || tok.value == op) && tok;
  }
  function skip_punc(ch) {
    if (is_punc(ch)) input.next();
    else input.croak("Expecting punctuation: \"" + ch + "\"");
  }
  function skip_kw(kw) {
    if (is_kw(kw)) input.next();
    else input.croak("Expecting keyword: \"" + kw + "\"");
  }
  function skip_op(op) {
    if (is_op(op)) input.next();
    else input.croak("Expecting operator: \"" + op + "\"");
  }
  function unexpected() {
    input.croak("Unexpected token: " + JSON.stringify(input.peek()));
  }
  function maybe_binary(left, my_prec) {
    var tok = is_op();
    if(left && left.type == "var" && input.peek().value == "++"){
      input.next()
      return {type: "binary", operator: "+=", left: left, right: {type:'num', value: 1}}
    }
    if(left && left.type == "var" && input.peek().value == "--"){
      input.next()
      return {type: "binary", operator: "-=", left: left, right: {type:'num', value: 1}}
    }
    if(left && left.type == "var" && left.value.slice(-2) === "--"){
      left.value = left.value.substr(0, left.value.length - 2)
      return {type: "binary", operator: "-=", left: left, right: {type:'num', value: 1}}
    }
    if (tok) {
      var his_prec = PRECEDENCE[tok.value];
      if (his_prec > my_prec) {
        input.next()
        return maybe_binary({
          type     : tok.value == "=" ? "assign" : "binary",
          operator : tok.value,
          left     : left,
          right    : maybe_binary(parse_atom(), his_prec)
        }, my_prec);
      }
    }
    return left;
  }
  function delimited(start, stop, separator, parser) {
    var a = [], first = true;
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
  function parse_call(func) {
    ret = {
      type: "call",
      func: func,
      args: delimited("(", ")", ",", parse_expression),
    };
    if (is_punc("{")) ret.after = parse_expression();
    return ret
  }
  function parse_varname() {
    var name = input.next();
    if (name.type != "var") input.croak("Expecting variable name");
    return name.value;
  }
  function parse_if() {
    skip_kw("if");
    input.next()
    var cond = parse_key_args()
    input.next()
    if (!is_punc("{")) skip_kw("then");
    var then = parse_expression();
    var ret = {
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
  function parse_while() {
    skip_kw("while");
    input.next()
    var cond = parse_key_args()
    input.next()
    let custom
    if(input.peek().type == "str"){
      custom = input.next()
    }
    if (!is_punc("{")) skip_kw("then");
    var then = parse_expression();
    var ret = {
      type: "while",
      cond: cond,
      then: then,
    };
    if(custom) ret.customName = custom
    return ret;
  }
  function parse_dowhile() {
    skip_kw("do");
    let custom
    if(input.peek().type == "str"){
      custom = input.next()
    }
    if (!is_punc("{")) skip_kw("then");
    var then = parse_expression();
    skip_kw("while");
    input.next()
    var cond = parse_key_args()
    input.next()
    var ret = {
      type: "dowhile",
      cond: cond,
      then: then,
    };
    if(custom) ret.customName = custom
    return ret;
  }
  function parse_forEach() {
    skip_kw("forEach");
    input.next()
    let variable = parse_var(input.peek().value)
    if(!variable.assign) variable.assign = { type: 'assign',operator: '=', left: { type: 'var', value: variable.name }, right: { type: 'num', value: 0 } }
    input.next()
    let cond = parse_key_args()
    input.next()
    let binary = maybe_binary(input.next(),0)
    input.next()
    let custom
    if(input.peek().type == "str"){
      custom = input.next()
    }
    if (!is_punc("{")) skip_kw("then");
    var then = parse_expression();
    var ret = {
      type: "forEach",
      cond: cond,
      var: variable,
      binary: binary,
      then: then,
    };
    if(custom) ret.customName = custom
    return ret;
  }
  function parse_raycast(){
    skip_kw("raycast")
    let res = {type: "raycast", duration: 100, block: "air"}
    if(input.peek().value == "("){
      input.next()
      if(input.peek().type == "num"){
        res.duration = input.next().value
        input.next()
      }
      if(input.peek().type == "str"){
        res.block = input.next().value
        input.next()
      }
      if(input.peek().value == ")") input.next()
    }
    res.end = parse_prog()
    if(input.peek().value == ","){
      input.next()
      res.while = parse_prog()
    }
    return res
  }
  function parse_key_args(){
    let cond = []
    let before = {type: 'op', value: "&&"}
    while(input.peek().value != ")" && input.peek().value != ";"){
      let next = input.next()
      if(next.value == "!"){
        before = next
        continue
      }
      if(next.type == "selector"){
        if(before.type == "binary") before.right.selector = next
        else if(before.type == "var") before.selector = next
        else cond.push(next)
        continue
      }
      if("> < >= <= == != ".indexOf(next.value + " ") > -1){
        cond.splice(cond.indexOf(before),1)
        next = {type: 'binary', left: before, operator: next.value, right: input.next()}
        if(before.op){
            next.op = before.op
            delete next.left.op
        }
        cond.push(next)
      }
      if(before.value == "&&"){
        cond.push(next)
      }
      if(before.value == "||" || before.value == ","){
        next.op = "or"
        cond.push(next)
      }
      if(before.value == "!"){
        next.not = true
        cond.push(next)
      }
      before = next
    }
    return cond
  }
  function parse_keyword(kw) {
    skip_kw(kw);
    input.next()
    var cond = parse_key_args()
    input.next()

    let next = input.peek()
    if(next.value == "{"){}
    else if(next.value == ",") {
      input.next()
      let nest = parse_keyword(input.peek().value)
      let res = {
        type: kw,
        nest: [],
        cond: cond,
        then: nest.then,
      }
      res.nest.push({type: nest.type, cond: nest.cond})
      if(nest.nest) res.nest = res.nest.concat(nest.nest)
      return res
    }
    else skip_kw("then");
    //else skip_kw("then");
    var then = parse_expression();
    var ret = {
      type: kw,
      cond: cond,
      then: then,
    };
    return ret;
  }
  function parse_for() {
    skip_kw("for");
    let args = delimited("(", ")", ",", parse_expression)
    let then = parse_expression();
    var ret = {
      type: "for",
      args: args,
      after: then
    };
    return ret;
  }
  function parse_var(kw){
    skip_kw(kw)
    let name = input.next().value
    let res = {type:"initvar",name:name}
    if(input.peek().type == "selector") res.selector = input.next()
    if(input.peek().type == "var") res.selector = {type: "selector", value: input.next().value}
    let assign = maybe_binary({type:"var",value:name, selector: res.selector},0)
    if(assign.type == "assign") res.assign = assign
    return res
  }
  function parse_bol(kw){
    skip_kw(kw)
    let name = input.next().value
    let res = {type:"initbool",name:name}
    if(input.peek().type == "selector") res.selector = input.next()
    if(input.peek().type == "var") res.selector = {type: "selector", value: input.next().value}
    let assign = maybe_binary({type:"var",value:name, selector: res.selector},0)
    if(assign.type == "assign" && assign.right.type == "bool") res.assign = assign
    else input.croak("Your assignment is not right! Please assign a boolean value.")
    return res
  }
  function parse_const(){
    skip_kw('const')
    let name = input.next().value
    input.next()
    let assign = input.next()
    if(assign.type != "num" && assign.type != "str") input.croak("You have to assign a string or number to a constant!")
    return {
      type: "const",
      value: name,
      assign: assign.value
    }
  }
  function parse_modal() {
    skip_kw("modal");
    return {type: "modal", call: parse_call(input.next().value)};
  }
  function parse_switch(){
    skip_kw("switch")
    let res = {type: "switch", var: {}, cases:[]}
    let variable = delimited("(",")",",",x => input.next())
    res.var = variable[0]
    if(variable[1] && variable[1].type == "selector") res.var.selector = variable[1]
    res.cases = delimited("{","}",",",() => {
      let def = false
      if(input.peek().value == "default") {
        def = true
        skip_kw("default")
      } else skip_kw("case")
      let cond = []
      if(!def && input.peek().type == "op") cond.push(maybe_binary(res.var,0))
      else if(!def && input.peek().type == "num") cond.push({type: "binary", left: res.var, right: input.next(),operator: "=="})
      let then
      if(input.peek().value == "{") then = parse_prog()
      else then = parse_expression()

      if(input.peek().value == ";") skip_punc(";")
      return {type: def ? "default" : "case", cond: cond, then: then}
    })
    return res
  }
  function parse_lambda() {
    return {
      type: "lambda",
      vars: delimited("(", ")", ",", parse_varname),
      body: parse_expression()
    };
  }
  function parse_bool() {
    return {
      type  : "bool",
      value : input.next().value == "true"
    };
  }
  function returnKey(keyword){
    skip_kw(keyword)
    return {type: keyword}
  }
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
      if(is_kw("const")) return parse_const()
      if (is_kw("var")|| is_kw("score")) return parse_var(input.peek().value);
      if (is_kw("bool")|| is_kw("tag") || is_kw("boolean")) return parse_bol(input.peek().value);
      if (is_kw("asat") || is_kw("as") || is_kw("at") || is_kw("positioned") || is_kw("align") || is_kw("rotated") || is_kw("anchored") || is_kw("dimension")) return parse_keyword(input.peek().value);
      if (is_kw("for")) return parse_for();
      if (is_kw("forEach")) return parse_forEach();
      if (is_kw("raycast")) return parse_raycast();
      if (is_kw("stop")) return returnKey('stop')
      if (is_kw("continue")) return returnKey('continue')
      if (is_kw("switch")) return parse_switch()
      //if (is_kw("selector")) return returnKey('selector')
      if (is_kw("while")) return parse_while();
      if (is_kw("do")) return parse_dowhile();
      if (is_kw("modal")) return parse_modal();
      if (is_kw("true") || is_kw("false")) return parse_bool();
      var tok = input.next();
      if(tok.type == "comment" || tok.type == "command"){
        return tok
      }
      if(tok.type == "var"){
        if(input.peek().type == "selector"){
          tok.selector = input.next()
        }
        if(input.peek().type == "var"){
          tok.selector = {type: "selector", value: input.next().value}
        }
        return tok
      }
      if (tok.type == "num" || tok.type == "str") return tok
      unexpected();
    });
  }
  function parse_toplevel() {
    var prog = [];
    while (!input.eof()) {
      prog.push(parse_expression());
      if (!input.eof()) skip_punc(";");
    }
    return { type: "prog", prog: prog };
  }
  function parse_prog() {
    var prog = delimited("{", "}", ";", parse_expression);
    if (prog.length == 0) return FALSE;
    if (prog.length == 1) return prog[0];
    return { type: "prog", prog: prog };
  }
  function parse_expression() {
    return maybe_call(function(){
      return maybe_binary(parse_atom(), 0);
    });
  }
}
generate = function(exp) {

  var modals = [{"type":"call","func":"log","args":[{"type":"var","value":"text"},{"type":"assign","operator":"=","left":{"type":"var","value":"sel"},"right":{"type":"str","value":"@a"}}],"after":"tellraw $(sel) [{\"text\":\"console => \",\"color\":\"aqua\"},{\"text\":\"$(text)\",\"color\":\"white\"}]"},{"type":"call","func":"newStand","args":[{"type":"assign","operator":"=","left":{"type":"var","value":"name"},"right":{"type":"str","value":""}},{"type":"assign","operator":"=","left":{"type":"var","value":"position"},"right":{"type":"str","value":"~ ~ ~"}},{"type":"assign","operator":"=","left":{"type":"var","value":"tags"},"right":{"type":"str","value":"[]"}},{"type":"assign","operator":"=","left":{"type":"var","value":"marker"},"right":{"type":"num","value":1}},{"type":"assign","operator":"=","left":{"type":"var","value":"invisible"},"right":{"type":"num","value":1}},{"type":"assign","operator":"=","left":{"type":"var","value":"noGravity"},"right":{"type":"num","value":1}}],"after":"summon armor_stand $(position) {CustomName:\"{\\\"text\\\":\\\"$(name)\\\"}\", Tags: $(tags),Invisible:$(invisible),Marker:$(marker),NoGravity:$(noGravity)}"},{"type":"call","func":"play","args":[{"type":"var","value":"sound"},{"type":"assign","operator":"=","left":{"type":"var","value":"selector"},"right":{"type":"str","value":"@s"}},{"type":"assign","operator":"=","left":{"type":"var","value":"type"},"right":{"type":"str","value":"master"}}],"after":"playsound $(sound) $(type) $(selector)\r"}]

  let vars = []
  let tags = []
  let tagOhne = false
  let consts = []
  let processed = {}
  var genID = 1
  let prjPath = ""
  let prjName = "prjname"

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
      case "initbool"   : return js_initBool(exp);
      case "initvar"    : return js_init(exp);
      case "const"    : return js_const(exp);
      case "var"    : return js_var    (exp);
      case "binary" : return js_binary (exp);
      case "assign" : return js_assign (exp);
      case "let"    : return js_let    (exp);
      case "if"     : return make_if(exp);
      case "switch"     : return make_switch(exp);
      case "as"     : return make_indent(exp,"as");
      case "asat"     : return make_indent(exp,"asat");
      case "at"     : return make_indent(exp,"at");
      case "align"  : return make_indent(exp,"align");
      case "dimension": return make_indent(exp,"in");
      case "rotated"     : return make_indent(exp,"rotated");
      case "anchored"     : return make_indent(exp,"anchored");
      case "positioned"     : return make_indent(exp,"positioned");
      case "for"   : return gen_for   (exp);
      case "forEach"   : return gen_forEach(exp);
      case "raycast"   : return gen_raycast(exp);
      case "while"   : return gen_while   (exp);
      case "dowhile"   : return gen_while (exp, false, "dowhile$(id)");
      case "prog"   : return js_prog   (exp);
      case "call"   : return js_call   (exp);
      default:
      throw new Error("Dunno how to generate mcfunction for " +exp.type+" in " + oldFile);
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
    if(tags.indexOf(exp.name) < 0 && exp.right.type == "bool") return js_assignBool(exp)
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
    if(processed['mcscript/load']) processed['mcscript/load'] += 'scoreboard objectives add ' + exp.name + ' dummy\n'
    else processed['mcscript/load'] = '#extend: '+ prjPath +'/mcscript/load\n# please do not touch this file!\n# it is used by the compiler!\nscoreboard objectives add ' + exp.name + ' dummy\n'
    if(exp.assign) return js_assign(exp.assign)
  } else console.error( "\x1b[31m","The varible " + exp.name + " was declared multiple times!","\x1b[0m")
  }
  function js_initBool(exp){
    if(tags.indexOf(exp.name) < 0){
    tags.push(exp.name)
    if(exp.assign) return js_assignBool(exp.assign)
  } else console.error( "\x1b[31m","The boolean " + exp.name + " was declared multiple times!","\x1b[0m")
  }
  function js_assignBool(exp){
    if(!exp.left.selector && !tagOhne){
      if(processed['mcscript/load']) processed['mcscript/load'] += 'execute unless entity @e[tag=mcscriptTags] at @p run summon armor_stand ~ ~ ~ {Tags:[mcscriptTags],Invisible:1,Invulnerable:1,NoGravity:1}\n'
      else processed['mcscript/load'] = '#extend: '+ prjPath +'/mcscript/load\n# please do not touch this file!\n# it is used by the compiler!\nexecute unless entity @e[tag=mcscriptTags] at @p run summon armor_stand ~ ~ ~ {Tags:[mcscriptTags],Invisible:1,Invulnerable:1,NoGravity:1}\n'
      tagOhne = true
    }
    let selector = exp.left.selector ? exp.left.selector.value : "@e[tag=mcscriptTags]"
    if(exp.right.value) return "tag " + selector + " add " + exp.left.value
    return "tag " + selector + " remove " + exp.left.value
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
  function make_switch(exp){
    let name = exp.var.value
    let def = exp.cases.find(x => x.type == "default")
    let res = ""
    if(def) exp.cases.splice(exp.cases.indexOf(def),1)
    for(let cased of exp.cases){
      if(cased.then.type != "prog"){
        let save = cased.then
        cased.then = {type: "prog", prog: []}
        cased.then.prog.push(save)
      }
      cased.then.prog.push({type:"command",value:"tag @s add mcscriptSwitch"})
      cased.cond.push({type: "str", value: "entity @s[tag=!mcscriptSwitch]"})
      res += make_if(cased)
    }
    if(def){
      def.cond = [{type: "str", value: "entity @s[tag=!mcscriptSwitch]"}]
      res += make_if(def)
    }
    res += "tag @s remove mcscriptSwitch"
    return res
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
    console.log(cond)
    if(cond.right.type == "var"){
      return " score " + selector.value+ ' '+ cond.left.value + ' ' + cond.operator + ' '+ selector2.value + ' ' + cond.right.value
    } else if(cond.right.type == "num" && cond.operator == "=="){
      return " score " + selector.value+ ' '+ cond.left.value + ' matches ' + cond.right.value
    }
    else if(cond.right.type == "num" && cond.operator == ">"){
      return " score " + selector.value+ ' '+ cond.left.value + ' matches ' + (cond.right.value + 1) + '..'
    }
    else if(cond.right.type == "num" && cond.operator == "<"){
      return " score " + selector.value+ ' '+ cond.left.value + ' matches ..' + (cond.right.value - 1)
    }
    else if(cond.right.type == "num" && cond.operator == ">="){
      return " score " + selector.value+ ' '+ cond.left.value + ' matches ' + cond.right.value + '..'
    }
    else if(cond.right.type == "num" && cond.operator == "<="){
      return " score " + selector.value+ ' '+ cond.left.value + ' matches ..' + cond.right.value
    }
    else throw "Don´t know what you mean with " + cond.operator + '?\n In: ' + oldFile
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
        if(cond.type == "selector" && (name == "unless" || name == "if")) nameOp += " entity"
        if(cond.type == "var" && tags.indexOf(cond.value) != -1 && (name == "unless" || name == "if")){
          nameOp += " entity"
          if(cond.selector && cond.selector.value.slice(-1) == "]") cond.value = cond.selector.value.substr(0, cond.selector.value.length - 1) + ",tag="+cond.value+"]"
          else if(cond.selector) cond.value = cond.selector.value + "[tag="+cond.value+"]"
          else cond.value = "@e[tag=mcscriptTags,tag="+cond.value+"]"
        } else if(cond.type == "var" && vars.indexOf(cond.value) != -1 && (name == "unless" || name == "if")){
          nameOp += " score"
          if(cond.selector) cond.value = cond.selector.value + "matches 1.."
          else cond.value = cond.value+" matches 1.."
        }
        if(name == "asat") nameOp = "as " + cond.value + " at"

        if(exp.nest){
          for(let nested of exp.nest){
            for(let nestedCond of nested.cond){
              let keyWord = nested.type
              if(nestedCond.not && nested.type == "if") keyWord = "unless"
              if(nestedCond.not && nested.type == "unless") keyWord = "if"
              if(nested.type == "dimension") keyWord = "in"
              if(nestedCond.type == "selector" && (nested.type == "if" || nested.type == "unless")) keyWord += " entity"
              if(nested.type == "asat") keyWord = "as " + cond.value + " at"

              if(nestedCond.op && nestedCond.op == "or"){
                commands.push("execute" + " " + nameOp +" " + cond.value + " " + keyWord +" " + nestedCond.value + " run " + sT)
              } else {

                if(nestedCond.value != undefined) nestedMiddle += " " + keyWord +" " + nestedCond.value
                else if(cond.type == "binary" && (name == "if" || name == "unless")){
                  nestedMiddle += ' ' + keyWord + testforBinary(cond)
                }
              }
            }
          }
        }
        if(cond.op && cond.op == "or"){
          if(cond.value != undefined) commands.push("execute" + " " + nameOp +" " + cond.value + nestedMiddle + " run " + sT)
          else if(cond.type == "binary") commands.push("execute" + " " + nameOp +" " + testforBinary(cond) + nestedMiddle + " run " + sT)
        } else {
          if(cond.value != undefined) middle += " " + nameOp +" " + cond.value
          if(cond.type == "binary" && (name == "unless" || name == "if")){
            middle += ' ' + nameOp + testforBinary(cond)
          }
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
  function gen_raycast(exp){
    let id = genID + 1
    let init = { type: 'initvar',
    name: 'raycast' + id,
    assign:
   { type: 'assign',
     operator: '=',
     left: { type: 'var', value: 'raycast' + id },
     right: { type: 'num', value: 0 }
   }
 }
    let res = js_init(init)
    let whileObj = {cond: {}, then: {type: "prog", prog: []}}
    if(exp.while){
      if(exp.while.type == "prog") whileObj.then = exp.while
      else whileObj.then.prog.push(exp.while)
    }
    whileObj.then.prog.push({type: "command", value: "scoreboard players add raycast"+ id + " raycast"+ id +" 1"})
    let end = {"type":"positioned","nest":[{"type":"if","cond":[{"type":"str","value":"block ~ ~ ~ " + exp.block,"not":true}]}],"cond":[{"type":"str","value":"^ ^ ^1"}],"then":exp.end}
    whileObj.then.prog.push(end)
    whileObj.then.prog.push({type: "command", value: "execute positioned ^ ^ ^1 unless block ~ ~ ~ "+exp.block+" run tag @s add mcscriptStop"})
    whileObj.cond = [{"type":"str","value":"block ~ ~ ~ " + exp.block}, {"type":"str","value":"score raycast"+ id + " raycast"+ id + " matches .." + exp.duration}]
    gen_while(whileObj,true, "raycast$(id)", " positioned ^ ^ ^1")
    return 'scoreboard players set raycast'+id+' raycast'+id+' 0\nexecute positioned ~ ~1 ~ run function '+prjName+':mcscript/raycast' + id + '\n'
  }
  function gen_forEach(exp){
    let res = js_init(exp.var)
    if(exp.then.type == "prog"){
      exp.then.prog.push(exp.binary)
    } else {
      let save = exp.then
      exp.then = {type: "prog", prog:[]}
      exp.then.prog.push(save)
      exp.then.prog.push(exp.binary)
    }
    res += '\n' + gen_while(exp,true,"foreach$(id)")
    return res
  }
  function gen_while(exp,checkBefore = true, customName = "while$(id)", prefix = ""){
    genID++
    if(exp.customName) customName = exp.customName.value
    customName = customName.replace("$(id)",genID)
    retString = "#file: " + prjPath + '/mcscript/' + customName + '\n'
    retString += js(exp.then) + '\n'
    retString = retString.split('#stop').join('tag @s add mcscriptStop')
    retString = retString.split('#continue').join("function " + prjName + ':mcscript/' + customName)
    let middle = ""
    if(exp.cond.length < 1) throw("You must specify an argument for while! ("+oldFile+")")
    for(let cond of exp.cond){
      let nameOp = "if"
      if(cond.not) nameOp = "unless"
      if(cond.type == "binary"){
        middle += ' ' + nameOp + testforBinary(cond)
      }

      if(cond.op && cond.op == "or"){
        retString += "execute"+prefix+" if entity @s[tag=!mcscriptStop]" + " " + nameOp +" " + cond.value + " run function " + prjName + ':mcscript/' + customName + '\n'
      } else {
        if(cond.value) middle += " " + nameOp +" " + cond.value
      }
    }
    retString += "execute"+prefix+" if entity @s[tag=!mcscriptStop]" + middle + " run function " + prjName + ':mcscript/' + customName + '\n'
    retString += 'tag @s[tag=mcscriptStop] remove mcscriptStop'
    processed[customName] = retString
    if(checkBefore) return "execute" + middle + " run function " + prjName + ':mcscript/' +customName
    return "function " + prjName + ':mcscript/' +customName
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

handleFiles = function(data,oldFile){
  let files = []
  if(oldFile == 'load.mcscript'){
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
    files.push({name: file  + '.mcfunction', data: dat.join("\n")})
  });

  extendArr.push("")
  checkFilename(extendArr,oldFile,function(file,dat){
    dat =  "\n# Extended from "+oldFile+" to "+ file + ".mcfunction\n" + dat.join("\n")
    let editFiles = files.find(function (obj) { return obj.name === file + '.mcfunction' });
    console.log(editFiles)
    if(editFiles) files[files.indexOf(editFiles)].data += "\n" + dat
    else {
      console.log(dat);
      files.push({name: file  + '.mcfunction', data: dat})
    }
  },true)

  return files
}
// compile(input){
//   let ast = this.parse(this.TokenStream(this.InputStream(input)))
//   return ast
//   //return this.generate(ast)
// }

var myExtObject = (function() {

  return {
    compile: function(input,oldFile){
      input = input.split("\n")
      for(let item of input){
        if(",;({[".indexOf(item.trim().slice(-1)) == -1){
          input[input.indexOf(item)] += ";"
        }
      }
      input= input.join("\n")
      let ast = parse(TokenStream(InputStream(input)))
      return handleFiles(generate(ast),oldFile)
      // let output = TokenStream(InputStream(input))
      // let array = []
      // let iscurrent = true
      // while(iscurrent){
      //   let d = output.next()
      //   if(d){
      //     array.push(d)
      //     iscurrent = true
      //   } else iscurrent = false
      // }
      // return JSON.stringify(array)
    }
  }

})(myExtObject||{})
