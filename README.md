# Prototype Script Editor

Experiments in modelling a film script, 

* SolidJS
* Local-first with Dexie and a reasonably good entity model
* `liveQuery` so that model updates are simply reflected
* Drag-and-drop to re-order and move acts, scenes, beats, script lines.

## To do

* Add Plots

* Use tags

* Add history

* Add CRDT

* Branded types?
    - `type StoryId = string & { __brand: 'StoryId' };`
    - `type ActId = string & { __brand: 'ActId' };`
    - `type ISODateString = string & { __brand: 'ISODateString' };`
