# Prototype Script Editor

WIP

[https://leegee.github.io/script-editor/](https://leegee.github.io/script-editor/)

## TODO 

Cards on home.tsx with id=undefined shoudl become non-draggable panels whose cantents cna be dragged but not to move but to copy into the target (ie add location to scene)

Move things

Remove characters

Compute useful stuff


### Branded types?

    type StoryId = string & { __brand: 'StoryId' };
    type ActId = string & { __brand: 'ActId' };
    type ISODateString = string & { __brand: 'ISODateString' };
