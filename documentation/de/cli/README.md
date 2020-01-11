---
sidebar: auto
footer: MIT Licensed | Copyright © 2020 Stevertus
prev: /de/guide/
next: /de/files/
---

#  2) CLI Commands


Das Tool kannst du nun anwenden, indem du die Command Line in deinen Datapacks Ordner startest  
(über Shift + Rechtsklick auf Ordner -> Eingabeaufforderung hier öffnen)  
Nun kannst du die Kommandos benutzen:
## 2.1 mcscript new

Dieser Command generiert dir ein vorgefertigtes Datapack mit allen basic Dateien und einem Scripts-Ordner. Als Argument muss die Id des Packs angegeben werden!
## 2.2 mcscript compile

Dieser Command wandelt alle .mcscript Dateien in .mcfunction Format um. Was in den mcscript Dateien möglich ist, kannst du hier nachlesen.  
In der Konsole werden alle generierten Dateien angezeigt oder ein Fehler ausgeworfen, falls etwas nicht korrekt war.

Alternativ kannst mit `mcscript compile *filepath*` einen speziellen Pfad oder spezielle Datei angeben.
Mit der zusätzlichen `-fullErr` flag können ganze Fehler mit code Referenzen angezeigt werden.

## 2.3 mcscript watch

Hiermit wird dein Code automatisch compiled, wenn du irgendwelche Änderungen machst (speicherst). So musst du nicht bei jeder Änderung den obigen Command eingeben.

Auch hier kann ein Pfad angegeben und -fullErr verwendet werden.

## 2.4 mcscript add [url or package]
Dieser Conmmand kann ein datapack zu deiner Welt hinzufügen.
Als Argument kann entweder eine Url direkt zur Datei oder der Name einer mcScript Extension genutzt werden.

Eine Liste aller McScript Extensions kann bekommen werden mit `mcscript add`

## 2.4 Dev: mcscript modals

!!Dieser Command ist nur für Entwicker gedacht, die ihre Modals in den Compiler einbauen wollen.  
Es muss eine Datei angegeben werden und die Modals aus dieser Datei werden dann in eine Konfigurationsdatei geschrieben.