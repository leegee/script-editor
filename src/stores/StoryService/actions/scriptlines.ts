import type { LiveSignal, StoryService } from '../../story';
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
): LiveSignal<ScriptLine[]> {
    return this.createLiveSignal(async () => {
        const beats = await this.db.beats.where('id').equals(beatId()).toArray();
        const scriptLineIds = beats.flatMap(b => b.scriptLineIds ?? []);
        const uniqueScriptLineIds = [...new Set(scriptLineIds)];

        const scriptLines = await this.db.scriptlines.bulkGet(uniqueScriptLineIds);

        const sortedScriptLines = scriptLineIds
            .map(id => scriptLines.find(sl => sl?.id === id))
            .filter((sl): sl is ScriptLine => sl !== undefined);

        return sortedScriptLines;
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
