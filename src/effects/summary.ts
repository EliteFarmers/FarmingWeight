import type { FarmingMechanic } from '../constants/mechanics.js';
import type { Stat } from '../constants/stats.js';
import type { Effect, EffectOp, Scope } from './types.js';

export interface EffectSummary {
	source: string;
	op: EffectOp;
	description?: string;
	relatedStats?: readonly Stat[];
	mechanic?: FarmingMechanic;
	scope?: Scope;
	value?: number;
	valueDisplay?: 'stat' | 'percent' | 'factor' | 'none';
	valueStat?: Stat;
}

export function effectToSummary(effect: Effect): EffectSummary | undefined {
	if ((!effect.relatedStats || effect.relatedStats.length === 0) && !effect.mechanic) return undefined;
	return {
		source: effect.source,
		op: effect.op,
		description: effect.meta?.description,
		relatedStats: effect.relatedStats,
		mechanic: effect.mechanic,
		scope: effect.scope,
		value: typeof effect.value === 'number' ? effect.value : undefined,
		valueDisplay: effect.meta?.valueDisplay,
		valueStat: effect.meta?.valueStat,
	};
}

export function effectsToSummaries(
	effects: readonly Effect[],
	stats?: readonly Stat[],
	mechanics?: readonly FarmingMechanic[]
): EffectSummary[] {
	const summaries = effects.map(effectToSummary).filter((summary) => summary !== undefined);
	if ((!stats || stats.length === 0) && (!mechanics || mechanics.length === 0)) return summaries;
	return summaries.filter(
		(summary) =>
			summary.relatedStats?.some((stat) => stats?.includes(stat)) ||
			(summary.mechanic !== undefined && mechanics?.includes(summary.mechanic))
	);
}
