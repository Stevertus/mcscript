---
home: true
heroImage: /logo.png
title: mcscript
actionText: Lege los →
actionLink: /de/guide/
footer: MIT Lizensiert | Copyright © 2020 Stevertus
---

<div class="features">
  <a class="feature" href="/de/guide">
  <img src="/rocket_icon.svg" style="width:80px;margin-left:calc(50% - 40px);" />
  <h2>Quickstart</h2>
  <p>Bist du bereit?</p>
</a>
  <!-- <a class="feature" href="https://stevertus.com/mcscript/code">
  <img src="/code_icon.svg" style="width:80px;margin-left:calc(50% - 40px);" />
  <h2>Online Editor</h2>
  <p>Start coding!</p>
</a> -->
  <a class="feature" href="https://github.com/Stevertus/mcscript">
  <img src="/gitHub_icon.svg" style="width:80px;margin-left:calc(50% - 40px);" />
  <h2>GitHub</h2>
  <p>Alles ist Open-Source</p>
</a>
  <a class="feature" href="/de/syntax">
  <img src="/documentation_icon.svg" style="width:80px;margin-left:calc(50% - 40px);" />
  <h2>Dokumentation</h2>
  <p>Alles sorgfältig dokumentiert</p>
</a>
</div>
</div>

## Eine Programmiersprache für Datapacks!
Benutze eine Programmiersprache, die als Erweiterung der Minecraft Functions daher kommt, um neue Ausdrücke, Generatoren zu benutzen und die Entwicklungs von deinen Packs zu vereinfachen.

# Starte heute!

Fange heute an mcscript zu lernen mit meinem Videokurs:

<iframe width="560" height="315" style="margin: 0 calc(50% - 280px)" src="https://www.youtube-nocookie.com/embed/ShXr2-OD3lw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

----

### Variablen
Variablen können Zahlen speichern, ausgeben und es können Rechenoperationen durchgeführt werden. Minecraft Script bringt diese nun auch zu Minecraft Vanilla.
```js
var var1
var var2 = 5

var1 = 10

var2 += 5

var1 += var2
```
### Schleifen
Hattet ihr schonmal etwas, dass sich immer und immer wiederholt? Soetwas wird Loop genannt und ist jetzt auch in Minecraft verfügbar!
```js
for(1,5){
  log($(i))
}
while('entity @s[tag=loop]'){

}
```

### Bedingungen und If-Abfragen
Fasse If-Bedingungen ganz einfach zusammen und nenne mehrfache Bedingungen. Es wird alles von MC Script geregelt!
```js
if("entity @s"){
  /say entity found
}

// else statement
if("entity @s"){
  /say entity found
} else {
  /say elsewhise command
}
```

### Cleveres Datei Management
Generiere unbegrenzte neue Dateien, füge Dateien zusammen oder verwende alles zusammen im Loop. Der Kreatität sind keine Grenzen gesetzt, außer der Speicherplatz deines Computers.

```
#file: file1
#this is file 1

#file: file2
#this is file 2 
```

## Installation

Für die Installation wird die Node.js Umgebung und der Node Package Manager benötigt.

Diese installiert man am besten über den Installer: nodejs.org/en/download/

Installiere die CLI mit: 
```bash
npm install -g mcscript
```

Bei einer erfolgreichen Antwort hast du alles richtig gemacht und kannst durchstarten.


## Trete in Kontakt mit der Community und bekomme Updates


<div class="hero" style="padding:16px"><a class="nav-link action-button" href="https://discord.gg/McYXVC8">Joine Discord</a></div>
