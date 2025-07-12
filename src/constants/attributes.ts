import type { FarmingPlayer } from '../player/player.js';
import type { CalculateCropDetailedDropsOptions, DetailedDropsResult } from '../util/ratecalc.js';
import { Crop } from './crops.js';
import { Rarity } from './reforges.js';
import type { StatsRecord } from './stats.js';

type ShardId = `SHARD_${string}`;

export type FarmingAttributes = Record<ShardId, number>;

interface FarmingAttributeShard {
	name: string;
	skyblockId: string;
	rarity: Rarity;
	wiki: string;
	maxLevel?: number;
	stats?: StatsRecord<unknown, FarmingPlayer>;
	perLevelStats?: StatsRecord<unknown, FarmingPlayer>;
	ratesModifier?: (current: DetailedDropsResult, options: CalculateCropDetailedDropsOptions) => DetailedDropsResult;
}

export const FARMING_ATTRIBUTE_SHARDS: Record<ShardId, FarmingAttributeShard> = {
	SHARD_WARTYBUG: {
		name: 'Warty Bug',
		skyblockId: 'SHARD_WARTYBUG',
		rarity: Rarity.Legendary,
		wiki: 'https://wiki.hypixel.net/Warty_Bug',
		ratesModifier: (current, options) => {
			if (options.crop !== Crop.NetherWart) return current;

			const level = getShardLevel(Rarity.Legendary, options.attributes?.SHARD_WARTYBUG);
			if (level <= 0) return current;

			const wartyChance = 0.0001 * level;
			const wartyDrops = current.blocksBroken * wartyChance;

			current.items['WARTY'] = wartyDrops;
			return current;
		},
	},
};

export const ATTRIBUTE_SHARD_LEVELING: Partial<Record<Rarity, number[]>> = {
	[Rarity.Common]: [1, 3, 5, 6, 7, 8, 10, 14, 18, 24],
	[Rarity.Uncommon]: [1, 2, 3, 4, 5, 6, 7, 8, 12, 16],
	[Rarity.Rare]: [1, 2, 3, 3, 4, 4, 5, 6, 8, 12],
	[Rarity.Epic]: [1, 1, 2, 2, 3, 3, 4, 4, 5, 7],
	[Rarity.Legendary]: [1, 1, 1, 2, 2, 2, 3, 3, 4, 5],
};

export function getShardLevel(rarity: Rarity, amount?: number | null): number {
	if (!amount || amount <= 0) return 0;

	const levels = ATTRIBUTE_SHARD_LEVELING[rarity];
	if (!levels) return 0;

	let level = 0;
	for (const [i, threshold] of levels.entries()) {
		if (amount < threshold) {
			level = i;
			break;
		}
		amount -= threshold;
	}
	return level;
}
