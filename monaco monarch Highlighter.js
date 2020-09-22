// This is the code for a custom Syntax Highlighter and for Snippets for the Minecraft Script programming language.
// Editor library used: Microsoft Monaco

monaco.languages.register({ id: "mcscript" });
monaco.languages.register({ id: "mcfunction" });

// Register a tokens provider for the language
monaco.languages.setMonarchTokensProvider("mcscript", {
  entitys: ["@a", "@p", "@s", "@r", "@e"],
  tokenizer: {
    root: [
      // [/[a-zA-Z_\x80-\xFF][\w\x80-\xFF]*/, {
      //   cases: { '@entitys': 'entity'} }],
      [
        /\/(?:advancement|ban|banlist|data|clear|clone|debug|defaultgamemode|deop|difficulty|effect|execute|experience|fill|function|gamemode|gamerule|give|help|kick|kill|list|locate|me|msg|op|pardon|pardon-ip|particle|playsound|publish|recipe|reload|replaceitem|save-all|save-off|save-on|say|scoreboard|seed|setblock|setidletimeout|setworldspawn|spawnpoint|spreadplayers|stop|stopsound|summon|tag|team|teleport|tell|tellraw|time|title|trigger|w|weather|whitelist|worldborder|xp)\b\s/,
        "command",
      ],
      [/\s*\/\/.*/, "comment"],
      [
        /(\=|\+\=|\-\=|\*\=|\/\=|\%\=|\+\+|\-\-|\*|\/|\+|\-|\%|\>|\<|\>\=|\<\=)/,
        "operator",
      ],
      [/"(?:[^\\]|\\.)*?"/, "string"],
      [/'(?:[^\\]|\\.)*?'/, "string"],
      [/(\s*#file:|\s*#extend:)(\s+)([\w\d$\/\._-]*)/, "operator"],
      [/\s*#.*/, "comment"],
      [/\b[0-9\.\-]+\b/, "number"],
      [
        /(?:area_effect_cloud|armor_stand|arrow|bat|blaze|boat|cave_spider|chest_minecart|chicken|cod_mob|commandblock_minecart|cow|creeper|dolphin|donkey|dragon_fireball|drowned|drowned|egg|elder_guardian|ender_crystal|ender_dragon|ender_pearl|enderman|endermite|evocation_fangs|evocation_illager|eye_of_ender_signal|falling_block|fireball|fireworks_rocket|furnace_minecart|ghast|giant|guardian|hopper_minecart|horse|husk|illusion_illager|item|item_frame|leash_knot|lightning_bolt|llama|llama_spit|magma_cube|minecart|mooshroom|mule|ocelot|painting|parrot|phantom|pig|polar_bear|potion|puffer_fish|rabbit|salmon_mob|sheep|shulker|shulker_bullet|silverfish|skeleton|skeleton_horse|slime|small_fireball|snowball|snowman|spawner_minecart|spectral_arrow|spider|squid|stray|tnt|tnt_minecart|trident|tropical_fish|turtle|vex|villager|villager_golem|vindication_illager|witch|wither|wither_skeleton|wither_skull|wolf|xp_bottle|xp_orb|zombie|zombie_horse|zombie_pigman|zombie_villager)\b/,
        "property",
      ],
      [
        /(?:if|~|then|else|unless|true|false|as|at|asat|positioned|align|dimension|rotated|anchored|while|do|forEach|for|raycast|stop|continue|switch|case|default|var|bool|boolean|tag|score|const)\b\s/,
        "keyword",
      ],
      [
        /(?:grant|revoke|start|stop|set|add|remove|merge|entity|block|nbt|gamemode|level|dx|dy|dz|distance|x_rotation|y_rotation|limit|tag|type|sort|scores)\b\s/,
        "keyword2",
      ],
      [/(modal)(\s+)([\w\d$\/\._-]*)/, "keyword"],
      [/(\$[\w\-]*)/, "variable"],
      [/([a-zA-Z0-9]+)(?=\s*\(.*)/, "variable"],
    ],
  },
});
monaco.languages.setLanguageConfiguration("mcscript", {
  brackets: [
    ["{", "}"],
    ["(", ")"],
    ["[", "]"],
  ],
  comments: {
    lineComment: "//",
  },
  folding: {
    offSide: true,
  },
});
monaco.languages.setMonarchTokensProvider("mcfunction", {
  tokenizer: {
    root: [
      // [/[a-zA-Z_\x80-\xFF][\w\x80-\xFF]*/, {
      //   cases: { '@entitys': 'entity'} }],
      [
        /(?:advancement|ban|banlist|data|clear|clone|debug|defaultgamemode|deop|difficulty|effect|execute|experience|fill|function|gamemode|gamerule|give|help|kick|kill|list|locate|pardon|pardon-ip|particle|playsound|publish|recipe|reload|replaceitem|save-all|save-off|save-on|say|scoreboard|seed|setblock|setidletimeout|setworldspawn|spawnpoint|spreadplayers|stop|stopsound|summon|tag|team|teleport|tell|tellraw|time|title|trigger|weather|whitelist|worldborder)\b\s/,
        "command",
      ],
      [
        /(\=|\+\=|\-\=|\*\=|\/\=|\%\=|\+\+|\-\-|\*|\/|\+|\-|\%|\>|\<|\>\=|\<\=)/,
        "operator",
      ],
      [/"(?:[^\\]|\\.)*?"/, "string"],
      [/'(?:[^\\]|\\.)*?'/, "string"],
      [/(\s*#file:|\s*#extend:)(\s+)([\w\d$\/\._-]*)/, "operator"],
      [/\s*\/\/.*/, "comment"],
      [/\s*#.*/, "comment"],
      [/\b[0-9\.\-]+\b/, "number"],
      [
        /(?:area_effect_cloud|armor_stand|arrow|bat|blaze|boat|cave_spider|chest_minecart|chicken|cod_mob|commandblock_minecart|cow|creeper|dolphin|donkey|dragon_fireball|drowned|drowned|egg|elder_guardian|ender_crystal|ender_dragon|ender_pearl|enderman|endermite|evocation_fangs|evocation_illager|eye_of_ender_signal|falling_block|fireball|fireworks_rocket|furnace_minecart|ghast|giant|guardian|hopper_minecart|horse|husk|illusion_illager|item|item_frame|leash_knot|lightning_bolt|llama|llama_spit|magma_cube|minecart|mooshroom|mule|ocelot|painting|parrot|phantom|pig|polar_bear|potion|puffer_fish|rabbit|salmon_mob|sheep|shulker|shulker_bullet|silverfish|skeleton|skeleton_horse|slime|small_fireball|snowball|snowman|spawner_minecart|spectral_arrow|spider|squid|stray|tnt|tnt_minecart|trident|tropical_fish|turtle|vex|villager|villager_golem|vindication_illager|witch|wither|wither_skeleton|wither_skull|wolf|xp_bottle|xp_orb|zombie|zombie_horse|zombie_pigman|zombie_villager)\b/,
        "property",
      ],
      [
        /(?:if|~|then|else|true|false|as|at|asat|positioned|align|dimension|rotated|anchored|while|do|forEach|for|raycast|stop|continue|switch|case|default|var|bool|boolean|tag|score|const)\b\s/,
        "keyword",
      ],
      [/(?:grant|revoke|start|stop|set|add|remove|merge)/, "keyword2"],
      [
        /(?:entity|block|nbt|gamemode|level|dx|dy|dz|distance|x_rotation|y_rotation|limit|tag|type|sort|scores)=/,
        "keyword2",
      ],
      [/(modal)(\s+)([\w\d$\/\._-]*)/, "keyword"],
      [/(\$[\w\-]*)/, "variable"],
      [/([a-zA-Z0-9]+)(?=\s*\(.*)/, "variable"],
    ],
  },
});

// Define a new theme that constains only rules that match this language
monaco.editor.defineTheme("mcfunction", {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "command", foreground: "FF4500" },
    { token: "number", foreground: "02ABFD" },
    { token: "comment", foreground: "6F6F6F" },
    { token: "operator", foreground: "FF5B5B" },
    { token: "keyword", foreground: "FF8040" },
    { token: "keyword2", foreground: "209CDF" },
    { token: "entity", foreground: "FF5B5B" },
    { token: "string", foreground: "8ED200" },
    { token: "property", foreground: "8FB900" },
  ],
});

// Register a completion item provider for the new language
monaco.languages.registerCompletionItemProvider("mcscript", {
  provideCompletionItems: () => {
    return [
      {
        label: "file",
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: {
          value: "#file: ./${1:filename}",
        },
        documentation: "add a new file",
      },
      {
        label: "ifelse",
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: {
          value: ["if (${1:condition}) {", "\t$0", "} else {", "\t", "}"].join(
            "\n"
          ),
        },
        documentation: "If-Else Statement",
      },
      {
        label: "as",
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: {
          value: ["as (${1:entity}) {", "\t$0", "}"].join("\n"),
        },
        documentation: "as execute subcommand group",
      },
      {
        label: "at",
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: {
          value: ["at (${1:entity}) {", "\t$0", "}"].join("\n"),
        },
        documentation: "at execute subcommand group",
      },
      {
        label: "positioned",
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: {
          value: ["positioned (${1:string}) {", "\t$0", "}"].join("\n"),
        },
        documentation: "positioned execute subcommand group",
      },
      {
        label: "align",
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: {
          value: ["align (${1:string}) {", "\t$0", "}"].join("\n"),
        },
        documentation: "align execute subcommand group",
      },
      {
        label: "rotated",
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: {
          value: ["rotated (${1:string}) {", "\t$0", "}"].join("\n"),
        },
        documentation: "rotated execute subcommand group",
      },
      {
        label: "dimension",
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: {
          value: ["dimension (${1:string}) {", "\t$0", "}"].join("\n"),
        },
        documentation: "in execute subcommand group",
      },
      {
        label: "anchored",
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: {
          value: ["anchored (${1:string}) {", "\t$0", "}"].join("\n"),
        },
        documentation: "anchored execute subcommand group",
      },
      {
        label: "asat",
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: {
          value: ["asat (${1:entity}) {", "\t$0", "}"].join("\n"),
        },
        documentation: "as at @s execute subcommand group",
      },
      {
        label: "if",
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: {
          value: ["if (${1:condition}) {", "\t$0", "}"].join("\n"),
        },
        documentation: "If Statement. Insert a condition",
      },
      {
        label: "switch",
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: {
          value: [
            "switch (${1:variable}) {",
            "\tcase ${2:value}: {",
            "\t\t$0",
            "\t}",
            "}",
          ].join("\n"),
        },
        documentation: `switch([var_name]){
    case <=|<|==|>|>= [other_var]|[number] {
      [actions]
    },
    default(optional) {
      [default actions]
    }
  }`,
      },
      {
        label: "case",
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: {
          value: ["case ${1:value}: {", "\t$0", "}"].join("\n"),
        },
        documentation: `
    case <=|<|==|>|>= [other_var]|[number] {
      [actions]
    },
      `,
      },
      {
        label: "for-loop",
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: {
          value: ["for(${1:from},${2:to}) {", "\t$0", "}"].join("\n"),
        },
        documentation: `The simple for loop.
for(from, to, [varname]){

}
  `,
      },
      {
        label: "while",
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: {
          value: ["while(${1:condition}) {", "\t$0", "}"].join("\n"),
        },
        documentation: `A simple loop.
while(condition){

}
  `,
      },
      {
        label: "do-while",
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: {
          value: ["do {", "\t$0", "} while(${1:condition})"].join("\n"),
        },
        documentation: `A simple do-while loop.
do {

} while(condition)
  `,
      },
      {
        label: "modal",
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: {
          value: ["modal ${1:name} (${2:arguments}) {", "\t$0", "}"].join("\n"),
        },
        documentation: `Modal. Like a function or method`,
      },
      {
        label: "forEach",
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: {
          value: [
            "forEach(var ${1:varname} = ${2:startValue}; ${1:varname} ${3:condition}; ${1:varname}++) {",
            "\t$0",
            "}",
          ].join("\n"),
        },
        documentation: `The more advanced forEach loop to count in a loop.
forEach(var [var_name] = [start value]; [var_name] ==|>|<|<=|>=|!= [other_var]|[number]; [varname]++){

}
  `,
      },
      {
        label: "raycast",
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: {
          value: ["raycast {", "\t$0", "}"].join("\n"),
        },
        documentation: `A very simple raycast method`,
      },
      {
        label: "raycast-advanced",
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: {
          value: [
            "raycast(${1:distance}, ${2:blocks}, ${3:target}) {",
            "\t$0",
            "},{",
            "\t$0",
            "}",
          ].join("\n"),
        },
        documentation: `A very simple raycast method`,
      },
    ];
  },
});
