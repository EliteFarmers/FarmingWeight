import { Stat } from './stats.js';

export const GARDEN_CHIP_MAX_LEVEL = 20 as const;
export const GARDEN_CHIP_WIKI = 'https://wiki.hypixel.net/Garden_Chip' as const;

export type GardenChipId =
	| 'CROPSHOT_GARDEN_CHIP'
	| 'VERMIN_VAPORIZER_GARDEN_CHIP'
	| 'SYNTHESIS_GARDEN_CHIP'
	| 'SOWLEDGE_GARDEN_CHIP'
	| 'MECHAMIND_GARDEN_CHIP'
	| 'HYPERCHARGE_GARDEN_CHIP'
	| 'EVERGREEN_GARDEN_CHIP'
	| 'OVERDRIVE_GARDEN_CHIP'
	| 'QUICKDRAW_GARDEN_CHIP'
	| 'RAREFINDER_GARDEN_CHIP';

export interface GardenChipInfo {
	skyblockId: GardenChipId;
	name: string;
	wiki: string;
	/**
	 * Some chips map cleanly to existing stats. Others are progress-only for now.
	 */
	statsPerLevel?: Partial<Record<Stat, number>>;
}

export const GARDEN_CHIPS: Record<GardenChipId, GardenChipInfo> = {
	CROPSHOT_GARDEN_CHIP: {
		skyblockId: 'CROPSHOT_GARDEN_CHIP',
		name: 'Cropshot Chip',
		wiki: GARDEN_CHIP_WIKI,
		statsPerLevel: {
			[Stat.FarmingFortune]: 3,
		},
	},
	VERMIN_VAPORIZER_GARDEN_CHIP: {
		skyblockId: 'VERMIN_VAPORIZER_GARDEN_CHIP',
		name: 'Vermin Vaporizer Chip',
		wiki: GARDEN_CHIP_WIKI,
		statsPerLevel: {
			[Stat.BonusPestChance]: 3,
		},
	},
	SYNTHESIS_GARDEN_CHIP: {
		skyblockId: 'SYNTHESIS_GARDEN_CHIP',
		name: 'Synthesis Chip',
		wiki: GARDEN_CHIP_WIKI,
	},
	SOWLEDGE_GARDEN_CHIP: {
		skyblockId: 'SOWLEDGE_GARDEN_CHIP',
		name: 'Sowledge Chip',
		wiki: GARDEN_CHIP_WIKI,
		statsPerLevel: {
			[Stat.FarmingWisdom]: 1,
		},
	},
	MECHAMIND_GARDEN_CHIP: {
		skyblockId: 'MECHAMIND_GARDEN_CHIP',
		name: 'Mechamind Chip',
		wiki: GARDEN_CHIP_WIKI,
	},
	HYPERCHARGE_GARDEN_CHIP: {
		skyblockId: 'HYPERCHARGE_GARDEN_CHIP',
		name: 'Hypercharge Chip',
		wiki: GARDEN_CHIP_WIKI,
	},
	EVERGREEN_GARDEN_CHIP: {
		skyblockId: 'EVERGREEN_GARDEN_CHIP',
		name: 'Evergreen Chip',
		wiki: GARDEN_CHIP_WIKI,
	},
	OVERDRIVE_GARDEN_CHIP: {
		skyblockId: 'OVERDRIVE_GARDEN_CHIP',
		name: 'Overdrive Chip',
		wiki: GARDEN_CHIP_WIKI,
	},
	QUICKDRAW_GARDEN_CHIP: {
		skyblockId: 'QUICKDRAW_GARDEN_CHIP',
		name: 'Quickdraw Chip',
		wiki: GARDEN_CHIP_WIKI,
	},
	RAREFINDER_GARDEN_CHIP: {
		skyblockId: 'RAREFINDER_GARDEN_CHIP',
		name: 'Rarefinder Chip',
		wiki: GARDEN_CHIP_WIKI,
	},
};

export function getChipLevel(level?: number | null): number {
	if (!level || level <= 0) return 0;
	return Math.min(Math.max(Math.floor(level), 0), GARDEN_CHIP_MAX_LEVEL);
}
