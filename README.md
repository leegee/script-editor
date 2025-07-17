# Prototype Script Editor

Experiments in modelling a film script, using SolidJS, Dexie and a reasonably good entity model, and liveQuery so that model updates are simply reflected.

## To do

### DnD

### Add CRDT

### Branded types?

    type StoryId = string & { __brand: 'StoryId' };
    type ActId = string & { __brand: 'ActId' };
    type ISODateString = string & { __brand: 'ISODateString' };
