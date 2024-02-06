![](https://i.imgur.com/YedWe7W.png)

# Minecraft Script 文档

> 更新 0.2.3：[所有改动](https://github.com/Stevertus/mcscript/releases)



Minecraft Script 是一种编程语言，适用于 MC 函数、地图和整合包的开发者。.mcscript 文件可以被编译并生成为函数格式。这使开发人员能够扩展可能性，例如模态，循环，变量，常量和命令包装。

查看官方网站以获取更多信息、指引和视频：https://mcscript.stevertus.com

English documentation [here](https://mcscript.stevertus.com/)

German documentation [here](https://mcscript.stevertus.com/de/)

## 目录

1. [安装](#install)
   - [Node.js 安装](#install-nodejs)
   - [Minecraft Script 安装](#install-mcscript)
1. [命令行](#cli)
   - [mcscript new](#cli-new)
   - [mcscript compile](#cli-compile)
   - [mcscript watch](#cli-watch)
   - [mcscript add](#cli-add)
1. [文件系统](#files)
   - [文件配置](#files)
   - [扩展文件](#extend)
   - [全局文件](#global)
1. [语法](#syntax)
   - [代码编组](#groups)
   - [函数](#functions)
   - [变量](#vars)
   - [布尔变量](#boolean)
   - [常量](#consts)
   - [`if/else` 语句](#if)
   - [操作符](#operators)
   - [`switch-case` 语句](#switch)
   - [`for` 循环](#for)
   - [射线投射](#raycast)
   - [while 循环](#while)
   - [do-while 循环](#dowhile)
   - [forEach 循环](#foreach)
   - [模态](#modals)
   - [JavaScript 模态](#modaljs)
   - [系统模态](#systemModals)
   - [错误处理与调试](#debugging)
1. [开发环境（IDE）和语法高亮](#ide)
   <a id="install"></a>

## 安装

编译器需要 Node.js 环境提供支持，以便安装在你的机器上。它可以比在线版提供多得多的功能。  
例如：通过一条简单的命令编译一个目录下的所有文件，直接将编译结果输出到新文件中，你可以看着你的文件发生变化。
<a id="install-nodejs"></a>

### 1.1 Node.js 安装

首先需要安装 Node.js 环境和 Node 包管理器（npm）。

最好的方法使是使用这个安装包：[nodejs.org/en/download/](https://nodejs.org/en/download/)  
只需执行它并安装即可。
<a id="install-mcscript"></a>

### 1.2 Minecraft Script 安装

现在打开你电脑的命令行（搜索 cmd）。

然后你需要输入这条命令：

> `npm install -g mcscript`

如果显示安装成功，那么你做的没错，可以开始了。
<a id="cli"></a>

## 命令行

现在只需要在数据包目录下启动命令行便可以使用本工具了。  
（在资源管理器中进入一个目录，在地址栏中输入`cmd`并回车）
现在你可以在命令行中使用下列命令了：
<a id="cli-new"></a>

### 2.1 mcscript new

创建一个新的数据包，它是一个包含所有基本文件的目录。将数据包的 ID 作为参数！
<a id="cli-compile"></a>

### 2.2 mcscript compile

此命令会将所有 .mcscript 文件编译成 .mcfunction 格式。阅读  [这里](#syntax) 你便知道在 mcscript 文件中可以做什么。  
终端里会显示所有生成的文件，如果出现错误也会显示出来。

或者也可以使用`mcscript compile *filepath*` 来设置一个自定义的目录或文件。

通过添加一个`-fullErr`参数，可以显示出完整的错误和代码位置。
<a id="cli-watch"></a>

### 2.3 mcscript watch

此命令会在你做出任何更改（保存）时自动编译。所以不需要在每次修改后都输入一次编译命令。

同样地，可以指定路径和`-fullErr`参数。
<a id="cli-add"></a>

### 2.4 mcscript add [url or package]

此命令会将一个自定义的数据包添加到当前目录。

可以将资源的 URL 或者一个 mcScript 扩展名作为参数。

直接运行命令`mcscript add`可以获取所有支持的包的列表（可能什么也没有）。

<a id="cli-modals"></a>

### 2.5 Dev: mcscript modals

！！此命令仅适用于希望在编译器中安装其 modals 的开发人员。  
必须指定一个文件，然后将此文件中的 modals 写入一个配置文件。
<a id="files"></a>

## 3) 文件系统

### 3.1 文件配置

生成的文件始终与其源文件具有相同的名称。

自定义名称可以这样设置：`#file: *name*.`  
请不要写后缀名 .mcfunction！！

除了文件名，你还可以输入新文件的整个路径：

- `#file: C:/test/new`
- `#file: ./new` (in same directory)
- `#file: ./subfolder/new`
- `#file: ../new` (a directory above)
- `#file: ../subfolder/new`

还可以指定多个文件：

    #file: new
    //commands here
    #file: two
    //Commands for two

也非常适合与 [for-循环](#loops) 组合：

    #file: new
    //commands here
    for(1,5){
    	#file: test$(i)
    	//Commands for every file here
    }

<a id="extend"></a>

### 3.2 扩展文件

一个已经通过`#file`生成的文件，可以在其他文件里扩展，很容易附加新的代码：

```
#extend: ./test
/commands here
```

<a id="global"></a>

### 3.3 全局文件

[变量](#vars)、[常量](#consts)，以及[Modals](#modals) 在每个文件中是分别存储的。
现在你可以通过后缀名 '. gl. mcscript ' 创建一个全局文件。编译器会自动探测全局文件并在其他文件里使用定义过的对象。
例如，你可以把 modals 写进一个单独的文件里。
<a id="syntax"></a>

## Minecraft Script 语法

代码应当写在后缀名为 .mcscript 的文件里。建议在一个代码编辑器（IDE）中管理这些文件并启用语法高亮 。[更多信息](#ide).

与 mcfunction 不同，每条命令使用 “/” 或 “run:” 注入。

用 “//” 声明注释，如果注释也应当在生成的文件中出现，那么使用 “#”。  
空行会被忽略。  
如果希望在生成的 mcfunction 中存在空行，那么用一个 '#' 来表示它，但不写注释。  
两个空行可以用 "##"。

多行注释可以这样表示：

```
/*
 comment
*/
```

<a id="groups"></a>

### 4.1 命令编组 / 包装

> `[subcommand]([argument]){ [wrapped actions] }`

"as, at, positioned,align,in,dimension,rotated,anchored" 可以编组到一起：

“=>” 不是代码的一部分，它相当于注释。

    as(@a){
    	/commands 	=> /execute positioned ~ ~ ~ run command
    }

括号里的变量必须是一个字符串！（用 '  ' 或 " "）
It is also possible to use `asat()` for this:

```
asat(@s){
    /commands => execute as @s at @s run commands
}
```

可以这样列出组：

    as(@p), at(@s), positioned('~ ~1 ~'){
    	/say command
    }
    ==> /execute as @p at @s positioned ~ ~-1 ~ run say command
    
    // also with if
    as(@p), at(@s), positioned('~ ~1 ~'), if(entity @s[tag=mytag]){
    	/say command
    }
    ==> /execute as @p at @s positioned ~ ~-1 ~ if entity @s[tag=mytag] run say command

<a id="functions"></a>

### 4.2 函数

```
[run] function "name|path" {
/commands
}
```

> run optional
> a path should be given as string
> a name consisting of only characters, can be given without ""

函数会根据给定的名称或路径生成新的mcfunction。你也可以用 run 关键字直接执行函数。
也可以用一个更复杂的变体 `#file` 替代。

例如：

```
run function test {
	/say function
}
/say not function
=
/function prj:test
/say not function

#file: ./test
/say function
```

<a id="vars"></a>

### 4.3 变量

想其他所有编程语言一样可以使用变量。这样初始化变量：
`var test`
可以在初始化时给变量赋值：

```
var test = 5
# or
var test
test = 6
```

随时可以修改变量的值。

```
var test
test @s = 10
```

值可以分配给特殊的 MC 目标选择器。
玩家名称和占位符也可以：

```
test player = 10
```

每个值和它的名称或选择器存储在一个独立的计分板里。所以它们可以通过常规的方法来访问：

```
var test
test @s = 10
/scoreboard players get @s test ==> 10
/scoreboard players set @s test 5
# etc
```

变量可以合并到一起：

```
var test = 10
var new = 5
test += 2 ==> 12
test -= 2 ==> 8
```

简短一点：

```
test++ ==> test += 1
test-- ==> test -= 1

test += new ==> 15
test -= new ==> 5
test *= new ==> 50
test /= new ==> 2
test %= new ==> 0
```

**将命令返回值保存为变量**

```
var res = run: command
==> execute store result score res res run command
```

该命令的返回值会写入到变量 res 中。
以`/data get`为例：

```
var varResult = run: data get entity @s Pos[0] 
```

<a id="boolean"></a>

### 4.4 布尔变量（Tag 标签）

> `bool [name] [selector](optional) = true|false`

可以这样声明布尔变量。
`bool isCool = true => tag [global] add isCool`
之后可以这样修改布尔变量：
`isCool = false => tag [global] remove isCool`

可以使用 [`If`](#if) 来测试：

```
if(isCool){
    /commands => execute if entity [global][tag=isCool] run commands
}
```

<a id="consts"></a>

### 4.5 常量

另一种类型的变量是常量，可以这样声明：
`const test = [value]`
该类型不能被修改！

可以在代码的任意位置使用`$(var_name)`来引用常量，这可以避免出现冗长的字符串和重复短语。

```
const aString = "Here can be a string"
const aNum = 5

/say $(aString)       ==> /say Here can be a string
var test = $(aNum)   ==> var test = 5
```

**常量字符串替换**
常量的值可以在使用时被修改。在常量后面添加 '.repl()' 即可：

> `$(const).repl([search],[replacement])`

在我们的示例中，我们想把 " a " 替换成 " the "：

```
/say $(aString).repl(" a "," the ") ==> /say Here can be the string
```

也可以使用[正则表达式](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/RegExp)。

Also a [RegEx](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/RegExp) can be inserted here and can be also accessed with '\$&' in the replacement:
`$(aString).repl([/regex/],["$&"])`
<a id="maps"></a>

#### 映射（字典）

映射本质上是类似与字典的键值对。使用 Map 操作符来定义映射。

```js
const testMap = Map{

}
```

在花括号中可以定义任意多的键值对。

```js
const testMap = Map{
	"key1":"value",
	"key2":"value2"
}
```

然后可以这样访问它：

```js
/say $(testMap).key1

⇒ /say value
```

<a id="arrays"></a>

#### 数组

数组和映射很想，但是使用的是值的列表，而非键值对：

```js
const testArr = Array{
	"value", // index 0
	"value2" // index 1
}
```

这些值可以使用以 0 开始的下标来访问数组的元素。

```js
/say $(testArr).0
⇒ /say value
/say $(testArr).1
⇒ /say value2
```

<a id="if"></a>

### 4.6 `If/Else` 语句

if 语句的语法类似于命令编组：

```
if('statement'){
	/commands 	=> /execute if statement run command
}
```

具有一些附加功能：

- 在每一个参数前面可以添加一个 "!" 表示逻辑非操作。

  ```
  if(!'statement'){
  	/commands 	=> /execute unless statement run command
  }
  ```

- 在 if 语句后可以附加一个 "else" 语句:

```
    if('statement'){
    	/commands 	=> /execute if statement run command
    } else {		   /execute unless statement run command2
    	/commands2
    }
```

**重要:不要这样写参数!**

```
    if('entity @s[tag=test]'){
    	/tag @s remove test
    } else {
    	/tag @s remove test
    }
```

这两条语句都会被执行！！应当这样写:

```
    if('entity @s[tag=test]'){
    	/tag @s add testIf
    }
    if('entity @s[tag=testIf]'){
    	/tag @s remove test
    } else {
    	/tag @s remove test
    }
```

- 甚至可以使用 "else if" ：

```
    if('statement'){
    	/commands 				=> /execute if statement run command
    } else if('statement2') {	   /execute unless statement if statement2 run command2
    	/commands2
    }
```

<a id="operators"></a>

### 4.7 逻辑操作符

与分组和 if-else 语句结合使用时，可以使用逻辑运算符：

- 有两种方法使用或操作符：

```
    as('@s'||'@p'){
    	/command
    }
    ==> execute as @s run command
        execute at @p run command

    # or as list
    if('entity @s[tag=entity1]','entity @s[tag=entity2]'){
    	/command
    }
    ==> execute if entity @s[tag=entity1] run command
        execute if entity @s[tag=entity2] @p run command
```

- 与操作符可以这样定义（只在 if 语句中有意义）：

```
    if('entity @s'&&'entity @p'){
    	/command
    }
    ==> execute if entity @s if entity @p run command
```

- 测试变量：

```
var test = 5

# 相等
if(test == 5){
    /commands
}

# 大于等于、小于等于
if(test >= 5){
    /commands
}

# 大于、小于
if(test > 5){
    /commands
}

# 也可以将两个变量相比较
if(test > test2){
    /commands
}

# 或者带目标选择器的变量
if(test @s > test2 @a){
    /commands
}
```

<a id="switch"></a>

### 4.8 Switch-Cases 语句

```
switch([var_name]){
    case <=|<|==|>|>= [other_var]|[number] {
        [actions]
    },
    default(optional) {
        [default actions]
    }
}
```

switch语句使得条件判断更加简单。它可以简洁明了地测试特定变量。
例如：

```
var test = 10
switch(test){
    case > 10 {
        /say var is over 10
    },
    case < 10 {
        /say var is under 10
    },
    default {
        /say no match
    }
}
```

此处检查 `test` 变量是否大于 10，如果 `test`不小于 10，则最终输出为默认命令组。
也可缩写：

```
var test = 10
switch(test){
    case > 10 run: say var is over 10
    , case < 10 run: say var is under 10
    , default run: say no match
}
```

<a id="for"></a>

### 4.9 `for`循环

for 循环是最有用的特性之一。它采用自然数。

从第一个参数到第二个参数将输出到第三个参数（可选）

```
 for(1,5){
	/commands
	# 将输出 5 次
}
```

```
 for(1,5){
	/say $(i)
	# 将输出 5 次，i 的值分别为 1,2,3,4,5
}
```

可以使用 `$(var_name)` 访问循环变量。

`var_name`变量的默认名称是 `i`，但是可以通过第三个参数来指定为其他名称。

    for(1,5,X){
    	/say $(X)
    	# say with 1 - 5 is outputed 5 times}

这使得二维循环成为可能：

    for(1,5,i){
    	for(1,2,j){
    		/say $(i).$(j)
    	}
    	# say 命令将执行 10 次：(1,1), (1,2), (2,1), (2,2), ..., (5,1), (5,2)
    }

<a id="raycast"></a>

### 4.10 Raycastingrang

```
raycast([distance](optional), [block to travel through](optional),entity | block [target](optional) ){
    [actions on hitted block or entity]
},{
    [actions for every flight step]
}
default distance = 100 Blocks
default block = air
default target = any block
```

```
raycast([距离](可选), [block to travel through](可选),实体 | 方块 [目标](可选) ){
    [在被指向的方块或实体上执行的操作]
},{
    [actions for every flight step]
}
默认距离 = 100 方块
默认方块 = air
默认目标 = 任意方块
```



Raycasting 在 Minecraft 1.13 中是一个重要特性，提供了无限可能。但是它有点难，所以为什么不让它简单一些呢？在 Minecraft Script 中它变得非常非常简单了：

```
raycast {
    /setblock ~ ~ ~ stone
}
```

这将把你注视的方块设置为stone。
粒子和方块限制也非常简单：

```
raycast(10) {
    /setblock ~ ~ ~ stone
}, {
    /particle flame ~ ~ ~
}
```

现在在 10 方块距离内可以看到漂亮的效果了
第二个参数设置的是射线可以穿过的方块（默认为 air）

```
raycast(10,"air") {
    /setblock ~ ~ ~ stone
}
```

那么射线会穿过空气方块。
你也可以使用 "!" 来反选方块，表示除了该方块以外全部穿透。

```
raycast(10,!"white_wool") {
    /setblock ~ ~ ~ stone
}
```

射线会穿过除了白色羊毛外的所有方块

可以用目标选择器来指定第三个参数：

```
raycast(10,"air",block "white_wool") {
    /setblock ~ ~ ~ stone
}
```

现在 Mcscript 便知道了目标是一个方块，并且仅当该方块是一个白色羊毛时执行命令。

```
raycast(10,"air",entity @e[type=armor_stand]) {
    /say test
}
```

现在 Mcscript 便知道目标是一个盔甲架实体
所以盔甲架将会执行 `sat test` 命令。
<a id="while"></a>

### 4.11 `while` 循环

这样定义 while 循环:

```
while([cond]){
    /commands
}
```

只要条件 [cond] 为 true，命令组就会不停地循环执行。

> 如果条件一开始就不是 true，那么命令组就根本不会执行！

作为一个条件表达式，if 语句的条件中能用的所有操作符和参数在这都可以使用。例如：

```
var test = 0
while(test < 10){
    /commands here
    test += 1
}
# ==> 这条命令会在 1 tick 内执行 10 次
```

while 循环中也可以使用 stop（相当于大部分编程语言中的 break） 和 continue。

```
var test = 0
while(test < 10){
    test += 1
    if(test == 5){
        continue
        # 如果 test 等于 5，那么跳过剩下的代码
    }
    /commands hier
    if(test >= 9){
        stop
        # 如果 test 大于等于 5，那么立即退出循环
    }
}
```

<a id="dowhile"></a>

### 4.12 do-while 循环

```
do {
    /commands
} while([cond])
```

do-while 循环的工作方式和 while 循环很相似，唯一的区别是它首先执行命令组，再进行条件判断。
所以循环体至少会执行 1 次。

<a id="foreach"></a>

### 4.13 forEach 循环

```
forEach(var [var_name] = [start value]; [var_name] ==|>|<|<=|>=|!= [other_var]|[number]; [varname]++){
    /commands
}
```

forEach 循环在几乎存在于所有编程语言中。
它类似于 Minecraft Script 中的 for 循环, 但它会动态运行。（它不在编译时直接生成，而是在 Minecraft 中运行）

例如：

```
forEach(var i = 0; i < 10; i++){
    /say hey
}
```

这个命令会执行10次，当前的值会保存在计分板的i中。
你也可以这样访问该值：

```
var result = 1
forEach(var i = 2; i <= 10; i++){
    result *= i
}
==> result = 1 * 2 * 3 * 4 * 5 * 6 * 7 * 8 * 9 * 10
```

<a id="modals"></a>

### 4.14 模态

模态类似于函数或方法，这意味着你可以这样定义它：

> ```
> modal [name]([arguments]){
> [actions]
> }
> ```

定义模态时在关键字`modal`后跟着模态的名称和圆括号中的参数。

在命令组中可以通过`$(argument_name)`访问参数。

    modal newModal(argument){
    	/say $(argument)
    }
    
    newModal('test')
    
    # => say test

如果你这样使用模态，模态将会使用这个值，并打印出来。

    modal createCommand(command,argument1,argument2){
    	/$(command) $(argument1) $(argument2)
    }
    
    createCommand('say', 'hallo', 'du')
    
    # => say hallo du

你也可以使用多个参数。

也存在可选的预定义参数（为参数指定默认值）：

    modal say(argument = "hallo"){
    	/say $(argument)
    }
    
    say()
    # => say hallo
    
    say('test')
    # => say test

**使用映射和数组**
你也可以在模态中使用使用 [映射](#maps) 和 [数组](#arrays) 类型的常量：

```js
modal defaultMap(args = Map{"key":"value"}){
    /say $(args).key
}
defaultMap()
defaultMap(Map{
    "key":"value2"
})

⇒ /say value
⇒ /say value2
```

**覆写模态**
在执行过程中，已经定义过的模态可以被覆写：

> ```
> override modal [name]([arguments]){
> [actions]
> }
> ```

参数和行为（命令组）将被彻底替换 and used for the ongoing process。

**替换参数**
参数可以在使用时被修改，在参数后加上 '.repl()' 即可：

> `$(argument).repl([search],[replacement])`

在我们的示例中，我们希望替换 'test' 为 'no test'：

```
/say $(argument).repl("test","no test") ==> /say no test
```

在这同样可以使用 [正则表达式](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/RegExp) ，并且在替换字符串中使用 '\$&'：
`$(argument).repl([/regex/],["$&"])`
<a id="modaljs"></a>

### 4.15 JavaScript 模态

JavaScript 模态 也是模态，你可以在其中使用 JavaScript 语言。可以像其他模态那样定义它：

> ```
> modaljs [name]([arguments]){
> [actions]
> return [Text]
> }
> ```

JavaScript 模态 必须以 return 语句结束。返回值将作为纯文本在 `.mcfunction` 文件中返回。

    modaljs newModal(){
    	return "say hi";
    }
    
    newModal()
    
    # => say hi

对于多行输出，我建议这么做：

    modaljs newModal(){
    	var ret = "";
    
    	ret += "say hi\n";
    	ret += "say ho\n";
    
    	return ret;
    }
    
    newModal()
    
    # => say hi
    # => say ho

提示：你需要使用`\n`作为换行。

JavaScript 模态时在关键字`modaljs`后跟着模态的名称和圆括号中的参数。

可以直接通过参数名来访问参数：

    modaljs newModal(argument){
    	return "say " + argument;
    }
    
    newModal('test')
    
    # => say test

也可以使用多个参数：

    modaljs newModal(text,monster){
    	var ret = "";
    
    	ret += "say " + text + "\n";
    	ret += "summon " + monster + "\n";
    
    	return ret;
    }
    
    newModal("Brains!!!","minecraft:zombie")
    
    # => say Brains!!!
    # => summon minecraft:zombie

同样可以使用预定义参数（可选）：

    modaljs say(argument = "hallo"){
    	return "say " + argument ;
    }
    
    say()
    # => say hallo
    
    say('test')
    # => say test

**提示和技巧**

可以使用 `console.log()`  在编译时将信息输出到命令行，这不影响返回值。

<a id="systemModals"></a>

### 4.16 系统模态

已经有一些有用的预定义模态了 请在 [这里](https://github.com/Stevertus/mcscript/blob/master/Core%20Modals.md) 阅读具体文档。

如果你认为哪个模态应当成为标准，请将你的 [配置文件](#ownmodal) 发给我确认。
<a id="debugging"></a>

### 4.17 错误处理与调试

Minecraft Script 自从 0.2 版本开始便在发生错误时仅显示行号和文件。
请在编译时使用`-fullErr` 以获取完整的错误回馈。

如果你发现上下文中不应出现的错误，且问题可能出自编译器本身，那么请通知团队。

**调试关键字**
你可以使用 "Debug" 关键字来轻松地调试代码并找到 MCScript 中的错误。你可以将它放在代码的任意位置，它们不会影响编译输出。

- `debug message: [message]`
  发送一条简单的消息，附带行号和文件引用。

- `debug success: [message]`

  Sends a successful message in green with line and file references.发送一条表示成功的消息，它将显示为绿色并附带行号和文件引用。

- `debug break: [message]`
  你的程序在此处中断，并且会发送以上消息。

- `debug error: [message]`
  程序将在此处中断，并发送包含系统信息和相关代码位置的严重错误。

<a id="ide"></a>

## 开发环境（IDE）和语法高亮

- Visual Studio Code:
  [Stevertus.mcscript](https://marketplace.visualstudio.com/items?itemName=Stevertus.mcscript)

- GitHubs Atom Editor:
  [mcscript](https://atom.io/packages/mcscript) (credit: [Trojaner](https://github.com/TrojanerHD))

- Notepad++:
  [code](https://github.com/Stevertus/mcscript/blob/master/Nodepad%2B%2B%20Highlighter.xml) | [download](http://download1496.mediafire.com/x2k7loq5imbg/4534q4tual7zccm/Nodepad+++Highlighter.xml)

## 现在只剩下：**祝你开发快乐**

感谢所有使用Minecraft Script 并阅读本文档的人。如果你由任何建议、问题或发现任何错误，请联系我。
