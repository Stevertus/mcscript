(window.webpackJsonp=window.webpackJsonp||[]).push([[30],{320:function(e,n,t){"use strict";t.r(n);var a=t(17),s=Object(a.a)({},(function(){var e=this,n=e._self._c;return n("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[n("h1",{attrs:{id:"_4-minecraft-script-syntax"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_4-minecraft-script-syntax"}},[e._v("#")]),e._v(" 4) Minecraft Script Syntax")]),e._v(" "),n("p",[e._v("Der Code wird in Dateien mit der Endung .mcscript geschrieben. Es wird ein Code-Editor(IDE) empfohlen, um die Dateien zu verwalten und den Syntax farbig zu markieren. "),n("a",{attrs:{href:"/de/ides"}},[e._v("Mehr hier")])]),e._v(" "),n("p",[e._v('Anders als bei mcfunction wird jeder Command mit einem "/" oder "run: " injektiert.')]),e._v(" "),n("p",[e._v('Kommentare werden mit "//" angekündigt, falls Kommentare auch in der neuen Datei auftauchen sollen mit "#"\nEin Kommentar über mehrere Zeilen muss mit')]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("*/\nangegeben werden\n/*\n")])])]),n("p",[e._v("Leerzeilen und Zeilensprünge werden nicht beachtet."),n("br"),e._v("\nFalls eine Leerzeile aus Struktur in der mcfunction gewünscht ist,drücke dies mit einem # ohne Kommentar aus."),n("br"),e._v('\nZwei Leerzeilen können mit "##" erreicht werden.')]),e._v(" "),n("h2",{attrs:{id:"_4-1-command-gruppen-wrapping"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_4-1-command-gruppen-wrapping"}},[e._v("#")]),e._v(" 4.1 Command Gruppen / Wrapping")]),e._v(" "),n("blockquote",[n("p",[n("code",[e._v("[subcommand]([argument]){ [wrapped actions] }")])])]),e._v(" "),n("p",[e._v('"as, at, positioned,align,dimension,rotated,anchored" können zusammengefasst werden:')]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",[n("code",[e._v("as(@a){\t \n\t/commands \t=> /execute positioned ~ ~ ~ run command\n}\t\t \n")])])]),n("p",[e._v("In den Klammern muss das jeweilige Argument als String, sprich \" \" oder ' ' stehen!\nAuch ist der eigende "),n("code",[e._v("asat()")]),e._v(" möglich")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("asat(@s){\n    /commands => execute as @s at @s run commands\n}\n")])])]),n("p",[e._v('"Gruppen können auch aufgelistet werden:')]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",[n("code",[e._v("as(@p), at(@s), positioned('~ ~1 ~'){\n\t/say command\n}\n==> /execute as @p at @s positioned ~ ~-1 ~ run say command\n\n// also with if\nas(@p), at(@s), positioned('~ ~1 ~'), if(@s[tag=mytag]){\n\t/say command\n}\n==> /execute as @p at @s positioned ~ ~-1 ~ if entity @s[tag=mytag] run say command\n")])])]),n("h2",{attrs:{id:"_4-2-funktionen"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_4-2-funktionen"}},[e._v("#")]),e._v(" 4.2 Funktionen")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v('[run] function "name|path" {\n   /commands\n}\n')])])]),n("blockquote",[n("p",[e._v('run optional\nein Pfad sollte als String angegeben werden\nein nur aus Buchstaben bestehender name auch ohne ""')])]),e._v(" "),n("p",[e._v("Eine Funktion generiert eine weitere mcfunction mit den angegebenen Namen oder Pfad. Mit dem run keyword kann eine Funktion auch direkt ausgeführt werden.\nDies ist eine alternative zu einer wesentlich komplizierteren Variante mit "),n("code",[e._v("#file:")]),e._v(".\nBsp:")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("run function test {\n\t/say function\n}\n/say not function\n=\n/function prj:test\n/say not function\n\nfile: ./test\n/say function\n")])])]),n("h2",{attrs:{id:"_4-3-variablen"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_4-3-variablen"}},[e._v("#")]),e._v(" 4.3 Variablen")]),e._v(" "),n("p",[e._v("Wie jede Programmiersprache hat auch Minecraft Script Variablen. Sie müssen wiefolgt initialisiert werden:\n"),n("code",[e._v("var test")]),e._v("\nDer Variablen kann ein Wert hinzugewiesen werden:")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("var test = 5\n oder\nvar test\ntest = 6\n")])])]),n("p",[e._v("Dieser Wert kann beliebig oft wieder verändert werden.")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("var test\ntest @s = 10\n")])])]),n("p",[e._v("So können Werte auch nur speziellen Minecraft Selektoren zugewiesen werden.\nAuch mit Spielernamen oder Placeholdern möglich:")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("test Spielername = 10\n")])])]),n("p",[e._v("Alle Werte werden in einem scoreboard mit dem Variablennamen gespeichert. Also können die Werte auch ganz standart mäßig verändert und ausgelesen werden:")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("var test\ntest @s = 10\n/scoreboard players get @s test ==> 10\n/scoreboard players set @s test 5\n etc\n")])])]),n("p",[e._v("Variablen können auch mit anderen zusammen gerechnet und zusammengefügt werden:")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("var test = 10\nvar neu = 5\n Achtung: Der Einfachkeit halber starte ich immer wieder mit diesen Werten. Das Programm macht es nartürlich anders!\n\ntest += 2 ==> 12\ntest -= 2 ==> 8\n")])])]),n("p",[e._v("Etwas gekürzt:")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("test++ ==> test += 1\ntest-- ==> test -= 1\n\ntest += neu ==> 15\ntest -= neu ==> 5\ntest *= neu ==> 50\ntest /= neu ==> 2\ntest %= neu ==> 0\n")])])]),n("p",[n("strong",[e._v("Command Response in Variable speichern:")])]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("var res = run: command\n==> execute store result score res res run command\n")])])]),n("p",[e._v("Das Ergebnis des command wird in die Variable res geschrieben.\nBeispiel mit /data get:\n"),n("code",[e._v("var varResult = run: data get entity @s Pos[0]")])]),e._v(" "),n("h2",{attrs:{id:"_4-4-boolean-variablen-tags"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_4-4-boolean-variablen-tags"}},[e._v("#")]),e._v(" 4.4 Boolean Variablen (Tags)")]),e._v(" "),n("blockquote",[n("p",[n("code",[e._v("bool [name] [selector](optional) = true|false")])])]),e._v(" "),n("p",[e._v("So können Wahrheitswerte deklariert werden.\n"),n("code",[e._v("bool isCool = true => tag [global] add isCool")]),e._v("\nEine Boolean Variable kann später noch verändert werden:\n"),n("code",[e._v("isCool = false => tag [global] remove isCool")])]),e._v(" "),n("p",[e._v("Mit "),n("a",{attrs:{href:"#if"}},[e._v("If")]),e._v(" testbar:")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("if(isCool){\n    /commands => execute if entity [global][tag=isCool] run commands\n}\n")])])]),n("h2",{attrs:{id:"_4-5-konstanten"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_4-5-konstanten"}},[e._v("#")]),e._v(" 4.5 Konstanten")]),e._v(" "),n("p",[e._v("Eine andere Art Variable ist die Konstante, so deklariert:")]),e._v(" "),n("blockquote",[n("p",[n("code",[e._v("const [name] = [value]")])])]),e._v(" "),n("p",[e._v("Diese Art kann nicht verändert werden!\nDu kannst sie mit "),n("code",[e._v("$(var_name)")]),e._v(" irgendwo in deinem Code benutzen um lange Strings und wiederholende Phrasen zu vermeiden:")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v('const einString = "Hier könnte sehr viel Schrott stehen."\nconst eineNum = 5\n\n/say $(einString)       ==> /say Hier könnte sehr viel Schrott stehen.\nvar test = $(eineNum)   ==> var test = 5\n')])])]),n("p",[n("strong",[e._v("Replace Konstanten")]),e._v("\nDer Wert einer Konstante kann bei der Verwendung noch umgeändert werden. Hierzu ein "),n("code",[e._v(".repl()")]),e._v(" an die Verwendung anfügen:")]),e._v(" "),n("blockquote",[n("p",[n("code",[e._v("$(const).repl([suchwert],[replacement])")])])]),e._v(" "),n("p",[e._v("Bei unserem Beispiel wollen wir das viel replacen:")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v('/say $(einString).repl("viel","sehr viel") ==> /say Hier könnte sehr sehr viel Schrott stehen.\n')])])]),n("p",[e._v("Auch kann hier ein "),n("a",{attrs:{href:"https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/RegExp",target:"_blank",rel:"noopener noreferrer"}},[e._v("RegEx"),n("OutboundLink")],1),e._v(" eingefügt werden und auch auf diesen im Replacement zugegriffen werden:\n"),n("code",[e._v('$(const).repl([/regex/],["$&"])')])]),e._v(" "),n("h3",{attrs:{id:"maps"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#maps"}},[e._v("#")]),e._v(" Maps")]),e._v(" "),n("p",[e._v("Maps sind schlüssel-wert Paare ähnlich wie bei einem Wörterbuch. Wir definieren eine Map mit dem Map-Operator:")]),e._v(" "),n("div",{staticClass:"language-js extra-class"},[n("pre",{pre:!0,attrs:{class:"language-js"}},[n("code",[n("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("const")]),e._v(" testMap "),n("span",{pre:!0,attrs:{class:"token operator"}},[e._v("=")]),e._v(" Map"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("{")]),e._v("\n\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("}")]),e._v("\n")])])]),n("p",[e._v("In den Klammern kannst du so viele Paare angeben, wie du magst:")]),e._v(" "),n("div",{staticClass:"language-js extra-class"},[n("pre",{pre:!0,attrs:{class:"language-js"}},[n("code",[n("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("const")]),e._v(" testMap "),n("span",{pre:!0,attrs:{class:"token operator"}},[e._v("=")]),e._v(" Map"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("{")]),e._v("\n\t"),n("span",{pre:!0,attrs:{class:"token string-property property"}},[e._v('"key1"')]),n("span",{pre:!0,attrs:{class:"token operator"}},[e._v(":")]),n("span",{pre:!0,attrs:{class:"token string"}},[e._v('"value"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v("\n\t"),n("span",{pre:!0,attrs:{class:"token string-property property"}},[e._v('"key2"')]),n("span",{pre:!0,attrs:{class:"token operator"}},[e._v(":")]),n("span",{pre:!0,attrs:{class:"token string"}},[e._v('"value2"')]),e._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("}")]),e._v("\n")])])]),n("p",[e._v("Wir können dann auf die Werte so zugreifen:")]),e._v(" "),n("div",{staticClass:"language-js extra-class"},[n("pre",{pre:!0,attrs:{class:"language-js"}},[n("code",[n("span",{pre:!0,attrs:{class:"token operator"}},[e._v("/")]),e._v("say "),n("span",{pre:!0,attrs:{class:"token function"}},[e._v("$")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),e._v("testMap"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(".")]),e._v("key1\n\n⇒ "),n("span",{pre:!0,attrs:{class:"token operator"}},[e._v("/")]),e._v("say value\n")])])]),n("h3",{attrs:{id:"arrays"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#arrays"}},[e._v("#")]),e._v(" Arrays")]),e._v(" "),n("p",[e._v("Arrays sind ziemlich ähnlich zu Maps, nur dass wir nicht Paare sondern eine einfache Liste an Werten haben.")]),e._v(" "),n("div",{staticClass:"language-js extra-class"},[n("pre",{pre:!0,attrs:{class:"language-js"}},[n("code",[n("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("const")]),e._v(" testArr "),n("span",{pre:!0,attrs:{class:"token operator"}},[e._v("=")]),e._v(" Array"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("{")]),e._v("\n\t"),n("span",{pre:!0,attrs:{class:"token string"}},[e._v('"value"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[e._v("// index 0")]),e._v("\n\t"),n("span",{pre:!0,attrs:{class:"token string"}},[e._v('"value2"')]),e._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[e._v("// index 1")]),e._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("}")]),e._v("\n")])])]),n("p",[e._v("Die Werte können mit dem Index des Elements abgerufen werden:")]),e._v(" "),n("div",{staticClass:"language-js extra-class"},[n("pre",{pre:!0,attrs:{class:"language-js"}},[n("code",[n("span",{pre:!0,attrs:{class:"token operator"}},[e._v("/")]),e._v("say "),n("span",{pre:!0,attrs:{class:"token function"}},[e._v("$")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),e._v("testArr"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),n("span",{pre:!0,attrs:{class:"token number"}},[e._v(".0")]),e._v("\n⇒ "),n("span",{pre:!0,attrs:{class:"token operator"}},[e._v("/")]),e._v("say value\n"),n("span",{pre:!0,attrs:{class:"token operator"}},[e._v("/")]),e._v("say "),n("span",{pre:!0,attrs:{class:"token function"}},[e._v("$")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),e._v("testArr"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),n("span",{pre:!0,attrs:{class:"token number"}},[e._v(".1")]),e._v("\n⇒ "),n("span",{pre:!0,attrs:{class:"token operator"}},[e._v("/")]),e._v("say value2\n")])])]),n("h2",{attrs:{id:"_4-6-if-else-statements"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_4-6-if-else-statements"}},[e._v("#")]),e._v(" 4.6 If/Else Statements")]),e._v(" "),n("p",[e._v("If funktioniert ähnlich wie das Command Wrapping:")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",[n("code",[e._v("if('statement'){\n\t/commands \t=> /execute if statement run command\n}\t\t \n")])])]),n("p",[e._v("Mit einigen extra Features:")]),e._v(" "),n("ul",[n("li",[n("p",[e._v('Vor dem Argument kann ein "!" eingefügt werden um dies umzukehren:')]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",[n("code",[e._v("if(!'statement'){\n\t/commands \t=> /execute unless statement run command\n}\t\t \n")])])])]),e._v(" "),n("li",[n("p",[e._v('Nach dem Schluss kann ein "else" angehängt werden:')])])]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("    if('statement'){\n    \t/commands \t=> /execute if statement run command\n    } else {\t\t   /execute unless statement run command2\n    \t/commands2\n    }\n")])])]),n("p",[e._v("Hier darauf achten das Argument nicht zu verändern!")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("    if(@s[tag=test]){\n    \t/tag @s remove test \t\n    \t} else {\t\t  \t\t\n    \t/tag @s remove test\t\t\n    }\n")])])]),n("p",[e._v("Hier werden beide ausgeführt!! Verbessert:")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("    if(@s[tag=test]){\n    \t/tag @s add testIf\n    }\n    if(@s[tag=testIf]){\n    \t/tag @s remove test \t\n    \t} else {\t\t  \t\t\n    \t/tag @s remove test\t\t\n    }\n")])])]),n("ul",[n("li",[e._v('auch "else if" ist möglich:')])]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("    if('statement'){\n    \t/commands \t\t\t\t=> /execute if statement run command\n    } else if('statement2') {\t   /execute unless statement if statement2 run command2\n    \t/commands2\n    }\n")])])]),n("h2",{attrs:{id:"_4-7-logische-operatoren"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_4-7-logische-operatoren"}},[e._v("#")]),e._v(" 4.7 Logische Operatoren")]),e._v(" "),n("p",[e._v("In Kombination mit Command Gruppen und If-Else-Statements können zusätzlich logische Operatoren benutzt werden:")]),e._v(" "),n("ul",[n("li",[e._v("Der Oder-Operator kann bei den Gruppierungen auf zwei Arten benutzt werden:")])]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("    as(@s||@p){\n    \t/command \t\n    }\n    ==> execute as @s run command\n        execute at @p run command\n\n    # oder als Liste\n    if(@s[tag=entity1],'entity @s[tag=entity2]'){\n    # hier gehen beide Varianten ^\n    \t/command \t\n    }\n    ==> execute if entity @s[tag=entity1] run command\n        execute if entity @s[tag=entity2] @p run command\n")])])]),n("ul",[n("li",[e._v("Der Und-Operator wird so definiert: (nur für if-statements sinnvoll)")])]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("    if('entity @s'&&'entity @p'){\n    \t/command \t\n    }\n    ==> execute if entity @s if entity @p run command\n")])])]),n("ul",[n("li",[e._v("Überprüfung von Variablen:")])]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("var test = 5\n\n genau gleich\nif(test == 5){\n    /commands\n}\n\n größer/kleiner gleich\nif(test >= 5){\n    /commands\n}\n\n größer/kleiner\nif(test > 5){\n    /commands\n}\n\n auch im Vergleich möglich\nif(test > test2){\n    /commands\n}\n\n oder mit entity variablen\nif(test @s > test2 @a){\n    /commands\n}\n")])])]),n("h2",{attrs:{id:"_4-8-switch-cases"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_4-8-switch-cases"}},[e._v("#")]),e._v(" 4.8 Switch-Cases")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("switch([var_name]){\n    case <=|<|==|>|>= [other_var]|[number] {\n        [actions]\n    },\n    default(optional) {\n        [default actions]\n    }\n}\n")])])]),n("p",[e._v("Switches erleichtern dem Benutzer die vielen If-Bedingungen. Es kann einfach und übersichtlich auf verschiedene Werte von Variablen getestet werden.\nbsp:")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("var test = 10\nswitch(test){\n    case > 10 {\n        /say var ist über 10\n    },\n    case < 10 {\n        /say var ist unter 10\n    },\n    default {\n        /say nichts traf zu.\n    }\n}\n")])])]),n("p",[e._v("Hier wird also test geprüft auf über 10, wenn das nicht zutrifft auf unter 10 und als standart default ausgegeben.\nAuch abkürzbar:")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("var test = 10\nswitch(test){\n    case > 10 run: say var ist über 10\n    , case < 10 run: say var ist unter 10\n    , default run: say nichts traf zu.\n}\n")])])]),n("h2",{attrs:{id:"_4-9-for-loops"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_4-9-for-loops"}},[e._v("#")]),e._v(" 4.9 For-Loops")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("for([from],[to],[var_name](optional)){\n    [actions]\n}\n")])])]),n("p",[e._v("Einer der hilfreichsten Features ist der For-Loop. Als Argumente werden ganze Zahlen angenommen.")]),e._v(" "),n("p",[e._v("Von "),n("code",[e._v("erstes Argument")]),e._v(" bis "),n("code",[e._v("zweites Argument")]),e._v(" wird optional ausgegeben als "),n("code",[e._v("drittes Argument")])]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("for(1,5){\n\t/commands\n\t# es wird 5x command ausgegeben\n}\n")])])]),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("for(1,5){\n\t/say $(i)\n\t# es wird 5x say mit 1 - 5 ausgegeben\n}\n")])])]),n("p",[e._v("Mit $(var_name) kann auf den Loopwert zugegriffen werden.")]),e._v(" "),n("p",[e._v('var_name ist normalerweise als "i" definiert, kann aber im 3.Argument geändert werden:')]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",[n("code",[e._v("for(1,5,X){\n\t/say $(X)\n\t# es wird 5x say mit 1 - 5 ausgegeben\n}\t \t\t\t\t\t\n")])])]),n("p",[e._v("Das ist bei 2 dimensionalen Loops sinnvoll:")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",[n("code",[e._v("for(1,5,i){\n\tfor(1,2,j){\n\t\t/say $(i).$(j)\n\t}\n\t# es wird 10x say mit 1.1 - 5.2 ausgegeben\n}\n")])])]),n("h2",{attrs:{id:"_4-10-raycasting"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_4-10-raycasting"}},[e._v("#")]),e._v(" 4.10 Raycasting")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("raycast([distance](optional), [block to travel through](optional),entity | block [target](optional) ){\n    [actions on hitted block or entity]\n},{\n    [actions for every flight step]\n}\ndefault distance = 100 Blocks\ndefault block = air\ndefault target = any block\n")])])]),n("p",[e._v("Raycasting ist eine große Sache in Minecraft 1.13 und bietet viele Möglichkeiten.\nEs ist allerdings bisschen schwierig, also warum nicht leichter machen?\nMit Minecraft Script ist das nun sehr sehr einfach:")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("raycast {\n    /setblock ~ ~ ~ stone\n}\n")])])]),n("p",[e._v("Das alleine setzt überall, wo man hinschaut einen Steinblock.\nPartikel und Blockbegrenzung auch noch sehr einfach:")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("raycast(10) {\n    /setblock ~ ~ ~ stone\n}, {\n    /particle flame ~ ~ ~\n}\n")])])]),n("p",[e._v("Jetzt haben wir schöne Effekte und eine maximale Range von 10 Blöcken.\nDas zweite optinale Argument gibt die durchlässigen Blöcke an.")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v('raycast(10,"air") {\n    /setblock ~ ~ ~ stone\n}\n')])])]),n("p",[e._v('Das Raycasting geht also nur durch Luft.\nAuch kann man die durchlässigen Blöcke negieren und mit einem "!" angeben, welche Blöcke nicht durchlässig sind:')]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v('raycast(10,!"white_wool") {\n    /setblock ~ ~ ~ stone\n}\n')])])]),n("p",[e._v("Das Raycasting geht also durch alle Blöcke außer weiße Wolle.")]),e._v(" "),n("p",[e._v("Als drittes optionales Argument kann man ein Ziel angeben:")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v('raycast(10,"air",block "white_wool") {\n    /setblock ~ ~ ~ stone\n}\n')])])]),n("p",[e._v("Jetzt weiß Mcscript, dass das Ziel ein Block ist und führt den Command nur aus, wenn der Block weiße Wolle ist.")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v('raycast(10,"air",entity @e[type=armor_stand]) {\n    /say test\n}\n')])])]),n("p",[e._v("Mcscript weiß nun, dass das Ziel eine Entity ist und führt den Command als diese aus, wenn sie getroffen wurde.\nAlso würde der Armor Stand test sagen.")]),e._v(" "),n("h2",{attrs:{id:"_4-11-while-loops"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_4-11-while-loops"}},[e._v("#")]),e._v(" 4.11 while-Loops")]),e._v(" "),n("p",[e._v("Der while-Loop ist so zu definieren:")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("while([cond]){\n    /commands\n}\n")])])]),n("p",[e._v("Die gruppierten Commands werden solange ausgeführt, wie die Bedingung[cond] war ist.")]),e._v(" "),n("blockquote",[n("p",[e._v("Wenn die Bedingung zum Start nicht wahr ist, wird die Gruppierung nicht ausgeführt!")])]),e._v(" "),n("p",[e._v("Als Bedingung können hier alle Operatoren und Argumente der If-Bedingungen verwendet werden. z.B.")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("var test = 0\nwhile(test < 10){\n    /commands hier\n    test += 1\n}\n ==> Die Commands werden innerhalb eines Ticks 10mal ausgeführt.\n")])])]),n("p",[e._v("Bei while-Loops kann auch mit stop und continue gearbeitet werden:")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("var test = 0\nwhile(test < 10){\n    test += 1\n    if(test == 5){\n        continue\n        # Wenn test 5 ist werden die restlichen Commands übersprungen\n    }\n    /commands hier\n    if(test >= 9){\n        stop\n        # Wenn test 9 oder über 9 ist wird die Schleife abgebrochen\n    }\n}\n")])])]),n("h2",{attrs:{id:"_4-12-do-while-loops"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_4-12-do-while-loops"}},[e._v("#")]),e._v(" 4.12 do-while-Loops")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("do {\n    /commands\n} while([cond])\n")])])]),n("p",[e._v("Der do-while-Loop funktioniert ähnlich, wie der while-Loop mit dem kleinen Unterschied, dass der Codeblock ausgeführt wird und danach erst die Bedingung geprüft wird.\nDer Loop wird also mindestens einmal durchlaufen.")]),e._v(" "),n("h2",{attrs:{id:"_4-13-foreach-loop"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_4-13-foreach-loop"}},[e._v("#")]),e._v(" 4.13 forEach-Loop")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("forEach(var [var_name] = [startwert]; [var_name] ==|>|<|<=|>=|!= [other_var]|[number]; [varname]++){\n    /commands\n}\n")])])]),n("p",[e._v("Der forEach-Loop ist ein Loop, wie man ihn in fast jeder Programmiersprache vorfindet.\nEr ähnelt sich zu dem for-Loop von Minecraft Script, funktioniert aber dynamisch(d.h wird nicht beim generieren ausgeführt, sondern von Minecraft)")]),e._v(" "),n("p",[e._v("Bsp:")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("forEach(var i = 0; i < 10; i++){\n    /say hey\n}\n")])])]),n("p",[e._v("Der Command wird also 10mal ausgeführt und der aktuelle Wert jeweils in dem scoreboard i gespeichert.\nSo kann man auch auf den Wert zugreifen. Bsp. Fakultät:")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("var result = 1\nforEach(var i = 2; i <= 10; i++){\n    result *= i\n}\n==> result = 1 * 2 * 3 * 4 * 5 * 6 * 7 * 8 * 9 * 10\n")])])]),n("h2",{attrs:{id:"_4-14-modals"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_4-14-modals"}},[e._v("#")]),e._v(" 4.14 Modals")]),e._v(" "),n("blockquote",[n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("modal [name]([arguments]){\n   [actions]\n}\n")])])])]),e._v(" "),n("p",[e._v("Modals kann man wie functions oder Methoden verstehen, dass heißt man kann sie definieren:")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",[n("code",[e._v("modal newModal(argument){\n\t/say $(argument)\n}\t \t\t\t\t\t\n")])])]),n("p",[e._v("Ein Modal wird immer mit dem Keyword eingeleitet, gefolgt von dem Namen und in Klammern alle benötigten Argumente.")]),e._v(" "),n("p",[e._v("Auf diese Argumente kann dann innerhalb mit $(argument_name) Referenz genommen werden.")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",[n("code",[e._v("modal newModal(argument){\n\t/say $(argument)\n}\n\nnewModal('test')\n\n# => say test\t \t\t\t\t\t\n")])])]),n("p",[e._v("Wenn man das Modal so benutzt, dann werden die Werte eingesetzt und alles ausgegeben.")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",[n("code",[e._v("modal createCommand(command,argument1,argument2){\n\t/$(command) $(argument1) $(argument2)\n}\n\ncreateCommand('say', 'hallo', 'du')\n\n# => say hallo du \t\t\t\t\t\n")])])]),n("p",[e._v("Es können so auch mehrere Argumente benutzt werden.")]),e._v(" "),n("p",[e._v("Auch sind optionale und vordefinierte Argumente verfügbar:")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",[n("code",[e._v("modal say(argument = \"hallo\"){\n\t/say $(argument)\n}\n\nsay()\n# => say hallo\n\nsay('test')\n# => say test\t\t\t\t\n")])])]),n("p",[n("strong",[e._v("Maps und Arrays benutzen")]),e._v("\nDu kannst auch die "),n("a",{attrs:{href:"#maps"}},[e._v("Map")]),e._v(" und"),n("a",{attrs:{href:"#arrays"}},[e._v("Array")]),e._v(" typen der Konstanten in Modals benutzen:")]),e._v(" "),n("div",{staticClass:"language-js extra-class"},[n("pre",{pre:!0,attrs:{class:"language-js"}},[n("code",[e._v("modal "),n("span",{pre:!0,attrs:{class:"token function"}},[e._v("defaultMap")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),e._v("args "),n("span",{pre:!0,attrs:{class:"token operator"}},[e._v("=")]),e._v(" Map"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("{")]),n("span",{pre:!0,attrs:{class:"token string-property property"}},[e._v('"key"')]),n("span",{pre:!0,attrs:{class:"token operator"}},[e._v(":")]),n("span",{pre:!0,attrs:{class:"token string"}},[e._v('"value"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("{")]),e._v("\n    "),n("span",{pre:!0,attrs:{class:"token operator"}},[e._v("/")]),e._v("say "),n("span",{pre:!0,attrs:{class:"token function"}},[e._v("$")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),e._v("args"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(".")]),e._v("key\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("}")]),e._v("\n"),n("span",{pre:!0,attrs:{class:"token function"}},[e._v("defaultMap")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),e._v("\n"),n("span",{pre:!0,attrs:{class:"token function"}},[e._v("defaultMap")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),e._v("Map"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("{")]),e._v("\n    "),n("span",{pre:!0,attrs:{class:"token string-property property"}},[e._v('"key"')]),n("span",{pre:!0,attrs:{class:"token operator"}},[e._v(":")]),n("span",{pre:!0,attrs:{class:"token string"}},[e._v('"value2"')]),e._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),e._v("\n\n⇒ "),n("span",{pre:!0,attrs:{class:"token operator"}},[e._v("/")]),e._v("say value\n⇒ "),n("span",{pre:!0,attrs:{class:"token operator"}},[e._v("/")]),e._v("say value2\n")])])]),n("p",[n("strong",[e._v("Modals überschreiben")]),e._v("\nBereits erstellte modals können innerhalb des Prozesses überschrieben werden:")]),e._v(" "),n("blockquote",[n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("override modal [name]([arguments]){\n   [actions]\n}\n")])])])]),e._v(" "),n("p",[e._v("Dabei werden Argumente und Actions komplett getauscht und für den fortlaufenden Prozess verwendet.")]),e._v(" "),n("p",[n("strong",[e._v("Argumente ersetzen")]),e._v("\nDer Wert eines Arguments kann bei der Verwendung noch umgeändert werden. Hierzu ein "),n("code",[e._v(".repl()")]),e._v(" an die Verwendung anfügen:")]),e._v(" "),n("blockquote",[n("p",[n("code",[e._v("$(argument).repl([suchwert],[replacement])")])])]),e._v(" "),n("p",[e._v("Bei unserem Beispiel wollen wir ein eingegebenes test replacen:")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v('/say $(argument).repl("test","no test") ==> /say no test\n')])])]),n("p",[e._v("Auch kann hier ein "),n("a",{attrs:{href:"https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/RegExp",target:"_blank",rel:"noopener noreferrer"}},[e._v("RegEx"),n("OutboundLink")],1),e._v(" eingefügt werden und auch auf diesen im Replacement mit "),n("code",[e._v("$&")]),e._v(" zugegriffen werden:\n"),n("code",[e._v('$(argument).repl([/regex/],["$&"])')])]),e._v(" "),n("h2",{attrs:{id:"_4-15-javascript-modals"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_4-15-javascript-modals"}},[e._v("#")]),e._v(" 4.15 JavaScript Modals")]),e._v(" "),n("p",[e._v("JavaScript Modals sind modals, die in Javascript geschrieben sind. Du kannst sie, wie andere modals auch, so definieren:")]),e._v(" "),n("blockquote",[n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("modaljs [name]([argumente]){\n    [aktionen]\n    return [Text]\n}\n")])])])]),e._v(" "),n("p",[e._v("Das JavaScript Modal muss mit einem return statement enden. Das, was zurückgegeben wurde, wird in der "),n("code",[e._v(".mcfunction")]),e._v(" Datei als einfacher Text erscheinen.")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",[n("code",[e._v('modaljs newModal(){\n\treturn "say hi";\n}\n\nnewModal()\n\n# => say hi\n')])])]),n("p",[e._v("Für Absätze empfehle ich etwas ähnliches zu dem:")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",[n("code",[e._v('modaljs newModal(){\n\tvar ret = "";\n\n\tret += "say hi\\n";\n\tret += "say ho\\n";\n\n\treturn ret;\n}\n\nnewModal()\n\n# => say hi\n# => say ho\n')])])]),n("p",[e._v("Achtung: Du musst Absätze manuell mit "),n("code",[e._v("\\n")]),e._v(" hinzufügen.")]),e._v(" "),n("p",[e._v("Ein JavaScript modal ist immer deklariert durch das Keyword gefolgt vom Name und den Argumenten in den Klammern.")]),e._v(" "),n("p",[e._v("Die Argumente sind aufrufbar in dem Code.")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",[n("code",[e._v("modaljs newModal(argument){\n\treturn \"say \" + argument;\n}\n\nnewModal('test')\n\n# => say test\t \t\t\t\t\t\n")])])]),n("p",[e._v("Du kannst auch mehrere Argumente verwenden:")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",[n("code",[e._v('modaljs newModal(text,monster){\n\tvar ret = "";\n\n\tret += "say " + text + "\\n";\n\tret += "summon " + monster + "\\n";\n\n\treturn ret;\n}\n\nnewModal("Gehirne!!!","minecraft:zombie")\n\n# => say Gehirne!!!\n# => summon minecraft:zombie\n')])])]),n("p",[e._v("Es gibt ebenfalls optionale Argumente:")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",[n("code",[e._v('modaljs say(argument = "hallo"){\n\treturn "say " + argument ;\n}\n\nsay()\n# => say hallo\n\nsay(\'test\')\n# => say test\n')])])]),n("p",[n("strong",[e._v("Tipps und Tricks")])]),e._v(" "),n("p",[e._v("Benutze "),n("code",[e._v("console.log")]),e._v(", um einige Informationen in der Konsole, während des Kompelieren, auszugeben, ohne den Wert zu verändern.")]),e._v(" "),n("h2",{attrs:{id:"_4-16-system-modals"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_4-16-system-modals"}},[e._v("#")]),e._v(" 4.16 System Modals")]),e._v(" "),n("p",[e._v("Es gibt schon einige vordefinierte Modals, die hilfreich sein könnten. Bitte schaue dir dafür die spezifischen Dokumentationen "),n("a",{attrs:{href:"https://github.com/Stevertus/mcscript/blob/master/Core%20Modals.md",target:"_blank",rel:"noopener noreferrer"}},[e._v("hier"),n("OutboundLink")],1),e._v(" an.")]),e._v(" "),n("p",[e._v("Du hast Ideen, welche Modals unbedingt als Standart-Modal aufgegriffen werden müssen? Sende mir einfach die "),n("a",{attrs:{href:"#24_Dev_mcscript_modals_54"}},[e._v("Konfigurationsdatei")]),e._v(" zur Überprüfung.")]),e._v(" "),n("h2",{attrs:{id:"_4-17-error-handling-und-debugging"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_4-17-error-handling-und-debugging"}},[e._v("#")]),e._v(" 4.17 Error handling und Debugging")]),e._v(" "),n("p",[e._v("Minecraft Script zeigt mit der Version 0.2 nur noch begrenzt Fehler an mit der Zeilen- und Dateiangabe.\nBenutze beim generieren bitte die Flag "),n("code",[e._v("-fullErr")]),e._v(", um vollständige alte Fehler wiederzuerlangen, falls du sie wünscht.")]),e._v(" "),n("p",[e._v("Falls du Fehlerangaben findest, die im Kontext keinen Sinn machen, wende dich bitte an das Team.")]),e._v(" "),n("p",[n("strong",[e._v("Debug keyword")]),e._v('\nMit "Debug" kannst du deinen Code debuggen und auch mögliche Fehler in Minecraft Script viel leichter entdecken. Sie können irgendwo im Code platziert werden und beeinflussen den generierten Code nicht.*')]),e._v(" "),n("ul",[n("li",[n("code",[e._v("debug message: [message]")]),e._v("\nSendet eine einfache Nachricht in die Konsole mit Zeilen- und Dateiangaben.")]),e._v(" "),n("li",[n("code",[e._v("debug success: [message]")]),e._v("\nSendet eine erfolgreiche Nachricht mit grüner Kennzeichnung in die Konsole mit Zeilen- und Dateiangaben.")]),e._v(" "),n("li",[n("code",[e._v("debug break: [message]")]),e._v("\nDein Programm bricht an dieser Stelle ab und sendet erneut eine Nachricht.")]),e._v(" "),n("li",[n("code",[e._v("debug error: [message]")]),e._v("\nDein Programm bricht an dieser Stelle ab und gibt einen kritischen Fehler mit Systeminformationen und relevanten Codestellen aus.")])])])}),[],!1,null,null,null);n.default=s.exports}}]);