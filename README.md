# Prototype Script Editor

Experiments in modelling a film script.

### Branded types?

    type StoryId = string & { __brand: 'StoryId' };
    type ActId = string & { __brand: 'ActId' };
    type ISODateString = string & { __brand: 'ISODateString' };
