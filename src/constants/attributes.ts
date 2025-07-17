import { calculateAverageSpecialCrops } from '../crops/special.js';
import type { FarmingPlayer } from '../player/player.js';
import type { CalculateCropDetailedDropsOptions, DetailedDropsResult } from '../util/ratecalc.js';
import { Crop } from './crops.js';
import { Rarity } from './reforges.js';
import { MATCHING_SPECIAL_CROP } from './specialcrops.js';
import { Stat, type StatsRecord } from './stats.js';

type ShardId = `SHARD_${string}`;

export type FarmingAttributes = Record<ShardId, number>;

interface FarmingAttributeShard {
	name: string;
	skyblockId: string;
	rarity: Rarity;
	wiki: string;
	maxLevel?: number;
	stats?: StatsRecord<unknown, FarmingPlayer>;
	perLevelStats?: StatsRecord<unknown, FarmingPlayer | CalculateCropDetailedDropsOptions>;
	ratesModifier?: (current: DetailedDropsResult, options: CalculateCropDetailedDropsOptions) => DetailedDropsResult;
}

export const FARMING_ATTRIBUTE_SHARDS: Record<ShardId, FarmingAttributeShard> = {
	SHARD_WARTYBUG: {
		name: 'Warty Bug Shard',
		skyblockId: 'SHARD_WARTYBUG',
		rarity: Rarity.Legendary,
		wiki: 'https://wiki.hypixel.net/Warty_Bug',
		ratesModifier: (current, options) => {
			if (options.crop !== Crop.NetherWart) return current;

			const level = getShardLevel(Rarity.Legendary, options.attributes?.SHARD_WARTYBUG);
			if (level <= 0) return current;

			const wartyChance = 0.00005 * level;
			const wartyDrops = current.blocksBroken * wartyChance;

			current.rngItems ??= {};
			current.rngItems['WARTY'] = wartyDrops;
			return current;
		},
	},
	SHARD_DRAGONFLY: {
		name: 'Dragonfly Shard',
		skyblockId: 'SHARD_DRAGONFLY',
		rarity: Rarity.Epic,
		wiki: 'https://wiki.hypixel.net/Dragonfly',
		perLevelStats: {
			[Stat.FarmingWisdom]: {
				value: 0.5,
			},
		},
	},
	SHARD_FIREFLY: {
		name: 'Firefly Shard',
		skyblockId: 'SHARD_FIREFLY',
		rarity: Rarity.Epic,
		wiki: 'https://wiki.hypixel.net/Firefly',
		perLevelStats: {
			[Stat.FarmingFortune]: {
				calculated: (options) => {
					const a = options.attributes ?? {};
					if ((a.SHARD_LUNAR_MOTH ?? 0) > (a.SHARD_FIREFLY ?? 0)) return 0;
					return 5;
				},
			},
		},
	},
	SHARD_LUNAR_MOTH: {
		name: 'Lunar Moth Shard',
		skyblockId: 'SHARD_LUNAR_MOTH',
		rarity: Rarity.Epic,
		wiki: 'https://wiki.hypixel.net/Lunar_Moth',
		perLevelStats: {
			[Stat.FarmingFortune]: {
				calculated: (options) => {
					const a = options.attributes ?? {};
					if ((a.SHARD_FIREFLY ?? 0) > (a.SHARD_LUNAR_MOTH ?? 0)) return 0;
					return 5;
				},
			},
		},
	},
	SHARD_LADYBUG: {
		// 1% more copper from visitors per level
		name: 'Ladybug Shard',
		skyblockId: 'SHARD_LADYBUG',
		rarity: Rarity.Rare,
		wiki: 'https://wiki.hypixel.net/Ladybug',
	},
	SHARD_CROPEETLE: {
		name: 'Cropeetle Shard',
		skyblockId: 'SHARD_CROPEETLE',
		rarity: Rarity.Rare,
		wiki: 'https://wiki.hypixel.net/Cropeetle',
		ratesModifier: (current, options) => {
			const level = getShardLevel(Rarity.Rare, options.attributes?.SHARD_CROPEETLE);
			if (level <= 0) return current;

			const specialCrop = MATCHING_SPECIAL_CROP[options.crop];
			if (!specialCrop) return current;

			const bonus = 0.02 * level + 1;

			const newAmount = calculateAverageSpecialCrops(
				current.blocksBroken,
				options.crop,
				options.armorPieces ?? 4,
				bonus
			);

			current.otherCollection[specialCrop] = Math.round(newAmount.amount);
			current.items[specialCrop] = +newAmount.amount.toFixed(2);
			current.coinSources[specialCrop] = Math.round(newAmount.npc);

			return current;
		},
	},
	SHARD_INVISIBUG: {
		// 1% chance for rare or higher visitor per level
		name: 'Invisibug Shard',
		skyblockId: 'SHARD_INVISIBUG',
		rarity: Rarity.Rare,
		wiki: 'https://wiki.hypixel.net/Invisibug',
	},
	SHARD_TERMITE: {
		name: 'Termite Shard',
		skyblockId: 'SHARD_TERMITE',
		rarity: Rarity.Uncommon,
		wiki: 'https://wiki.hypixel.net/Termite',
		perLevelStats: {
			[Stat.FarmingFortune]: {
				calculated: (options) => {
					if (!('options' in options)) return 0;
					const probability = options.options.infestedPlotProbability ?? 0;
					return 3 * probability;
				},
			},
		},
	},
	SHARD_PRAYING_MANTIS: {
		// 5% vacuum damage per level
		name: 'Praying Mantis Shard',
		skyblockId: 'SHARD_PRAYING_MANTIS',
		rarity: Rarity.Uncommon,
		wiki: 'https://wiki.hypixel.net/Praying_Mantis',
	},
	SHARD_PEST: {
		// 2% chance for rare pest drops per level
		name: 'Pest Shard',
		skyblockId: 'SHARD_PEST',
		rarity: Rarity.Uncommon,
		wiki: 'https://wiki.hypixel.net/Pest',
	},
	SHARD_MUDWORM: {
		// Garden visitors 1% faster per level
		name: 'Mudworm Shard',
		skyblockId: 'SHARD_MUDWORM',
		rarity: Rarity.Common,
		wiki: 'https://wiki.hypixel.net/Mudworm',
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
