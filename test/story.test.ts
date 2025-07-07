import { describe, it, expect, beforeEach } from "bun:test";
import { storyApi, story } from "../src/stores/story";

describe("StoryService CRUD operations", () => {
    let testActId: string;
    let testSceneId: string;
    let testBeatId: string;
    let testScriptLineId: string;
    let testCharacterId: string;
    let testLocationId: string;

    beforeEach(() => {
        // Reset test IDs before each test
        testActId = "";
        testSceneId = "";
        testBeatId = "";
        testScriptLineId = "";
        testCharacterId = "";
        testLocationId = "";
    });

    describe("Acts", () => {
        it("should create, update, and delete an act", () => {
            // CREATE
            testActId = storyApi.createEntity("acts", { title: "Test Act" }, {
                parentType: "stories",
                parentId: storyApi.getStory()!.id,
                parentListField: "actIds",
            });
            expect(story.acts[testActId]).toBeTruthy();
            expect(story.acts[testActId].title).toBe("Test Act");

            // UPDATE
            storyApi.updateEntity('acts', testActId, 'title', "Updated Act Title");
            expect(story.acts[testActId].title).toBe("Updated Act Title");

            // DELETE
            storyApi.deleteEntity("acts", testActId, {
                parentType: "stories",
                parentId: storyApi.getStory()!.id,
                parentListField: "actIds",
            });
            expect(story.acts[testActId]).toBeUndefined();
        });
    });

    describe("Scenes", () => {
        it("should create and delete a scene under an act", () => {
            // Create parent act
            testActId = storyApi.createEntity("acts", { title: "Act for Scene" }, {
                parentType: "stories",
                parentId: storyApi.getStory()!.id,
                parentListField: "actIds",
            });

            // CREATE
            testSceneId = storyApi.createEntity("scenes", { title: "Test Scene" }, {
                parentType: "acts",
                parentId: testActId,
                parentListField: "sceneIds",
            });
            expect(story.scenes[testSceneId]).toBeTruthy();
            expect(story.acts[testActId].sceneIds.includes(testSceneId)).toBe(true);

            // DELETE
            storyApi.deleteEntity("scenes", testSceneId, {
                parentType: "acts",
                parentId: testActId,
                parentListField: "sceneIds",
            });
            expect(story.scenes[testSceneId]).toBeUndefined();
            expect(story.acts[testActId].sceneIds.includes(testSceneId)).toBe(false);

            // Cleanup parent act
            storyApi.deleteEntity("acts", testActId, {
                parentType: "stories",
                parentId: storyApi.getStory()!.id,
                parentListField: "actIds",
            });
        });
    });

    describe("Beats", () => {
        it("should create and delete a beat under a scene", () => {
            // Create parent act and scene
            testActId = storyApi.createEntity("acts", { title: "Act for Beat" }, {
                parentType: "stories",
                parentId: storyApi.getStory()!.id,
                parentListField: "actIds",
            });

            testSceneId = storyApi.createEntity("scenes", { title: "Scene for Beat" }, {
                parentType: "acts",
                parentId: testActId,
                parentListField: "sceneIds",
            });

            // CREATE
            testBeatId = storyApi.createEntity("beats", { title: "Test Beat" }, {
                parentType: "scenes",
                parentId: testSceneId,
                parentListField: "beatIds",
            });
            expect(story.beats[testBeatId]).toBeTruthy();
            expect(story.scenes[testSceneId].beatIds.includes(testBeatId)).toBe(true);

            // DELETE
            storyApi.deleteEntity("beats", testBeatId, {
                parentType: "scenes",
                parentId: testSceneId,
                parentListField: "beatIds",
            });
            expect(story.beats[testBeatId]).toBeUndefined();
            expect(story.scenes[testSceneId].beatIds.includes(testBeatId)).toBe(false);

            // Cleanup
            storyApi.deleteEntity("scenes", testSceneId, {
                parentType: "acts",
                parentId: testActId,
                parentListField: "sceneIds",
            });
            storyApi.deleteEntity("acts", testActId, {
                parentType: "stories",
                parentId: storyApi.getStory()!.id,
                parentListField: "actIds",
            });
        });
    });

    describe("ScriptLines", () => {
        it("should create and delete a script line under a beat", () => {
            // Create act, scene, beat
            testActId = storyApi.createEntity("acts", { title: "Act for ScriptLine" }, {
                parentType: "stories",
                parentId: storyApi.getStory()!.id,
                parentListField: "actIds",
            });
            testSceneId = storyApi.createEntity("scenes", { title: "Scene for ScriptLine" }, {
                parentType: "acts",
                parentId: testActId,
                parentListField: "sceneIds",
            });
            testBeatId = storyApi.createEntity("beats", { title: "Beat for ScriptLine" }, {
                parentType: "scenes",
                parentId: testSceneId,
                parentListField: "beatIds",
            });

            // CREATE
            testScriptLineId = storyApi.createEntity("scriptlines", { text: "This is a script line." }, {
                parentType: "beats",
                parentId: testBeatId,
                parentListField: "scriptLineIds",
            });
            expect(story.scriptlines[testScriptLineId]).toBeTruthy();
            expect(story.beats[testBeatId].scriptLineIds.includes(testScriptLineId)).toBe(true);

            // DELETE
            storyApi.deleteEntity("scriptlines", testScriptLineId, {
                parentType: "beats",
                parentId: testBeatId,
                parentListField: "scriptLineIds",
            });
            expect(story.scriptlines[testScriptLineId]).toBeUndefined();
            expect(story.beats[testBeatId].scriptLineIds.includes(testScriptLineId)).toBe(false);

            // Cleanup
            storyApi.deleteEntity("beats", testBeatId, {
                parentType: "scenes",
                parentId: testSceneId,
                parentListField: "beatIds",
            });
            storyApi.deleteEntity("scenes", testSceneId, {
                parentType: "acts",
                parentId: testActId,
                parentListField: "sceneIds",
            });
            storyApi.deleteEntity("acts", testActId, {
                parentType: "stories",
                parentId: storyApi.getStory()!.id,
                parentListField: "actIds",
            });
        });
    });

    describe("Characters", () => {
        it("should create and delete a character", () => {
            testCharacterId = storyApi.createEntity("characters", { name: "Test Character" });
            expect(story.characters[testCharacterId]).toBeTruthy();

            storyApi.updateEntity("characters", testCharacterId, "name", "Updated Character Name");
            expect(story.characters[testCharacterId].name).toBe("Updated Character Name");

            storyApi.deleteEntity("characters", testCharacterId);
            expect(story.characters[testCharacterId]).toBeUndefined();
        });
    });

    describe("Locations", () => {
        it("should create and delete a location", () => {
            testLocationId = storyApi.createEntity("locations", { name: "Test Location" });
            expect(story.locations[testLocationId]).toBeTruthy();

            storyApi.deleteEntity("locations", testLocationId);
            expect(story.locations[testLocationId]).toBeUndefined();
        });
    });
});
