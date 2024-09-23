import { PlayerOptions } from '../player/player';
import { Crop } from './crops';
import { CROP_MILESTONES, GARDEN_VISITORS } from './garden';
import { ReforgeTarget, Stat } from './reforges';

export interface FarmingEnchant {
	name: string;
	appliesTo: readonly ReforgeTarget[];
	wiki: string;
	minLevel: number;
	maxLevel: number;
	cropSpecific?: Crop;
	levels?: Record<number, Partial<Record<Stat, number>>>;
	computed?: Record<number, Partial<Record<Stat, (opt: PlayerOptions) => number>>>;
	cropComputed?: Record<number, Partial<Record<Stat, (crop: Crop, opt?: PlayerOptions) => number>>>;
	maxStats?: Partial<Record<Stat, number>>;
	levelRequirement?: number;
}

const turboEnchant = {
	appliesTo: [ReforgeTarget.Hoe, ReforgeTarget.Axe],
	minLevel: 1,
	maxLevel: 5,
	levels: {
		1: {
			[Stat.FarmingFortune]: 5
		},
		2: {
			[Stat.FarmingFortune]: 10
		},
		3: {
			[Stat.FarmingFortune]: 15
		},
		4: {
			[Stat.FarmingFortune]: 20
		},
		5: {
			[Stat.FarmingFortune]: 25
		},
	},
}

export const FARMING_ENCHANTS: Record<string, FarmingEnchant> = {
	harvesting: {
		name: 'Harvesting',
		appliesTo: [ReforgeTarget.Hoe],
		wiki: 'https://wiki.hypixel.net/Harvesting_Enchantment',
		levelRequirement: 2,
		minLevel: 1,
		maxLevel: 6,
		levels: {
			1: {
				[Stat.FarmingFortune]: 12.5,
			},
			2: {
				[Stat.FarmingFortune]: 25,
			},
			3: {
				[Stat.FarmingFortune]: 37.5,
			},
			4: {
				[Stat.FarmingFortune]: 50,
			},
			5: {
				[Stat.FarmingFortune]: 62.5,
			},
			6: {
				[Stat.FarmingFortune]: 75,
			},
		},
	},
	cultivating: {
		name: 'Cultivating',
		appliesTo: [ReforgeTarget.Hoe, ReforgeTarget.Axe],
		wiki: 'https://wiki.hypixel.net/Cultivating_Enchantment',
		minLevel: 1,
		maxLevel: 10,
		levels: {
			1: {
				[Stat.FarmingWisdom]: 1,
				[Stat.FarmingFortune]: 2,
			},
			2: {
				[Stat.FarmingWisdom]: 2,
				[Stat.FarmingFortune]: 4,
			},
			3: {
				[Stat.FarmingWisdom]: 3,
				[Stat.FarmingFortune]: 6,
			},
			4: {
				[Stat.FarmingWisdom]: 4,
				[Stat.FarmingFortune]: 8,
			},
			5: {
				[Stat.FarmingWisdom]: 5,
				[Stat.FarmingFortune]: 10,
			},
			6: {
				[Stat.FarmingWisdom]: 6,
				[Stat.FarmingFortune]: 12,
			},
			7: {
				[Stat.FarmingWisdom]: 7,
				[Stat.FarmingFortune]: 14,
			},
			8: {
				[Stat.FarmingWisdom]: 8,
				[Stat.FarmingFortune]: 16,
			},
			9: {
				[Stat.FarmingWisdom]: 9,
				[Stat.FarmingFortune]: 18,
			},
			10: {
				[Stat.FarmingWisdom]: 10,
				[Stat.FarmingFortune]: 20,
			},
		},
	},
	dedication: {
		name: 'Dedication',
		appliesTo: [ReforgeTarget.Hoe, ReforgeTarget.Axe],
		wiki: 'https://wiki.hypixel.net/Dedication_Enchantment',
		minLevel: 1,
		maxLevel: 4,
		cropComputed: {
			1: {
				[Stat.FarmingFortune]: (crop, opt) => {
					if (!crop) return 0;
					return 0.5 * (opt?.milestones?.[crop] ?? 0);
				},
			},
			2: {
				[Stat.FarmingFortune]: (crop, opt) => {
					if (!crop) return 0;
					return 0.75 * (opt?.milestones?.[crop] ?? 0);
				},
			},
			3: {
				[Stat.FarmingFortune]: (crop, opt) => {
					if (!crop) return 0;
					return 1 * (opt?.milestones?.[crop] ?? 0);
				},
			},
			4: {
				[Stat.FarmingFortune]: (crop, opt) => {
					if (!crop) return 0;
					return 2 * (opt?.milestones?.[crop] ?? 0);
				},
			},
		},
		maxStats: {
			[Stat.FarmingFortune]: 2 * CROP_MILESTONES[Crop.Wheat].length,
		},
	},
	sunder: {
		name: 'Sunder',
		appliesTo: [ReforgeTarget.Axe],
		wiki: 'https://wiki.hypixel.net/Sunder_Enchantment',
		minLevel: 1,
		maxLevel: 6,
		levels: {
			1: {
				[Stat.FarmingFortune]: 12.5,
			},
			2: {
				[Stat.FarmingFortune]: 25,
			},
			3: {
				[Stat.FarmingFortune]: 37.5,
			},
			4: {
				[Stat.FarmingFortune]: 50,
			},
			5: {
				[Stat.FarmingFortune]: 62.5,
			},
			6: {
				[Stat.FarmingFortune]: 75,
			},
		},
	},
	pesterminator: {
		name: 'Pesterminator',
		appliesTo: [ReforgeTarget.Armor],
		wiki: 'https://wiki.hypixel.net/Pesterminator_Enchantment',
		levelRequirement: 10,
		minLevel: 1,
		maxLevel: 5,
		levels: {
			1: {
				[Stat.FarmingFortune]: 1,
				[Stat.BonusPestChance]: 2,
			},
			2: {
				[Stat.FarmingFortune]: 2,
				[Stat.BonusPestChance]: 4,
			},
			3: {
				[Stat.FarmingFortune]: 3,
				[Stat.BonusPestChance]: 6,
			},
			4: {
				[Stat.FarmingFortune]: 4,
				[Stat.BonusPestChance]: 8,
			},
			5: {
				[Stat.FarmingFortune]: 5,
				[Stat.BonusPestChance]: 10,
			},
		},
	},
	green_thumb: {
		name: 'Green Thumb',
		appliesTo: [ReforgeTarget.Equipment],
		wiki: 'https://wiki.hypixel.net/Green_Thumb_Enchantment',
		levelRequirement: 24,
		minLevel: 1,
		maxLevel: 5,
		computed: {
			1: {
				[Stat.FarmingFortune]: (opt) => {
					return 0.05 * (opt.uniqueVisitors ?? 0);
				},
			},
			2: {
				[Stat.FarmingFortune]: (opt) => {
					return 0.1 * (opt.uniqueVisitors ?? 0);
				},
			},
			3: {
				[Stat.FarmingFortune]: (opt) => {
					return 0.15 * (opt.uniqueVisitors ?? 0);
				},
			},
			4: {
				[Stat.FarmingFortune]: (opt) => {
					return 0.2 * (opt.uniqueVisitors ?? 0);
				},
			},
			5: {
				[Stat.FarmingFortune]: (opt) => {
					return 0.25 * (opt.uniqueVisitors ?? 0);
				},
			},
		},
		maxStats: {
			[Stat.FarmingFortune]: 0.25 * Object.keys(GARDEN_VISITORS).length,
		},
	},
	turbo_cactus: {
		name: 'Turbo-Cacti',
		wiki: 'https://wiki.hypixel.net/Turbo-Cacti_Enchantment',
		cropSpecific: Crop.Cactus,
		...turboEnchant
	},
	turbo_cane: {
		name: 'Turbo-Cane',
		wiki: 'https://wiki.hypixel.net/Turbo-Cane_Enchantment',
		cropSpecific: Crop.SugarCane,
		...turboEnchant
	},
	turbo_carrot: {
		name: 'Turbo-Carrot',
		wiki: 'https://wiki.hypixel.net/Turbo-Carrot_Enchantment',
		cropSpecific: Crop.Carrot,
		...turboEnchant
	},
	turbo_coco: {
		name: 'Turbo-Cocoa',
		wiki: 'https://wiki.hypixel.net/Turbo-Cocoa_Enchantment',
		cropSpecific: Crop.CocoaBeans,
		...turboEnchant
	},
	turbo_melon: {
		name: 'Turbo-Melon',
		wiki: 'https://wiki.hypixel.net/Turbo-Melon_Enchantment',
		cropSpecific: Crop.Melon,
		...turboEnchant
	},
	turbo_mushrooms: {
		name: 'Turbo-Mushrooms',
		wiki: 'https://wiki.hypixel.net/Turbo-Mushrooms_Enchantment',
		cropSpecific: Crop.Mushroom,
		...turboEnchant
	},
	turbo_potato: {
		name: 'Turbo-Potato',
		wiki: 'https://wiki.hypixel.net/Turbo-Potato_Enchantment',
		cropSpecific: Crop.Potato,
		...turboEnchant
	},
	turbo_pumpkin: {
		name: 'Turbo-Pumpkin',
		wiki: 'https://wiki.hypixel.net/Turbo-Pumpkin_Enchantment',
		cropSpecific: Crop.Pumpkin,
		...turboEnchant
	},
	turbo_warts: {
		name: 'Turbo-Warts',
		wiki: 'https://wiki.hypixel.net/Turbo-Warts_Enchantment',
		cropSpecific: Crop.NetherWart,
		...turboEnchant
	},
	turbo_wheat: {
		name: 'Turbo-Wheat',
		wiki: 'https://wiki.hypixel.net/Turbo-Wheat_Enchantment',
		cropSpecific: Crop.Wheat,
		...turboEnchant
	},
} as const;
