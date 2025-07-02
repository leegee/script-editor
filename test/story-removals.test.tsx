import './setup';
import { describe, it, expect, beforeEach } from "bun:test";
import sinon from "sinon";
import { initializeDefaultStory, storyApi, story } from "../src/stores/story";

let validSceneId: string;
let validCharacterId: string;

describe("storyApi spy tests", () => {
    beforeEach(async () => {
        await initializeDefaultStory();

        const scenes = story.scenes;
        if (!scenes) throw new Error("No scenes available in storyApi");

        validSceneId = Object.keys(scenes)[0];
        if (!validSceneId) throw new Error("No sceneId found");

        const scene = scenes[validSceneId];

        if (scene.characterIds && scene.characterIds.length > 0) {
            validCharacterId = scene.characterIds[0];
        }

        if (!validCharacterId) {
            const characters = story.characters;
            if (!characters) throw new Error("No characters available in storyApi");
            validCharacterId = Object.keys(characters)[0];
            if (!validCharacterId) throw new Error("No characterId found");
        }
    });

    it("calls removeCharacterFromScriptLinesInScene with correct args", () => {
        const spy = sinon.spy(storyApi, "removeCharacterFromScriptLinesInScene");

        storyApi.removeCharacterFromScriptLinesInScene(validSceneId, validCharacterId);

        expect(spy.calledOnce).toBe(true);
        expect(spy.calledWith(validSceneId, validCharacterId)).toBe(true);

        spy.restore();
    });

    it("calls unlinkEntityFromScene with correct args", () => {
        const spy = sinon.spy(storyApi, "unlinkEntityFromScene");

        storyApi.unlinkEntityFromScene(validSceneId, validCharacterId, "characterIds");

        expect(spy.calledOnce).toBe(true);
        expect(spy.calledWith(validSceneId, validCharacterId, "characterIds")).toBe(true);

        spy.restore();
    });
});
