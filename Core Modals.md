# Minecraft Script Core Modals
`- parameter -`

` [optional] `

` <allowed types>`

` this | or that`
### console
> `log( - text <string | number> - , [target entity] )`

Logs a message into the Minecraft Chat.

### log variable
> `log.var( - objective <string> - , [entityname], [target entity] )`

Logs a variable into the Minecraft Chat.

### newStand
> `newStand( [name] , [position], [tags], [marker], [invisible], [noGravity] )`

Summons a new armor_stand with opional parameters.

### play
> `play(- sound_name - <String>, [target entiy] [type] )`

Plays a sound
## Minecraft Cam Modals
These are integrated Modals from my Camera Datapack for Mapmaking.
Install it [here](https://github.com/Stevertus/McCam).
### cam.pos1
> `cam.pos1( [location <string>] , [rotation <string> ] )`

Sets the first position to a optional point.
### cam.pos2
> `cam.pos2( [location <string>] , [rotation <string> ] )`

Sets the second position to a optional point.
### cam.start
> `cam.start( [entity] )`

Starts the camera process.
### cam.stop
> `cam.stop( [entity] )`

Stops the camera process.
### cam.time
> `cam.time( length <number> , [entity] )`

Sets the cam duration to a custom value (for an optional entity).
### cam.noParticles
> `cam.noParticles( [entity] )`

Disables the particles for the given entity.

### cam.noText
> `cam.noText( [entity] )`

Disables the messages for the given entity.
