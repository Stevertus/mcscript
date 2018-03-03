Minecraft Script Dokumentation
==============================

Minecraft Script ist eine Programmiersprache für Entwickler der mcfunctions, sowie Minecraft Map und Package Erschaffer. Die .mcjs Dateien werden dabei zu mcfunction compiled und generiert. Dies bietet dem Entwickler erweiterte Möglichkeiten, wie zum Beispiel Modals, Loops, Variablen, Konstanten und Command-Wrapping.

Wer das ausprobieren möchte oder Beispiele anschauen möchte, kann meinen playground [stevertus.ga/tools/mcscript](http://www.stevertus.ga/tools/mcscript) besuchen und etwas herumspielen.

##1) Installation

Der Compiler wird auch als Node.js Package angeboten, das lokal auf dem PC installiert wird und viele Features mehr als die Online-Version hat.  
z.B: Alle Dateien in einem Ordner gleichzeitig compilen, direkter Output in neuen Dateien, auf Dateiänderungen "watchen", uvm.

### 1.1 Installation von Node.js

Für die Installation wird die Node.js Umgebung und der Node Package Manager benötigt.

Diese installiert man am besten über den Installer: [nodejs.org/en/download/](https://nodejs.org/en/download/)  
Den einfach ausführen und installieren lassen.

### 1.2 Installation von Minecraft Script

Öffne nun die Konsole deines PCs. (Am besten über Suche unter CMD zu erreichen)

Hier muss nun dieser Command eingegeben werden: `npm install -g mcscript`  
Bei einer erfolgreichen Antwort hast du alles richtig gemacht und kannst durchstarten.

##2) CLI Commands

Das Tool kannst du nun anwenden indem du die Command Line in deinen Datapacks Ordner startest  
(über Shift + Rechtsklick auf Ordner -> Eingabeaufforderung hier öffnen)  
Nun kannst du die Kommandos benutzen:

### 2.1 mcscript-compile

Dieser Command wandelt alle .mcscript Dateien in .mcfunction Format um. Was du in den mcscript Dateien möglich ist, kannst du hier nachlesen.  
In der Konsole werden alle generierten Dateien angezeigt oder ein Fehler ausgeworfen, falls etwas nicht korrekt war.

Alternativ kannst mit `mcscript-compile *filepath*` einen speziellen Pfad oder spezielle Datei angeben.

### 2.2 mcscript-watch

Hiermit wird dein Code automatisch compiled, wenn du irgendwelche Änderungen machst(speicherst). So musst du nicht bei jeder Änderung den obigen Command eingeben.

Auch hier kann ein Pfad angegeben werden.

### 2.3 Dev: mcscript-modals

!!Dieser Command ist nur für Entwicker gedacht, die ihre Modals in den Compiler einbauen wollen.  
Es muss eine Datei angegeben werden und die Modals aus dieser Datei werden dann in eine Konfigurationsdatei geschrieben.

##3) Minecraft Script Syntax

Der Code wird in Dateien mit der Endung .mcscript geschrieben. Es wird ein Code-Editor(IDE) empfohlen um die Dateien zu managen und den Syntax farbig zu markieren. mehr hier:

Anders als bei mcfunction wird jeder Command mit einem "/" oder "run: " injektiert.

Kommentare werden mit "//" angekündigt, falls Kommentare auch in der neuen Datei auftauchen sollen mit "#"

Leerzeilen und Zeilensprünge werden nicht beachtet.  
Falls eine Leerzeile aus Struktur in der mcfunction gewünscht ist, dies mit einem # ohne Kommentar ausdrücken.  
Zwei Leerzeilen können mit "##" erreicht werden.

### 3.1 File setup

Es werden immer Dateien mit gleichen Namen, wie ihr Root generiert.

Ein benutzerdefinierter Name kann mit `#file: *name*` erreicht werden.  
Bitte ohne .mcfunction!!

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

Auch sehr gut mit for-Loops kombinierbar:

    #file: neu
    //commands hier
    for(1,5){
    	#file: test$(i)
    	//Commands für jede Datei hier
    }


### 3.2 Command Gruppen / Wrapping

"As, At, Positioned" können zusammengefasst werden:


    as('@a'){	 
    	/commands 	=> /execute positioned ~ ~ ~ run command
    }		 


In den Klammern muss das jeweilige Argument als String, sprich "" oder '' stehen!

### 3.3 If/Else Statements

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

*   auch "else if() is möglich:"

    ```
    if('statement'){
    	/commands 				=> /execute if statement run command
    } else if('statement2') {	   /execute unless statement if statement2 run command2
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


### 3.4 For-Loops

Einer der hilfreichsten Features ist der For-Loop. Als Argumente werden ganze Zahlen angenommen.

Von `erstes Argument` bis `zweites Argument` wird optional ausgegeben als `drittes Argument`

 ```
 for(1,5){
	/commands
	# es wird 5x command ausgegeben
}
 for(1,5){
	/say $(i)
	# es wird 5x say mit 1 - 5 ausgegeben
}
```

mit $(var_name) kann auf den Loopwert zugegriffen werden

var_name ist normalerweise als "i" definiert, kann aber im 3.Argument geändert werden:

```
    for(1,5,X){
    	/say $(X)
    	# es wird 5x say mit 1 - 5 ausgegeben
    }	 					
```

Das ist bei 2 dimensionalen Loops sinnvoll:

```
    for(1,5,i){
    	for(1,2,j){
    		/say $(i).$(j)
    	}
    	# es wird 10x say mit 1.1 - 5.2 ausgegeben
    }	 					
```

### 3.5 Modals

Modals kann man wie functions oder Methoden verstehen, dass heißt man kann sie definieren:

```
    modal newModal(argument){
    	/say $(argument)
    }	 					
```

Ein Modal wird immer mit dem Keyword eingeleitet gefolgt von dem Namen und in Klammern alle benötigten Argumente.

Auf diese Argumente kann dann inerhalb mit $(argument_name) Referenz genommen werden.

```
    modal newModal(argument){
    	/say $(argument)
    }

    newModal('test')

    # => say test	 					
```

Wenn man das Modal so benutzt, dann werden die Werte eingesetzt und alles ausgegeben.

```
    modal createCommand(command,argument1,argument2){
    	/$(command) $(argument1) $(argument2)
    }

    createCommand('say', 'hallo', 'du')

    # => say hallo du 					
```

Es können so auch mehrere Argumente benutzt werden.

Auch sind optionale und vordefinierte Argumente verfügbar:

```
    modal say(argument = "hallo"){
    	/say $(argument)
    }

    say()
    # => say hallo

    say('test')
    # => say test				
```

### 3.6 System Modals

Es gibt schon einige vordefinierte Modals, die hilfreich sein könnten. Bitte schaue dir dafür die spezifischen Dokumentationen an: hier

Du hast Ideen welche Modals umbedingt als Standart-Modal aufgegriffen werden müssen? Sende mir einfach die Konfigurationsdatei zur Überprüfung.

## 4) IDEs und Syntax Hightlighting

*   GitHubs Atom Editor: link here (credit: [MrYurihi](https://atom.io/users/MrYurihi))
*   Notepad++: link here

Jetzt bleibt nichts mehr übrig als: **Happy Developing**
--------------------------------------------------------

Vielen Dank an alle die Minecraft Script benutzen und diese Dokumentation gelesen haben. Bei Vorschlägen, Problemen oder Fehlern bitte mich kontaktieren.
