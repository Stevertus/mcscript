



![](https://i.imgur.com/YedWe7W.png)

# Minecraft Script Dokumentation
> Update 0.2: [Alle Änderungen](https://github.com/Stevertus/mcscript/releases)

Minecraft Script ist eine Programmiersprache für Entwickler der mcfunctions, sowie für die Minecraft Map und Package Erschaffer. Die .mcscript Dateien werden dabei zu mcfunction compiled und generiert. Dies bietet dem Entwickler erweiterte Möglichkeiten, wie zum Beispiel Modals, Loops, Variablen, Konstanten und Command-Wrapping.

Wer das ausprobieren möchte oder Beispiele anschauen möchte, kann meinen online Editor [stevertus.ga/mcscript/code](http://www.stevertus.ga/mcscript/code) besuchen und etwas herumspielen.

English documentation [here](https://github.com/Stevertus/mcscript/blob/master/README.md)
## Table of Contents
1) [Installation](#install)
    - [Installation von Node.js](#install-nodejs)
    - [Installation von Minecraft Script](#install-mcscript)
2) [Cli Commands](#cli)
    - [mcscript new](#cli-new)
    - [mcscript compile](#cli-compile)
    - [mcscript watch](#cli-watch)
3) [file system](#files)
	  - [file setup](#files)
    - [Dateien erweitern](#extend)
    - [Globale Dateien](#global)
4) [Syntax](#syntax)
    - [Command Grouping](#groups)
    - [Funktionen](#functions)
    - [Variablen](#vars)
    - [Boolean Variablen](#boolean)
    - [Konstanten](#consts)
    - [If Statements](#if)
    - [Logische Operatoren](#operators)
    - [Switches](#switch)
    - [For-Loop](#for)
    - [Raycasting](#raycast)
    - [while-Loops](#while)
    - [do-while-Loops](#dowhile)
    - [forEach-Loops](#foreach)
    - [Modals](#modals)
    - [System Modals](#systemModals)
    - [Fehler und Debugging](#debugging)
5) [IDEs und Syntax Highlighting](#ide)
<a id="install"></a>
## 1) Installation

Der Compiler wird auch als [Node.js/](https://nodejs.org/en/download/) Package angeboten, das lokal auf dem PC installiert wird und viele Features mehr hat: als die Online-Version hat.  
z.B: Alle Dateien in einem Ordner gleichzeitig compilen, direkter Output in neuen Dateien, auf Dateiänderungen "watchen", uvm.
<a id="install-nodejs"></a>
### 1.1 Installation von Node.js

Für die Installation wird die Node.js Umgebung und der Node Package Manager benötigt.

Diese installiert man am besten über den Installer: [nodejs.org/en/download/](https://nodejs.org/en/download/)  
Den einfach ausführen und installieren lassen.
<a id="install-mcscript"></a>
### 1.2 Installation von Minecraft Script

Öffne nun die Konsole deines PCs (Am besten über Suche unter CMD zu erreichen).

Hier muss nun dieser Command eingegeben werden:
> ```npm install -g mcscript```  

Bei einer erfolgreichen Antwort hast du alles richtig gemacht und kannst durchstarten.
<a id="cli"></a>
##  2) CLI Commands


Das Tool kannst du nun anwenden, indem du die Command Line in deinen Datapacks Ordner startest  
(über Shift + Rechtsklick auf Ordner -> Eingabeaufforderung hier öffnen)  
Nun kannst du die Kommandos benutzen:
<a id="cli-new"></a>
### 2.1 mcscript new

Dieser Command generiert dir ein vorgefertigtes Datapack mit allen basic Dateien und einem Scripts-Ordner. Als Argument muss die Id des Packs angegeben werden!
<a id="cli-compile"></a>
### 2.2 mcscript compile

Dieser Command wandelt alle .mcscript Dateien in .mcfunction Format um. Was in den mcscript Dateien möglich ist, kannst du hier nachlesen.  
In der Konsole werden alle generierten Dateien angezeigt oder ein Fehler ausgeworfen, falls etwas nicht korrekt war.

Alternativ kannst mit `mcscript compile *filepath*` einen speziellen Pfad oder spezielle Datei angeben.
Mit der zusätzlichen `-fullErr` flag können ganze Fehler mit code Referenzen angezeigt werden.
<a id="cli-watch"></a>
### 2.3 mcscript watch

Hiermit wird dein Code automatisch compiled, wenn du irgendwelche Änderungen machst (speicherst). So musst du nicht bei jeder Änderung den obigen Command eingeben.

Auch hier kann ein Pfad angegeben und -fullErr verwendet werden.
<a id="cli-add"></a>
### 2.4 mcscript add [url or package]
Dieser Conmmand kann ein datapack zu deiner Welt hinzufügen.
Als Argument kann entweder eine Url direkt zur Datei oder der Name einer mcScript Extension genutzt werden.

Eine Liste aller McScript Extensions kann bekommen werden mit `mcscript add`

<a id="cli-modals"></a>
### 2.4 Dev: mcscript modals

!!Dieser Command ist nur für Entwicker gedacht, die ihre Modals in den Compiler einbauen wollen.  
Es muss eine Datei angegeben werden und die Modals aus dieser Datei werden dann in eine Konfigurationsdatei geschrieben.
<a id="files"></a>
## 3) File system
### 3.1 File setup
In einem Minecraft Datapack können alle Datein in ein scripts Ordner gepackt werden, um dann in `/functions` den Output zu generieren.
Es werden immer Dateien mit gleichem Namen, wie ihr Root generiert.

Ein benutzerdefinierter Name kann mit `#file: *name*` gesetzt werden.  
Bitte ohne `.mcfunction`!!

Statt des Namen kann auch gleich ein ganzer Pfad, an dem die neue Datei sein soll, angegeben werden:

*   `#file: C:/test/neu`
*   `#file: ./neu` (Im gleichen Ordner)
*   `#file: ./unterordner/neu`
*   `#file: ../neu` (Ein Ordner dadrüber)
*   `#file: ../unterordner/neu`

Es können auch mehrere Dateien spezifiziert werden:

    #file: neu
    //commands hier
    #file: zwei
    //Commands für zwei hier

Auch sehr gut mit [for-loops](#loops) kombinierbar:

    #file: neu
    //commands hier
    for(1,5){
    	#file: test$(i)
    	//Commands für jede Datei hier
    }
<a id="extend"></a>
### 3.2 Dateien erweitern
Eine bereits bestehende Datei, vorher mit `#file:`, kann nun auch aus anderen Dateien erweitert werden und neuer Code einfach hinten drangehängt werden:
```
#extend: ./test
/commands kommen hier.
```
<a id="global"></a>
### 3.3 Globale Dateien
[Variablen](#vars), [Konstanten](#consts) und [Modals](#modals) werden für jede Datei seperat gespeichert.
Jetzt kann man eine globale Datei mit der Endung `.gl.mcscript` erstellen. Der Compiler erkennt diese automatisch und verwendet die deklarierten Objekte auch in anderen Dateien.
So kann man die Modals zum Beispiel in eine eigende Datei schreiben.
<a id="syntax"></a>
##  Minecraft Script Syntax


Der Code wird in Dateien mit der Endung .mcscript geschrieben. Es wird ein Code-Editor(IDE) empfohlen, um die Dateien zu verwalten und den Syntax farbig zu markieren. [Mehr hier](#ide)

Anders als bei mcfunction wird jeder Command mit einem "/" oder "run: " injektiert.

Kommentare werden mit "//" angekündigt, falls Kommentare auch in der neuen Datei auftauchen sollen mit "#"
Ein Kommentar über mehrere Zeilen muss mit
```
*/
angegeben werden
/*
```

Leerzeilen und Zeilensprünge werden nicht beachtet.  
Falls eine Leerzeile aus Struktur in der mcfunction gewünscht ist,drücke dies mit einem # ohne Kommentar aus.  
Zwei Leerzeilen können mit "##" erreicht werden.
<a id="groups"></a>

### 4.1 Command Gruppen / Wrapping
> ```[subcommand]([argument]){  [wrapped actions]   }```

"as, at, positioned,align,dimension,rotated,anchored" können zusammengefasst werden:


    as(@a){	 
    	/commands 	=> /execute positioned ~ ~ ~ run command
    }		 


In den Klammern muss das jeweilige Argument als String, sprich " " oder ' ' stehen!
Auch ist der eigende `asat()` möglich
```
asat(@s){
    /commands => execute as @s at @s run commands
}
```
"Gruppen können auch aufgelistet werden:


    as(@p), at(@s), positioned('~ ~1 ~'){
    	/say command
    }
    ==> /execute as @p at @s positioned ~ ~-1 ~ run say command

    // also with if
    as(@p), at(@s), positioned('~ ~1 ~'), if(@s[tag=mytag]){
    	/say command
    }
    ==> /execute as @p at @s positioned ~ ~-1 ~ if entity @s[tag=mytag] run say command
<a id="functions"></a>
### 4.2 Funktionen
 ```
[run] function "name|path" {
	/commands
}
```
> run optional
> ein Pfad sollte als String angegeben werden
> ein nur aus Buchstaben bestehender name auch ohne ""

Eine Funktion generiert eine weitere mcfunction mit den angegebenen Namen oder Pfad. Mit dem run keyword kann eine Funktion auch direkt ausgeführt werden.
Dies ist eine alternative zu einer wesentlich komplizierteren Variante mit `#file:`.
Bsp:
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
### 4.3 Variablen
Wie jede Programmiersprache hat auch Minecraft Script Variablen. Sie müssen wiefolgt initialisiert werden:
`var test`
Der Variablen kann ein Wert hinzugewiesen werden:
```
var test = 5
# oder
var test
test = 6
```
Dieser Wert kann beliebig oft wieder verändert werden.

```
var test
test @s = 10
```
So können Werte auch nur speziellen Minecraft Selektoren zugewiesen werden.
Auch mit Spielernamen oder Placeholdern möglich:
```
test Spielername = 10
```
Alle Werte werden in einem scoreboard mit dem Variablennamen gespeichert. Also können die Werte auch ganz standart mäßig verändert und ausgelesen werden:
```
var test
test @s = 10
/scoreboard players get @s test ==> 10
/scoreboard players set @s test 5
# etc
```

Variablen können auch mit anderen zusammen gerechnet und zusammengefügt werden:
```
var test = 10
var neu = 5
# Achtung: Der Einfachkeit halber starte ich immer wieder mit diesen Werten. Das Programm macht es nartürlich anders!

test += 2 ==> 12
test -= 2 ==> 8
```
Etwas gekürzt:
```
test++ ==> test += 1
test-- ==> test -= 1

test += neu ==> 15
test -= neu ==> 5
test *= neu ==> 50
test /= neu ==> 2
test %= neu ==> 0
```
**Command Response in Variable speichern:**
```
var res = run: command
==> execute store result score res res run command
```
Das Ergebnis des command wird in die Variable res geschrieben.
Beispiel mit /data get:
`var varResult = run: data get entity @s Pos[0]`

<a id="boolean"></a>
### 4.4 Boolean Variablen (Tags)
> `bool [name] [selector](optional) = true|false`

So können Wahrheitswerte deklariert werden.
`bool isCool = true => tag [global] add isCool`
Eine Boolean Variable kann später noch verändert werden:
`isCool = false => tag [global] remove isCool`

Mit [If](#if) testbar:
```
if(isCool){
    /commands => execute if entity [global][tag=isCool] run commands
}
```
<a id="consts"></a>
### 4.5 Konstanten
Eine andere Art Variable ist die Konstante, so deklariert:
> `const [name] = [value]`

Diese Art kann nicht verändert werden!
Du kannst sie mit `$(var_name)` irgendwo in deinem Code benutzen um lange Strings und wiederholende Phrasen zu vermeiden:
```
const einString = "Hier könnte sehr viel Schrott stehen."
const eineNum = 5

/say $(einString)       ==> /say Hier könnte sehr viel Schrott stehen.
var test = $(eineNum)   ==> var test = 5
```
**Replace Konstanten**
Der Wert einer Konstante kann bei der Verwendung noch umgeändert werden. Hierzu ein `.repl()` an die Verwendung anfügen:
> `$(const).repl([suchwert],[replacement])`

Bei unserem Beispiel wollen wir das viel replacen:
```
/say $(einString).repl("viel","sehr viel") ==> /say Hier könnte sehr sehr viel Schrott stehen.
```
Auch kann hier ein [RegEx](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/RegExp) eingefügt werden und auch auf diesen im Replacement zugegriffen werden:
`$(const).repl([/regex/],["$&"])`

<a id="if"></a>
### 4.6 If/Else Statements

If funktioniert ähnlich wie das Command Wrapping:


    if('statement'){
    	/commands 	=> /execute if statement run command
    }		 


Mit einigen extra Features:

*   Vor dem Argument kann ein "!" eingefügt werden um dies umzukehren:


        if(!'statement'){
        	/commands 	=> /execute unless statement run command
        }		 


*   Nach dem Schluss kann ein "else" angehängt werden:
```
    if('statement'){
    	/commands 	=> /execute if statement run command
    } else {		   /execute unless statement run command2
    	/commands2
    }
```

Hier darauf achten das Argument nicht zu verändern!
```
    if(@s[tag=test]){
    	/tag @s remove test 	
    	} else {		  		
    	/tag @s remove test		
    }
```
Hier werden beide ausgeführt!! Verbessert:
```
    if(@s[tag=test]){
    	/tag @s add testIf
    }
    if(@s[tag=testIf]){
    	/tag @s remove test 	
    	} else {		  		
    	/tag @s remove test		
    }
```

*   auch "else if" ist möglich:
```
    if('statement'){
    	/commands 				=> /execute if statement run command
    } else if('statement2') {	   /execute unless statement if statement2 run command2
    	/commands2
    }
```

<a id="operators"></a>
### 4.7 Logische Operatoren

In Kombination mit Command Gruppen und If-Else-Statements können zusätzlich logische Operatoren benutzt werden:

*   Der Oder-Operator kann bei den Gruppierungen auf zwei Arten benutzt werden:
```
    as(@s||@p){
    	/command 	
    }
    ==> execute as @s run command
        execute at @p run command

    # oder als Liste
    if(@s[tag=entity1],'entity @s[tag=entity2]'){
    # hier gehen beide Varianten ^
    	/command 	
    }
    ==> execute if entity @s[tag=entity1] run command
        execute if entity @s[tag=entity2] @p run command
```

*   Der Und-Operator wird so definiert: (nur für if-statements sinnvoll)
```
    if('entity @s'&&'entity @p'){
    	/command 	
    }
    ==> execute if entity @s if entity @p run command
```
*   Überprüfung von Variablen:
```
var test = 5

# genau gleich
if(test == 5){
    /commands
}

# größer/kleiner gleich
if(test >= 5){
    /commands
}

# größer/kleiner
if(test > 5){
    /commands
}

# auch im Vergleich möglich
if(test > test2){
    /commands
}

# oder mit entity variablen
if(test @s > test2 @a){
    /commands
}
```
<a id="switch"></a>
### 4.8 Switch-Cases
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
Switches erleichtern dem Benutzer die vielen If-Bedingungen. Es kann einfach und übersichtlich auf verschiedene Werte von Variablen getestet werden.
bsp:
```
var test = 10
switch(test){
    case > 10 {
        /say var ist über 10
    },
    case < 10 {
        /say var ist unter 10
    },
    default {
        /say nichts traf zu.
    }
}
```
Hier wird also test geprüft auf über 10, wenn das nicht zutrifft auf unter 10 und als standart default ausgegeben.
Auch abkürzbar:
```
var test = 10
switch(test){
    case > 10 run: say var ist über 10
    , case < 10 run: say var ist unter 10
    , default run: say nichts traf zu.
}
```
<a id="for"></a>
### 4.9 For-Loops
```
for([from],[to],[var_name](optional)){
    [actions]
}
```
Einer der hilfreichsten Features ist der For-Loop. Als Argumente werden ganze Zahlen angenommen.

Von `erstes Argument` bis `zweites Argument` wird optional ausgegeben als `drittes Argument`
```
for(1,5){
	/commands
	# es wird 5x command ausgegeben
}
```
```
for(1,5){
	/say $(i)
	# es wird 5x say mit 1 - 5 ausgegeben
}
```

Mit $(var_name) kann auf den Loopwert zugegriffen werden.

var_name ist normalerweise als "i" definiert, kann aber im 3.Argument geändert werden:


    for(1,5,X){
    	/say $(X)
    	# es wird 5x say mit 1 - 5 ausgegeben
    }	 					


Das ist bei 2 dimensionalen Loops sinnvoll:


    for(1,5,i){
    	for(1,2,j){
    		/say $(i).$(j)
    	}
    	# es wird 10x say mit 1.1 - 5.2 ausgegeben
    }
<a id="raycast"></a>
### 4.10 Raycasting
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
Raycasting ist eine große Sache in Minecraft 1.13 und bietet viele Möglichkeiten.
Es ist allerdings bisschen schwierig, also warum nicht leichter machen?
Mit Minecraft Script ist das nun sehr sehr einfach:
```
raycast {
    /setblock ~ ~ ~ stone
}
```
Das alleine setzt überall, wo man hinschaut einen Steinblock.
Partikel und Blockbegrenzung auch noch sehr einfach:
```
raycast(10) {
    /setblock ~ ~ ~ stone
}, {
    /particle flame ~ ~ ~
}
```
Jetzt haben wir schöne Effekte und eine maximale Range von 10 Blöcken.
Das zweite optinale Argument gibt die durchlässigen Blöcke an.
```
raycast(10,"air") {
    /setblock ~ ~ ~ stone
}
```
Das Raycasting geht also nur durch Luft.
Auch kann man die durchlässigen Blöcke negieren und mit einem "!" angeben, welche Blöcke nicht durchlässig sind:
```
raycast(10,!"white_wool") {
    /setblock ~ ~ ~ stone
}
```
Das Raycasting geht also durch alle Blöcke außer weiße Wolle.

Als drittes optionales Argument kann man ein Ziel angeben:
```
raycast(10,"air",block "white_wool") {
    /setblock ~ ~ ~ stone
}
```
Jetzt weiß Mcscript, dass das Ziel ein Block ist und führt den Command nur aus, wenn der Block weiße Wolle ist.
```
raycast(10,"air",entity @e[type=armor_stand]) {
    /say test
}
```
Mcscript weiß nun, dass das Ziel eine Entity ist und führt den Command als diese aus, wenn sie getroffen wurde.
Also würde der Armor Stand test sagen.
<a id="while"></a>
### 4.11 while-Loops
Der while-Loop ist so zu definieren:
```
while([cond]){
    /commands
}
```
Die gruppierten Commands werden solange ausgeführt, wie die Bedingung[cond] war ist.
> Wenn die Bedingung zum Start nicht wahr ist, wird die Gruppierung nicht ausgeführt!

Als Bedingung können hier alle Operatoren und Argumente der If-Bedingungen verwendet werden. z.B.
```
var test = 0
while(test < 10){
    /commands hier
    test += 1
}
# ==> Die Commands werden innerhalb eines Ticks 10mal ausgeführt.
```
Bei while-Loops kann auch mit stop und continue gearbeitet werden:
```
var test = 0
while(test < 10){
    test += 1
    if(test == 5){
        continue
        # Wenn test 5 ist werden die restlichen Commands übersprungen
    }
    /commands hier
    if(test >= 9){
        stop
        # Wenn test 9 oder über 9 ist wird die Schleife abgebrochen
    }
}
```
<a id="dowhile"></a>
### 4.12 do-while-Loops
```
do {
    /commands
} while([cond])
```
Der do-while-Loop funktioniert ähnlich, wie der while-Loop mit dem kleinen Unterschied, dass der Codeblock ausgeführt wird und danach erst die Bedingung geprüft wird.
Der Loop wird also mindestens einmal durchlaufen.
<a id="foreach"></a>
### 4.13 forEach-Loop
```
forEach(var [var_name] = [startwert]; [var_name] ==|>|<|<=|>=|!= [other_var]|[number]; [varname]++){
    /commands
}
```
Der forEach-Loop ist ein Loop, wie man ihn in fast jeder Programmiersprache vorfindet.
Er ähnelt sich zu dem for-Loop von Minecraft Script, funktioniert aber dynamisch(d.h wird nicht beim generieren ausgeführt, sondern von Minecraft)

Bsp:
```
forEach(var i = 0; i < 10; i++){
    /say hey
}
```
Der Command wird also 10mal ausgeführt und der aktuelle Wert jeweils in dem scoreboard i gespeichert.
So kann man auch auf den Wert zugreifen. Bsp. Fakultät:
```
var result = 1
forEach(var i = 2; i <= 10; i++){
    result *= i
}
==> result = 1 * 2 * 3 * 4 * 5 * 6 * 7 * 8 * 9 * 10
```
<a id="modals"></a>
### 4.14 Modals
> ```
> modal [name]([arguments]){
>    [actions]
>}
>```
Modals kann man wie functions oder Methoden verstehen, dass heißt man kann sie definieren:


    modal newModal(argument){
    	/say $(argument)
    }	 					


Ein Modal wird immer mit dem Keyword eingeleitet, gefolgt von dem Namen und in Klammern alle benötigten Argumente.

Auf diese Argumente kann dann innerhalb mit $(argument_name) Referenz genommen werden.


    modal newModal(argument){
    	/say $(argument)
    }

    newModal('test')

    # => say test	 					


Wenn man das Modal so benutzt, dann werden die Werte eingesetzt und alles ausgegeben.


    modal createCommand(command,argument1,argument2){
    	/$(command) $(argument1) $(argument2)
    }

    createCommand('say', 'hallo', 'du')

    # => say hallo du 					


Es können so auch mehrere Argumente benutzt werden.

Auch sind optionale und vordefinierte Argumente verfügbar:


    modal say(argument = "hallo"){
    	/say $(argument)
    }

    say()
    # => say hallo

    say('test')
    # => say test				
**Modals überschreiben**
Bereits erstellte modals können innerhalb des Prozesses überschrieben werden:
> ```
> override modal [name]([arguments]){
>    [actions]
>}
>```

Dabei werden Argumente und Actions komplett getauscht und für den fortlaufenden Prozess verwendet.

**Argumente ersetzen**
Der Wert eines Arguments kann bei der Verwendung noch umgeändert werden. Hierzu ein `.repl()` an die Verwendung anfügen:
> `$(argument).repl([suchwert],[replacement])`

Bei unserem Beispiel wollen wir ein eingegebenes test replacen:
```
/say $(argument).repl("test","no test") ==> /say no test
```
Auch kann hier ein [RegEx](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/RegExp) eingefügt werden und auch auf diesen im Replacement mit `$&` zugegriffen werden:
`$(argument).repl([/regex/],["$&"])`

<a id="systemModals"></a>
### 4.15 System Modals

Es gibt schon einige vordefinierte Modals, die hilfreich sein könnten. Bitte schaue dir dafür die spezifischen Dokumentationen [hier](https://github.com/Stevertus/mcscript/blob/master/Core%20Modals.md) an.

Du hast Ideen, welche Modals unbedingt als Standart-Modal aufgegriffen werden müssen? Sende mir einfach die [Konfigurationsdatei](#24_Dev_mcscript_modals_54) zur Überprüfung.
<a id="debugging"></a>
### 4.16 Error handling und Debugging
Minecraft Script zeigt mit der Version 0.2 nur noch begrenzt Fehler an mit der Zeilen- und Dateiangabe.
Benutze beim generieren bitte die Flag `-fullErr`, um vollständige alte Fehler wiederzuerlangen, falls du sie wünscht.

Falls du Fehlerangaben findest, die im Kontext keinen Sinn machen, wende dich bitte an das Team.

**Debug keyword**
Mit "Debug" kannst du deinen Code debuggen und auch mögliche Fehler in Minecraft Script viel leichter entdecken. Sie können irgendwo im Code platziert werden und beeinflussen den generierten Code nicht.*
* `debug message: [message]`
Sendet eine einfache Nachricht in die Konsole mit Zeilen- und Dateiangaben.
* `debug success: [message]`
Sendet eine erfolgreiche Nachricht mit grüner Kennzeichnung in die Konsole mit Zeilen- und Dateiangaben.
* `debug break: [message]`
Dein Programm bricht an dieser Stelle ab und sendet erneut eine Nachricht.
* `debug error: [message]`
Dein Programm bricht an dieser Stelle ab und gibt einen kritischen Fehler mit Systeminformationen und relevanten Codestellen aus.

<a id="ide"></a>
##  IDEs und Syntax Highlighting


*   GitHubs Atom Editor: link here (credit: [MrYurihi](https://atom.io/users/MrYurihi))
*   Notepad++: [see code](https://github.com/Stevertus/mcscript/blob/master/Nodepad%2B%2B%20Highlighter.xml) | [download](http://download1496.mediafire.com/x2k7loq5imbg/4534q4tual7zccm/Nodepad+++Highlighter.xml)

Jetzt bleibt nichts mehr übrig als: **Happy Developing**
--------------------------------------------------------

Vielen Dank an alle die Minecraft Script benutzen und diese Dokumentation gelesen haben. Bei Vorschlägen, Problemen oder Fehlern bitte mich kontaktieren.
Ich freue mich euch ebenfalls euch auf meinem Discord begrüßen zu dürfen und Vorschläge und Kritik zu hören.
