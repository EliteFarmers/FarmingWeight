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

export interface CropInfo {
	name: string;
	npc: number;
	drops: number;
}

export const CROP_INFO: Record<Crop, CropInfo> = {
	[Crop.Cactus]: {
		name: 'Cactus',
		npc: 3,
		drops: 2,
	},
	[Crop.Carrot]: {
		name: 'Carrot',
		npc: 3,
		drops: 3,
	},
	[Crop.CocoaBeans]: {
		name: 'Cocoa Beans',
		npc: 3,
		drops: 3,
	},
	[Crop.Melon]: {
		name: 'Melon',
		npc: 2,
		drops: 5,
	},
	[Crop.Mushroom]: {
		name: 'Mushroom',
		npc: 10,
		drops: 1,
	},
	[Crop.NetherWart]: {
		name: 'Nether Wart',
		npc: 4,
		drops: 2.5,
	},
	[Crop.Potato]: {
		name: 'Potato',
		npc: 3,
		drops: 3,
	},
	[Crop.Pumpkin]: {
		name: 'Pumpkin',
		npc: 10,
		drops: 1,
	},
	[Crop.SugarCane]: {
		name: 'Sugar Cane',
		npc: 2,
		drops: 4,
	},
	[Crop.Wheat]: {
		name: 'Wheat',
		npc: 6,
		drops: 1,
	},
	[Crop.Seeds]: {
		name: 'Seeds',
		npc: 3,
		drops: 1.5,
	},
};

// TODO: Calculate this from a list of sources
export const MAX_CROP_FORTUNE: Record<Crop, number> = {
	[Crop.Cactus]: 1575,
	[Crop.Carrot]: 1784,
	[Crop.CocoaBeans]: 1584,
	[Crop.Melon]: 1567.8,
	[Crop.Mushroom]: 1603,
	[Crop.NetherWart]: 1772,
	[Crop.Potato]: 1772,
	[Crop.Pumpkin]: 1567.5,
	[Crop.SugarCane]: 1772,
	[Crop.Wheat]: 1772,
	[Crop.Seeds]: 1772, // Not a crop, same as wheat
};
