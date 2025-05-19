export enum Crop {
	Cactus = 'CACTUS',
	Carrot = 'CARROT_ITEM',
	CocoaBeans = 'INK_SACK:3',
	Melon = 'MELON',
	Mushroom = 'MUSHROOM_COLLECTION',
	NetherWart = 'NETHER_STALK',
	Potato = 'POTATO_ITEM',
	Pumpkin = 'PUMPKIN',
	SugarCane = 'SUGAR_CANE',
	Wheat = 'WHEAT',
	Seeds = 'WHEAT_SEEDS',
}

export const API_CROP_TO_CROP_NAME: Record<string, string> = {
	WHEAT: 'wheat',
	POTATO_ITEM: 'potato',
	CARROT_ITEM: 'carrot',
	MELON: 'melon',
	PUMPKIN: 'pumpkin',
	CACTUS: 'cactus',
	SUGAR_CANE: 'sugarcane',
	INK_SACK: 'cocoa',
	'INK_SACK:3': 'cocoa',
	MUSHROOM_COLLECTION: 'mushroom',
	NETHER_STALK: 'netherwart',
} as const;

export const PROPER_CROP_TO_API_CROP: Record<string, string> = {
	Cactus: 'CACTUS',
	Carrot: 'CARROT_ITEM',
	'Cocoa Beans': 'INK_SACK:3',
	Melon: 'MELON',
	Mushroom: 'MUSHROOM_COLLECTION',
	'Nether Wart': 'NETHER_STALK',
	Potato: 'POTATO_ITEM',
	Pumpkin: 'PUMPKIN',
	'Sugar Cane': 'SUGAR_CANE',
	Wheat: 'WHEAT',
} as const;

export const CROP_TO_MINION: Partial<Record<string, string>> = {
	[Crop.Cactus]: 'CACTUS',
	[Crop.Carrot]: 'CARROT',
	[Crop.CocoaBeans]: 'COCOA',
	[Crop.Melon]: 'MELON',
	[Crop.Mushroom]: 'MUSHROOM',
	[Crop.NetherWart]: 'NETHER_WARTS',
	[Crop.Potato]: 'POTATO',
	[Crop.Pumpkin]: 'PUMPKIN',
	[Crop.SugarCane]: 'SUGAR_CANE',
	[Crop.Wheat]: 'WHEAT',
} as const;

export const ELITE_CROP_TO_CROP: Record<string, Crop> = {
	Cactus: Crop.Cactus,
	Carrot: Crop.Carrot,
	CocoaBeans: Crop.CocoaBeans,
	Melon: Crop.Melon,
	Mushroom: Crop.Mushroom,
	NetherWart: Crop.NetherWart,
	Potato: Crop.Potato,
	Pumpkin: Crop.Pumpkin,
	SugarCane: Crop.SugarCane,
	Wheat: Crop.Wheat,
	Seeds: Crop.Seeds,
} as const;

export const CROP_TO_ELITE_CROP: Record<Crop, string> = {
	[Crop.Cactus]: 'Cactus',
	[Crop.Carrot]: 'Carrot',
	[Crop.CocoaBeans]: 'CocoaBeans',
	[Crop.Melon]: 'Melon',
	[Crop.Mushroom]: 'Mushroom',
	[Crop.NetherWart]: 'NetherWart',
	[Crop.Potato]: 'Potato',
	[Crop.Pumpkin]: 'Pumpkin',
	[Crop.SugarCane]: 'SugarCane',
	[Crop.Wheat]: 'Wheat',
	[Crop.Seeds]: 'Seeds',
} as const;

export const CROP_TO_PROPER_CROP: Record<Crop, string> = {
	[Crop.Cactus]: 'Cactus',
	[Crop.Carrot]: 'Carrot',
	[Crop.CocoaBeans]: 'Cocoa Beans',
	[Crop.Melon]: 'Melon',
	[Crop.Mushroom]: 'Mushroom',
	[Crop.NetherWart]: 'Nether Wart',
	[Crop.Potato]: 'Potato',
	[Crop.Pumpkin]: 'Pumpkin',
	[Crop.SugarCane]: 'Sugar Cane',
	[Crop.Wheat]: 'Wheat',
	[Crop.Seeds]: 'Seeds',
} as const;

export const CROP_UNICODE_EMOJIS: Record<Crop, string> = {
	[Crop.Wheat]: '🌾',
	[Crop.Carrot]: '🥕',
	[Crop.Potato]: '🥔',
	[Crop.Pumpkin]: '🎃',
	[Crop.Melon]: '🍈',
	[Crop.Mushroom]: '🍄',
	[Crop.CocoaBeans]: '🍫',
	[Crop.Cactus]: '🌵',
	[Crop.SugarCane]: '🎋',
	[Crop.NetherWart]: '🌹',
	[Crop.Seeds]: '🌱',
} as const;

export const PROPER_CROP_TO_CROP: Record<string, Crop> = {
	Cactus: Crop.Cactus,
	Carrot: Crop.Carrot,
	'Cocoa Beans': Crop.CocoaBeans,
	Melon: Crop.Melon,
	Mushroom: Crop.Mushroom,
	'Nether Wart': Crop.NetherWart,
	Potato: Crop.Potato,
	Pumpkin: Crop.Pumpkin,
	'Sugar Cane': Crop.SugarCane,
	Wheat: Crop.Wheat,
	Seeds: Crop.Seeds,
} as const;

export const SHORT_NAME_TO_CROP: Record<string, Crop> = {
	cactus: Crop.Cactus,
	carrot: Crop.Carrot,
	cocoa: Crop.CocoaBeans,
	melon: Crop.Melon,
	mushroom: Crop.Mushroom,
	wart: Crop.NetherWart,
	potato: Crop.Potato,
	pumpkin: Crop.Pumpkin,
	cane: Crop.SugarCane,
	wheat: Crop.Wheat,
	seeds: Crop.Seeds,
} as const;

export const FULL_NAME_TO_CROP: Record<string, Crop> = {
	cactus: Crop.Cactus,
	carrot: Crop.Carrot,
	cocoabeans: Crop.CocoaBeans,
	cocoabean: Crop.CocoaBeans,
	melon: Crop.Melon,
	mushroom: Crop.Mushroom,
	netherwart: Crop.NetherWart,
	netherwarts: Crop.NetherWart,
	potato: Crop.Potato,
	pumpkin: Crop.Pumpkin,
	sugarcane: Crop.SugarCane,
	wheat: Crop.Wheat,
	seeds: Crop.Seeds,
} as const;

export const CROP_ID_TO_CROP: Record<string, Crop> = {
	CACTUS: Crop.Cactus,
	CARROT_ITEM: Crop.Carrot,
	'INK_SACK:3': Crop.CocoaBeans,
	MELON: Crop.Melon,
	BROWN_MUSHROOM: Crop.Mushroom,
	RED_MUSHROOM: Crop.Mushroom,
	MUSHROOM_COLLECTION: Crop.Mushroom,
	NETHER_STALK: Crop.NetherWart,
	POTATO_ITEM: Crop.Potato,
	PUMPKIN: Crop.Pumpkin,
	SUGAR_CANE: Crop.SugarCane,
	WHEAT: Crop.Wheat,
	SEEDS: Crop.Seeds,
} as const;

export const CROP_TO_NAME: Record<Crop, string> = {
	[Crop.Cactus]: 'CACTUS',
	[Crop.Carrot]: 'CARROT_ITEM',
	[Crop.CocoaBeans]: 'INK_SACK:3',
	[Crop.Melon]: 'MELON',
	[Crop.Mushroom]: 'BROWN_MUSHROOM',
	[Crop.NetherWart]: 'NETHER_STALK',
	[Crop.Potato]: 'POTATO_ITEM',
	[Crop.Pumpkin]: 'PUMPKIN',
	[Crop.SugarCane]: 'SUGAR_CANE',
	[Crop.Wheat]: 'WHEAT',
	[Crop.Seeds]: 'SEEDS',
} as const;

export const PROPER_CROP_NAMES = Object.values(CROP_TO_PROPER_CROP);

export interface CropInfo {
	name: string;
	npc: number;
	drops: number;
	breaks?: number;
	replenish?: boolean;
	exportable?: boolean;
	startingTool: string;
}

export const CROP_INFO: Record<Crop, CropInfo> = {
	[Crop.Cactus]: {
		name: 'Cactus',
		npc: 4,
		drops: 2,
		breaks: 2,
		startingTool: 'CACTUS_KNIFE',
	},
	[Crop.Carrot]: {
		name: 'Carrot',
		npc: 3,
		drops: 3,
		replenish: true,
		exportable: true,
		startingTool: 'THEORETICAL_HOE_CARROT_1',
	},
	[Crop.CocoaBeans]: {
		name: 'Cocoa Beans',
		npc: 3,
		drops: 3,
		replenish: true,
		exportable: true,
		startingTool: 'COCO_CHOPPER',
	},
	[Crop.Melon]: {
		name: 'Melon',
		npc: 2,
		drops: 5,
		startingTool: 'MELON_DICER',
	},
	[Crop.Mushroom]: {
		name: 'Mushroom',
		npc: 10,
		drops: 1,
		exportable: true,
		startingTool: 'FUNGI_CUTTER',
	},
	[Crop.NetherWart]: {
		name: 'Nether Wart',
		npc: 4,
		drops: 2.5,
		replenish: true,
		startingTool: 'THEORETICAL_HOE_WARTS_1',
	},
	[Crop.Potato]: {
		name: 'Potato',
		npc: 3,
		drops: 3,
		replenish: true,
		startingTool: 'THEORETICAL_HOE_POTATO_1',
	},
	[Crop.Pumpkin]: {
		name: 'Pumpkin',
		npc: 10,
		drops: 1,
		exportable: true,
		startingTool: 'PUMPKIN_DICER',
	},
	[Crop.SugarCane]: {
		name: 'Sugar Cane',
		npc: 4,
		drops: 2,
		breaks: 2,
		startingTool: 'THEORETICAL_HOE_CANE_1',
	},
	[Crop.Wheat]: {
		name: 'Wheat',
		npc: 6,
		drops: 1,
		exportable: true,
		startingTool: 'THEORETICAL_HOE_WHEAT_1',
	},
	[Crop.Seeds]: {
		name: 'Seeds',
		npc: 3,
		drops: 1.5,
		replenish: true,
		startingTool: 'THEORETICAL_HOE_WHEAT_1',
	},
};

// TODO: Calculate this from a list of sources
// Base plus pb fortune
export const MAX_CROP_FORTUNE: Record<Crop, number> = {
	[Crop.Cactus]: 1778,
	[Crop.Carrot]: 2013,
	[Crop.CocoaBeans]: 1842,
	[Crop.Melon]: 1809,
	[Crop.Mushroom]: 1813,
	[Crop.NetherWart]: 1991,
	[Crop.Potato]: 2001,
	[Crop.Pumpkin]: 1821,
	[Crop.SugarCane]: 2001,
	[Crop.Wheat]: 2053,
	[Crop.Seeds]: 2053, // Not a crop, same as wheat
} as const;

export const LIST_OF_CROPS: Exclude<Crop, Crop.Seeds>[] = [
	Crop.Cactus,
	Crop.Carrot,
	Crop.CocoaBeans,
	Crop.Melon,
	Crop.Mushroom,
	Crop.NetherWart,
	Crop.Potato,
	Crop.Pumpkin,
	Crop.SugarCane,
	Crop.Wheat,
];

export const LIST_OF_CROPS_WITH_SEEDS: Crop[] = [...LIST_OF_CROPS, Crop.Seeds];

export const EXPORTABLE_CROP_FORTUNE = 12;
