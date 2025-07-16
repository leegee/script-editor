import type { StoryService } from '../../story';
import type { ScriptLine, ScriptLineType } from '../../../lib/types';

export function useScriptline(
    this: StoryService,
    scriptlineId: () => string | undefined
) {
    return this.createLiveSignal(() => {
        if (!scriptlineId()) return undefined;
        return this.db.scriptlines.get(scriptlineId());
    });
}

export function useScriptlinesByBeatId(
    this: StoryService,
    beatId: () => string | undefined
) {
    return this.createLiveSignal(async () => {
        const id = beatId();
        if (!id) return undefined;

        const beats = await this.db.beats.where('id').equals(id).toArray();
        const scriptLineIds = beats.flatMap(b => b.scriptLineIds ?? []);
        const uniqueScriptLineIds = [...new Set(scriptLineIds)];
        const scriptLines = await this.db.scriptlines.where('id').anyOf(uniqueScriptLineIds).toArray();

        return scriptLineIds
            .map(id => scriptLines.find(line => line.id === id))
            .filter((line): line is ScriptLine => line !== undefined);
    });
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

    await this.db.beats.where('id').equals(beatId)
        .modify(beat => {
            if (!beat.scriptLineIds) beat.scriptLineIds = [];
            beat.scriptLineIds.push(newLine.id);
        });

    return newLine;
}
