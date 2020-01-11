---
sidebar: auto
footer: MIT Licensed | Copyright © 2020 Stevertus
prev: /de/cli/
next: /de/syntax/
---

# 3) File system
## 3.1 File setup
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

## 3.2 Dateien erweitern
Eine bereits bestehende Datei, vorher mit `#file:`, kann nun auch aus anderen Dateien erweitert werden und neuer Code einfach hinten drangehängt werden:
```
extend: ./test
/commands kommen hier.
```
## 3.3 Globale Dateien
[Variablen](#vars), [Konstanten](#consts) und [Modals](#modals) werden für jede Datei seperat gespeichert.
Jetzt kann man eine globale Datei mit der Endung `.gl.mcscript` erstellen. Der Compiler erkennt diese automatisch und verwendet die deklarierten Objekte auch in anderen Dateien.
So kann man die Modals zum Beispiel in eine eigende Datei schreiben.