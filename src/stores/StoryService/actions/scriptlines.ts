import type { StoryService } from '../../story';
import type { Location, ScriptLine, ScriptLineType } from '../../../lib/types';

export async function getScriptline(this: StoryService, id: string): Promise<ScriptLine | undefined> {
    return await this.db.scriptlines.get(id);
}

export async function getScriptlinesByBeatId(
    this: StoryService,
    beatId: string
): Promise<ScriptLine[]> {
    const beats = await this.db.beats.where('id').equals(beatId).toArray();
    const scriptLineIds = beats.flatMap(b => b.scriptLineIds ?? []);
    const uniqueScriptLineIds = [...new Set(scriptLineIds)];
    return this.db.scriptlines.where('id').anyOf(uniqueScriptLineIds).toArray();
}

export async function addNewScriptLineToBeat(
    this: StoryService,
    beatId: string
): Promise<ScriptLine> {
    const newLine: ScriptLine = {
        id: crypto.randomUUID(),
        type: 'Dialogue' as ScriptLineType,
        characterId: null,
        text: '',
    };

    await this.db.scriptlines.add(newLine);

    await this.db.beats.where('id').equals(beatId).modify(beat => {
        if (!beat.scriptLineIds) beat.scriptLineIds = [];
        beat.scriptLineIds.push(newLine.id);
    });

    return newLine;
}
