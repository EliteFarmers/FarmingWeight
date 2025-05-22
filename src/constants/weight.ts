import { Crop } from './crops.js';

// https://api.elitebot.dev/weights
export const CROP_WEIGHT: Record<Crop, number> = {
	[Crop.Cactus]: 178_730.65,
	[Crop.Carrot]: 300_000,
	[Crop.CocoaBeans]: 276_733.75,
	[Crop.Melon]: 488_435.88,
	[Crop.Mushroom]: 90_944.27,
	[Crop.NetherWart]: 248_606.81,
	[Crop.Potato]: 298_328.17,
	[Crop.Pumpkin]: 99_236.12,
	[Crop.SugarCane]: 198_885.45,
	[Crop.Wheat]: 100_000,
	[Crop.Seeds]: 0, // Byproduct of wheat farming, not counted
};

export const TIER_12_MINIONS: readonly string[] = [
	'WHEAT_12',
	'CARROT_12',
	'POTATO_12',
	'PUMPKIN_12',
	'MELON_12',
	'MUSHROOM_12',
	'COCOA_12',
	'CACTUS_12',
	'SUGAR_CANE_12',
	'NETHER_WARTS_12',
] as const;

export const BONUS_WEIGHT = {
	Farming60Bonus: 250,
	Farming50Bonus: 100,
	AnitaBuffBonusMultiplier: 2,
	GoldMedalRewardInterval: 50,
	MinionRewardTier: 12,
	MinionRewardWeight: 5,
	MaxMedalsCounted: 1000,
	WeightPerDiamondMedal: 0.75,
	WeightPerPlatinumMedal: 0.5,
	WeightPerGoldMedal: 0.25,
} as const;

// Rewards for farming level
export const FARMING_LEVEL_50_BONUS = 100;
export const FARMING_LEVEL_60_BONUS = 250;
// Contest medal bonuses
export const MAX_MEDAL_BONUS = 1000;
export const WEIGHT_PER_DIAMOND_MEDAL = 0.75;
export const WEIGHT_PER_PLATINUM_MEDAL = 0.5;
export const WEIGHT_PER_GOLD_MEDAL = 0.25;
// Get 5 bonus weight for every tier 12 farming minion
export const MINION_REWARD_AT_TIER = 12;
export const MINION_REWARD_WEIGHT = 5;

export const PROPER_BONUS_NAME: Partial<Record<string, string>> = {
	minions: 'Tier 12 Minions',
	medals: 'Gold Medals',
	farminglevel: 'Farming Level',
	anita: 'Anita Buff',
};
