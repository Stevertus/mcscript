
  InputStream = function(input) {
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
        // if(",;(){[".indexOf(input.charAt(pos--)) == -1){
        //   input[pos] = ";"
        // }
        //pos++
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
      throw new Error(msg + " (" + line + ":" + col + ")");
    }
  }

  var TokenStream = function(input) {
    var current = null;
    var keywords = " if then else lambda Î» true false for as at positioned modal ";
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
      if (ch == "#") {
        return read_comment()
      }
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
      "+": 10, "-": 10,
      "*": 20, "/": 20, "%": 20,
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
      if (tok) {
        var his_prec = PRECEDENCE[tok.value];
        if (his_prec > my_prec) {
          input.next();
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
    function parse_key_args(){
      let cond = []
      let before = {type: 'op', value: "&&"}
      while(input.peek().value != ")"){
        let next = input.next()
        if(next.value == "!"){
          before = next
          continue
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
      if (!is_punc("{")) skip_kw("then");
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
    function parse_modal() {
      skip_kw("modal");
      return {type: "modal", call: parse_call(input.next().value)};
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
    function maybe_call(expr) {
      expr = expr();
      return is_punc("(") ? parse_call(expr) : expr;
    }
    function parse_atom() {
      var expectEnd
      return maybe_call(function(){
        if (is_punc("(")) {
          input.next();
          var exp = parse_expression();
          skip_punc(")");
          return exp;
        }
        if (is_punc("{")) return parse_prog();
        if (is_kw("if")) return parse_if();
        if (is_kw("as")) return parse_keyword("as");
        if (is_kw("at")) return parse_keyword("at");
        if (is_kw("positioned")) return parse_keyword("positioned");
        if (is_kw("for")) return parse_for();
        if (is_kw("modal")) return parse_modal();
        if (is_kw("true") || is_kw("false")) return parse_bool();
        if (is_kw("lambda") || is_kw("λ")) {
          input.next();
          return parse_lambda();
        }
        var tok = input.next();
        if(tok.type == "comment" || tok.type == "command"){
          return tok
        }
        if (tok.type == "var" || tok.type == "num" || tok.type == "str")
        return tok;
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
    return js(exp);

    let modals = [{"type":"call","func":"log","args":[{"type":"var","value":"text"},{"type":"assign","operator":"=","left":{"type":"var","value":"sel"},"right":{"type":"str","value":"@a"}}],"after":"tellraw $(sel) [{\"text\":\"console => \",\"color\":\"aqua\"},{\"text\":\"$(text)\",\"color\":\"white\"}]"},{"type":"call","func":"newStand","args":[{"type":"assign","operator":"=","left":{"type":"var","value":"name"},"right":{"type":"str","value":""}},{"type":"assign","operator":"=","left":{"type":"var","value":"position"},"right":{"type":"str","value":"~ ~ ~"}},{"type":"assign","operator":"=","left":{"type":"var","value":"tags"},"right":{"type":"str","value":"[]"}},{"type":"assign","operator":"=","left":{"type":"var","value":"marker"},"right":{"type":"num","value":1}},{"type":"assign","operator":"=","left":{"type":"var","value":"invisible"},"right":{"type":"num","value":1}},{"type":"assign","operator":"=","left":{"type":"var","value":"noGravity"},"right":{"type":"num","value":1}}],"after":"summon armor_stand $(position) {CustomName:\"{\\\"text\\\":\\\"$(name)\\\"}\", Tags: $(tags),Invisible:$(invisible),Marker:$(marker),NoGravity:$(noGravity)}"}]

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
        // if(exp.then.type == "prog"){
        //   for(comm of exp.then.prog){
        //     //if(comm.type == "command") commands.push("execute if " + exp.cond.value + " run " + comm.value)
        //     subTree = subTree.concat(js(comm).split("\n"))
        //   }
        // } else {
        //   subTree = subTree.concat(js(exp.then).split("\n"))
        // }
        for(let sT of subTree){
          if(sT == "") continue
          let middle = ""
          for(let cond of exp.cond){
            let nameOp = name
            if(cond.not && name == "if") nameOp = "unless"
            if(cond.not && name == "unless") nameOp = "if"
            if(cond.op && cond.op == "or"){
              commands.push("execute"+ " " + nameOp +" " + cond.value + " run " + sT)
            } else middle += " " + nameOp +" " + cond.value
          }
          commands.push("execute"+ middle + " run " + sT)
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
  handleFiles = function(data,oldFile){
    let files = []
    data = data.split("#file: ")
    if(data.length > 1){
      for(let dat of data){
        if(dat != ""){
          dat = dat.split("\n")
          let file = dat[0].trim()
          // if(file.substring(0,2) == "./") {
          //   file = oldFile.substring(0,oldFile.lastIndexOf('\\') + 1) + file.substring(2,file.length)
          // }
          // if(file.substring(0,3) == "../") {
          //   let uri = oldFile.split("\\")
          //   uri.splice(uri.length - 1)
          //   file = uri.join("/") + file.substring(3,file.length)
          // }
          dat.shift(0)
          //console.log(path.dirname(oldFile.split("/").shift()))
          files.push({name: file  + '.mcfunction', data: dat.join("\n")})
        }
      }
    } else {
      let file = oldFile.replace(".mcscript","")
      files.push({name: file  + '.mcfunction', data: data[0]})
    }
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
