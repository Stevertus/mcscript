#######
# Compiled from examples/functions/switches.mcscript
# to examples/functions/switches.mcfunction
#
# Generated by Minecraft Script for 1.13
######
scoreboard players set test test 10
execute if score test test matches 11 if entity @s[tag=!mcscriptSwitch] run say var is 11
execute if score test test matches 11 if entity @s[tag=!mcscriptSwitch] run tag @s add mcscriptSwitch
execute if score test test matches 11.. if entity @s[tag=!mcscriptSwitch] run say var is over 10
execute if score test test matches 11.. if entity @s[tag=!mcscriptSwitch] run tag @s add mcscriptSwitch
execute if score test test matches ..9 if entity @s[tag=!mcscriptSwitch] run say var is below 10
execute if score test test matches ..9 if entity @s[tag=!mcscriptSwitch] run tag @s add mcscriptSwitch
execute if entity @s[tag=!mcscriptSwitch] run say no match
tag @s remove mcscriptSwitch