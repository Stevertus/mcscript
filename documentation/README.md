---
home: true
heroImage: /logo.png
title: mcscript
actionText: Get Started →
actionLink: /guide/
footer: MIT Licensed | Copyright © 2020 Stevertus
---

<div class="features">
  <a class="feature" href="/guide">
  <img src="/rocket_icon.svg" style="width:80px;margin-left:calc(50% - 40px);" />
  <h2>Quickstart</h2>
  <p>Are you ready?</p>
</a>
  <!-- <a class="feature" href="https://stevertus.com/mcscript/code">
  <img src="/code_icon.svg" style="width:80px;margin-left:calc(50% - 40px);" />
  <h2>Online Editor</h2>
  <p>Start coding!</p>
</a> -->
  <a class="feature" href="https://github.com/Stevertus/mcscript">
  <img src="/gitHub_icon.svg" style="width:80px;margin-left:calc(50% - 40px);" />
  <h2>GitHub</h2>
  <p>Everything is open-source</p>
</a>
  <a class="feature" href="/syntax">
  <img src="/documentation_icon.svg" style="width:80px;margin-left:calc(50% - 40px);" />
  <h2>Documentation</h2>
  <p>Everything well documentated</p>
</a>
</div>
</div>

## A programming language for datapacks!

Use a programming language built ontop of Minecrafts functions to add new expressions, generators and simplify development.

# Get Started!

Start programming with mcscript today with the help of my video course:

<iframe width="560" height="315" style="margin: 0 calc(50% - 280px)" src="https://www.youtube-nocookie.com/embed/ShXr2-OD3lw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

---

### Variables

Variables can store numbers, output these and perform operations. Minecraft Script now brings them to Minecraft Vanilla.

```js
var var1;
var var2 = 5;

var1 = 10;

var2 += 5;

var1 += var2;
```

### Loops

Have you ever had something that repeats itself over and over again? This is called a loop and is now also available in Minecraft!

```js
for(1,5){
  log($(i))
}
while('entity @s[tag=loop]'){

}
```

### Conditions And If-Statements

Simply summarize If conditions and name multiple conditions. Everything is controlled by mcscript!

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

### Clever File Handling

Generate unlimited new files, merge files or use everything together in a loop. There are no limits in creativity except the space of your computer.

```
#file: file1
#this is file 1

#file: file2
#this is file 2
```

## Installation

The installation requires the Node.js environment and the Node Package Manager.

This is achieved the best way by using the installer: nodejs.org/en/download/

Install the mcscript-cli with:

```bash
npm install -g mcscript
```

If a successful answer apears you have done everything right and can start.

## Get Connected With the Community and get Update

<div class="hero" style="padding:16px"><a class="nav-link action-button" href="https://discord.gg/McYXVC8">Join the Discord</a></div>
