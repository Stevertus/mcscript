


# Minecraft Script Dokumentation

Minecraft Script ist eine Programmiersprache für Entwickler der mcfunctions, sowie für die Minecraft Map und Package Erschaffer. Die .mcscript Dateien werden dabei zu mcfunction compiled und generiert. Dies bietet dem Entwickler erweiterte Möglichkeiten, wie zum Beispiel Modals, Loops, Variablen, Konstanten und Command-Wrapping.

Wer das ausprobieren möchte oder Beispiele anschauen möchte, kann meinen playground [stevertus.ga/tools/mcscript](http://www.stevertus.ga/tools/mcscript) besuchen und etwas herumspielen.

English documentation [here](https://github.com/Stevertus/mcscript/blob/master/README.md)

## 1) Installation

Der Compiler wird auch als [Node.js/](https://nodejs.org/en/download/) Package angeboten, das lokal auf dem PC installiert wird und viele Features mehr hat: als die Online-Version hat.  
z.B: Alle Dateien in einem Ordner gleichzeitig compilen, direkter Output in neuen Dateien, auf Dateiänderungen "watchen", uvm.

### 1.1 Installation von Node.js

Für die Installation wird die Node.js Umgebung und der Node Package Manager benötigt.

Diese installiert man am besten über den Installer: [nodejs.org/en/download/](https://nodejs.org/en/download/)  
Den einfach ausführen und installieren lassen.

### 1.2 Installation von Minecraft Script

Öffne nun die Konsole deines PCs (Am besten über Suche unter CMD zu erreichen).

Hier muss nun dieser Command eingegeben werden: `npm install -g mcscript`  
Bei einer erfolgreichen Antwort hast du alles richtig gemacht und kannst durchstarten.

##  CLI Commands


Das Tool kannst du nun anwenden, indem du die Command Line in deinen Datapacks Ordner startest  
(über Shift + Rechtsklick auf Ordner -> Eingabeaufforderung hier öffnen)  
Nun kannst du die Kommandos benutzen:

### 2.1 mcscript new

Dieser Command generiert dir ein vorgefertigtes Datapack mit allen basic Dateien. Als Argument muss die Id des Packs angegeben werden!

### 2.2 mcscript compile

Dieser Command wandelt alle .mcscript Dateien in .mcfunction Format um. Was in den mcscript Dateien möglich ist, kannst du hier nachlesen.  
In der Konsole werden alle generierten Dateien angezeigt oder ein Fehler ausgeworfen, falls etwas nicht korrekt war.

Alternativ kannst mit `mcscript compile *filepath*` einen speziellen Pfad oder spezielle Datei angeben.

### 2.3 mcscript watch

Hiermit wird dein Code automatisch compiled, wenn du irgendwelche Änderungen machst (speicherst). So musst du nicht bei jeder Änderung den obigen Command eingeben.

Auch hier kann ein Pfad angegeben werden.

### 2.4 Dev: mcscript modals

!!Dieser Command ist nur für Entwicker gedacht, die ihre Modals in den Compiler einbauen wollen.  
Es muss eine Datei angegeben werden und die Modals aus dieser Datei werden dann in eine Konfigurationsdatei geschrieben.

##  Minecraft Script Syntax


Der Code wird in Dateien mit der Endung .mcscript geschrieben. Es wird ein Code-Editor(IDE) empfohlen, um die Dateien zu verwalten und den Syntax farbig zu markieren. Mehr hier:

Anders als bei mcfunction wird jeder Command mit einem "/" oder "run: " injektiert.

Kommentare werden mit "//" angekündigt, falls Kommentare auch in der neuen Datei auftauchen sollen mit "#"

Leerzeilen und Zeilensprünge werden nicht beachtet.  
Falls eine Leerzeile aus Struktur in der mcfunction gewünscht ist, dies mit einem # ohne Kommentar ausdrücken.  
Zwei Leerzeilen können mit "##" erreicht werden.

### 3.1 File setup

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
### 3.2 Dateien erweitern
Eine bereits bestehende Datei, vorher mit `#file:`, kann nun auch aus anderen Dateien erweitert werden und neuer Code einfach hinten drangehängt werden:
```
#extend: ./test
/commands kommen hier.
```

### 3.3 Command Gruppen / Wrapping

"as, at, positioned,align,dimension,rotated,anchored" können zusammengefasst werden:


    as('@a'){	 
    	/commands 	=> /execute positioned ~ ~ ~ run command
    }		 


In den Klammern muss das jeweilige Argument als String, sprich " " oder ' ' stehen!

"Gruppen können auch aufgelistet werden:


    as('@p'), at('@s'), positioned('~ ~1 ~'){
    	/say command
    }
    ==> /execute as @p at @s positioned ~ ~-1 ~ run say command

    // also with if
    as('@p'), at('@s'), positioned('~ ~1 ~'), if(entity @s[tag=mytag]){
    	/say command
    }
    ==> /execute as @p at @s positioned ~ ~-1 ~ if entity @s[tag=mytag] run say command
### 3.4 Variablen
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
test += neu ==> 15
test -= neu ==> 5
test *= neu ==> 50
test /= neu ==> 2
test %= neu ==> 0
```
### 3.5 Konstanten
Eine andere Art Variable ist die Konstante, so deklariert:
`const test = [value]`
Diese Art kann nicht verändert werden!
Du kannst sie mit `$(var_name)` irgendwo in deinem Code benutzen um lange Strings und wiederholende Phrasen zu vermeiden:
```
const einString = "Hier könnte sehr viel Schrott stehen."
const eineNum = 5

/say $(einString)       ==> /say Hier könnte sehr viel Schrott stehen.
var test = $(eineNum)   ==> var test = 5
```
### 3.6 If/Else Statements

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
    if('entity @s[tag=test]'){
    	/tag @s remove test 	
    	} else {		  		
    	/tag @s remove test		
    }
```
Hier werden beide ausgeführt!! Verbessert:
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

*   auch "else if" ist möglich:
```
    if('statement'){
    	/commands 				=> /execute if statement run command
    } else if('statement2') {	   /execute unless statement if statement2 run command2
    	/commands2
    }
```


### 3.7 Logische Operatoren

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

### 3.8 For-Loops

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
### 3.9 while-Loops
Der while-Loop ist so zu definieren:
```
while([cond]){
    /commands
}
```
Die gruppierten Commands werden solange ausgeführt, wie die Bedingung[cond] war ist.
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

### 3.10 Modals

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


### 3.11 System Modals

Es gibt schon einige vordefinierte Modals, die hilfreich sein könnten. Bitte schaue dir dafür die spezifischen Dokumentationen [hier](#) an.

Du hast Ideen, welche Modals unbedingt als Standart-Modal aufgegriffen werden müssen? Sende mir einfach die [Konfigurationsdatei](#24_Dev_mcscript_modals_54) zur Überprüfung.

##  IDEs und Syntax Highlighting


*   GitHubs Atom Editor: link here (credit: [MrYurihi](https://atom.io/users/MrYurihi))
*   Notepad++: link here

Jetzt bleibt nichts mehr übrig als: **Happy Developing**
--------------------------------------------------------

Vielen Dank an alle die Minecraft Script benutzen und diese Dokumentation gelesen haben. Bei Vorschlägen, Problemen oder Fehlern bitte mich kontaktieren.
