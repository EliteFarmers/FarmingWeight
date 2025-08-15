import { Crop } from '../../constants/crops.js';
import { SpecialCrop } from '../../constants/specialcrops.js';

export enum ComposterUpgrade {
	Speed = 'speed',
	MultiDrop = 'multi_drop',
	FuelCap = 'fuel_cap',
	OrganicMatterCap = 'organic_matter_cap',
	CostReduction = 'cost_reduction',
}

export interface ComposterUpgradeCost {
	copper: number;
	specialCrop: SpecialCrop | null;
	specialCropAmount: number;
	crop: Crop;
	cropAmount: number;
}

export const COMPOSTER_UPGRADE_CROPS: Record<ComposterUpgrade, [Crop, Crop]> = {
	[ComposterUpgrade.Speed]: [Crop.Wheat, Crop.Carrot],
	[ComposterUpgrade.MultiDrop]: [Crop.Potato, Crop.Pumpkin],
	[ComposterUpgrade.FuelCap]: [Crop.SugarCane, Crop.Melon],
	[ComposterUpgrade.OrganicMatterCap]: [Crop.Cactus, Crop.CocoaBeans],
	[ComposterUpgrade.CostReduction]: [Crop.Mushroom, Crop.NetherWart],
};

export const API_COMPOSTER_UPGRADE_TO_UPGRADE: Record<string, ComposterUpgrade> = {
	speed: ComposterUpgrade.Speed,
	multi_drop: ComposterUpgrade.MultiDrop,
	fuel_cap: ComposterUpgrade.FuelCap,
	organic_matter_cap: ComposterUpgrade.OrganicMatterCap,
	cost_reduction: ComposterUpgrade.CostReduction,
};

export const LEVEL_REQUIREMENTS = [
	{ level: 1, copper: 100, specialCrop: null, specialCropAmount: 0 },
	{ level: 2, copper: 150, specialCrop: null, specialCropAmount: 0 },
	{ level: 3, copper: 200, specialCrop: null, specialCropAmount: 0 },
	{ level: 4, copper: 250, specialCrop: null, specialCropAmount: 0 },
	{ level: 5, copper: 300, specialCrop: null, specialCropAmount: 0 },
	{ level: 6, copper: 350, specialCrop: null, specialCropAmount: 0 },
	{ level: 7, copper: 400, specialCrop: null, specialCropAmount: 0 },
	{ level: 8, copper: 500, specialCrop: SpecialCrop.Cropie, specialCropAmount: 3 },
	{ level: 9, copper: 600, specialCrop: SpecialCrop.Cropie, specialCropAmount: 6 },
	{ level: 10, copper: 700, specialCrop: SpecialCrop.Cropie, specialCropAmount: 12 },
	{ level: 11, copper: 800, specialCrop: SpecialCrop.Cropie, specialCropAmount: 32 },
	{ level: 12, copper: 900, specialCrop: SpecialCrop.Cropie, specialCropAmount: 64 },
	{ level: 13, copper: 1000, specialCrop: SpecialCrop.Cropie, specialCropAmount: 128 },
	{ level: 14, copper: 1200, specialCrop: SpecialCrop.Squash, specialCropAmount: 3 },
	{ level: 15, copper: 1400, specialCrop: SpecialCrop.Squash, specialCropAmount: 6 },
	{ level: 16, copper: 1600, specialCrop: SpecialCrop.Squash, specialCropAmount: 12 },
	{ level: 17, copper: 1800, specialCrop: SpecialCrop.Squash, specialCropAmount: 32 },
	{ level: 18, copper: 2000, specialCrop: SpecialCrop.Squash, specialCropAmount: 64 },
	{ level: 19, copper: 2250, specialCrop: SpecialCrop.Squash, specialCropAmount: 128 },
	{ level: 20, copper: 2500, specialCrop: SpecialCrop.Fermento, specialCropAmount: 3 },
	{ level: 21, copper: 2750, specialCrop: SpecialCrop.Fermento, specialCropAmount: 6 },
	{ level: 22, copper: 3000, specialCrop: SpecialCrop.Fermento, specialCropAmount: 12 },
	{ level: 23, copper: 3300, specialCrop: SpecialCrop.CondensedFermento, specialCropAmount: 4 },
	{ level: 24, copper: 3600, specialCrop: SpecialCrop.CondensedFermento, specialCropAmount: 7 },
	{ level: 25, copper: 4000, specialCrop: SpecialCrop.CondensedFermento, specialCropAmount: 14 },
];

export function getComposterUpgradeCollectionAmount(upgrade: ComposterUpgrade, level: number) {
	const amount = UPGRADE_CROP_AMOUNTS[upgrade][level]!;

	// if the crop amount is more than 10x the upgrade tier
	// and the upgrade tier is < 8
	// then its counted as a t1 enchanted crop
	return (
		amount *
		getEnchantedCropCollectionAmount(
			getCropFromComposterLevel(upgrade, level)!,
			amount > level * 10 && level < 8 ? 1 : 2
		)
	);
}

export function getEnchantedCropCollectionAmount(crop: Crop, tier: number): number {
	switch (tier) {
		case 1:
			return 160;
		case 2:
			switch (crop) {
				case Crop.Mushroom:
					return 32 * getEnchantedCropCollectionAmount(crop, 1);
				case Crop.CocoaBeans:
				case Crop.Carrot:
					return 128 * getEnchantedCropCollectionAmount(crop, 1);
				default:
					return 160 * getEnchantedCropCollectionAmount(crop, 1);
			}
		default:
			return 0;
	}
}

export function getCropFromComposterLevel(upgrade: ComposterUpgrade, level: number) {
	return COMPOSTER_UPGRADE_CROPS[upgrade][(level + 1) % 2];
}

export const UPGRADE_CROP_AMOUNTS: Record<ComposterUpgrade, Record<number, number>> = {
	[ComposterUpgrade.Speed]: {
		1: 128,
		2: 2,
		3: 256,
		4: 4,
		5: 512,
		6: 8,
		7: 8,
		8: 16,
		9: 16,
		10: 32,
		11: 24,
		12: 48,
		13: 32,
		14: 64,
		15: 48,
		16: 96,
		17: 64,
		18: 128,
		19: 80,
		20: 192,
		21: 104,
		22: 256,
		23: 128,
		24: 320,
		25: 160,
	},
	[ComposterUpgrade.MultiDrop]: {
		1: 1,
		2: 64,
		3: 2,
		4: 1,
		5: 4,
		6: 2,
		7: 8,
		8: 4,
		9: 16,
		10: 8,
		11: 32,
		12: 16,
		13: 48,
		14: 32,
		15: 64,
		16: 48,
		17: 96,
		18: 64,
		19: 128,
		20: 96,
		21: 192,
		22: 128,
		23: 256,
		24: 192,
		25: 320,
	},
	[ComposterUpgrade.FuelCap]: {
		1: 1,
		2: 4,
		3: 2,
		4: 8,
		5: 4,
		6: 16,
		7: 8,
		8: 32,
		9: 16,
		10: 48,
		11: 32,
		12: 64,
		13: 48,
		14: 96,
		15: 64,
		16: 128,
		17: 96,
		18: 192,
		19: 128,
		20: 256,
		21: 192,
		22: 384,
		23: 256,
		24: 512,
		25: 320,
	},
	[ComposterUpgrade.OrganicMatterCap]: {
		1: 1,
		2: 3,
		3: 2,
		4: 6,
		5: 4,
		6: 12,
		7: 7,
		8: 24,
		9: 10,
		10: 48,
		11: 16,
		12: 72,
		13: 24,
		14: 96,
		15: 32,
		16: 144,
		17: 48,
		18: 192,
		19: 64,
		20: 256,
		21: 96,
		22: 352,
		23: 128,
		24: 448,
		25: 160,
	},
	[ComposterUpgrade.CostReduction]: {
		1: 32,
		2: 1,
		3: 2,
		4: 2,
		5: 4,
		6: 4,
		7: 16,
		8: 8,
		9: 32,
		10: 16,
		11: 64,
		12: 32,
		13: 128,
		14: 48,
		15: 256,
		16: 64,
		17: 448,
		18: 96,
		19: 640,
		20: 160,
		21: 832,
		22: 224,
		23: 1024,
		24: 288,
		25: 1216,
	},
};
