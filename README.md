# Prototype Script Editor

Experiments in modelling a film script, using SolidJS, Dexie, and liveQuery.

## To do

### DnD

### Add CRDT

### Branded types?

    type StoryId = string & { __brand: 'StoryId' };
    type ActId = string & { __brand: 'ActId' };
    type ISODateString = string & { __brand: 'ISODateString' };
