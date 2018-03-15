const fs = require('fs');
function InputStream(input, file = '') {
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
    while(" \r\n".indexOf(input.charAt(pos2)) >= 0 && num >= 1){
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

function TokenStream(input) {
  var current = null;
  var keywords = " if then else true false for as at positioned modal align dimension rotated anchored while stop continue var score const ";
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
    return " \r\n".indexOf(ch) >= 0;
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

exports.lexer = function(str,file = ''){
  // let output = TokenStream(InputStream(str))
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

  return TokenStream(InputStream(str,file))
}
