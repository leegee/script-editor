import type { StoryService } from '../../story';
import type { ScriptLine, ScriptLineType } from '../../../lib/types';

function orderByIds<T extends { id: string }>(items: T[], idOrder: string[]): T[] {
    const map = new Map(items.map(item => [item.id, item]));
    return idOrder.map(id => map.get(id)).filter(Boolean) as T[];
}

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
        if (!id) return [];

        const beats = await this.db.beats.where('id').equals(id).toArray();
        const scriptLineIds = beats.flatMap(b => b.scriptLineIds ?? []);
        if (scriptLineIds.length === 0) return [];

        const uniqueScriptLineIds = [...new Set(scriptLineIds)];
        const scriptLines = await this.db.scriptlines.where('id').anyOf(uniqueScriptLineIds).toArray();

        return orderByIds(scriptLines, scriptLineIds);
    });
}

export async function addNewScriptLineToBeat(
    this: StoryService,
    beatId: string
): Promise<ScriptLine> {
    const newLine: ScriptLine = {
        id: crypto.randomUUID(),
        type: 'Dialogue' as ScriptLineType.Dialogue,
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
