#######
# Compiled from /examples/functions/file Setup.mcscript
# to .//examples/functions/mcscript/load.mcfunction
#
# Generated by Minecraft Script for 1.13
######
coreboard objectives add global1 dummy

# Extended from /examples/functions/boolean.mcscript
# to examples/functions/mcscript/load.mcfunction
# please do not touch this file!
# it is used by the compiler!
execute unless entity @e[tag=mcscriptTags] at @p run summon armor_stand ~ ~ ~ {Tags:[mcscriptTags],Invisible:1,Invulnerable:1,NoGravity:1}

# Extended from /examples/functions/raycasting.mcscript
# to examples/functions/mcscript/load.mcfunction
# please do not touch this file!
# it is used by the compiler!
scoreboard objectives add mcscript_raycast dummy

# Extended from /examples/functions/switches.mcscript
# to examples/functions/mcscript/load.mcfunction
# please do not touch this file!
# it is used by the compiler!
scoreboard objectives add test dummy
