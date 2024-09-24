import { UpgradeableInfo } from '../fortune/upgradable';
import { Rarity, ReforgeTarget, Stat } from './reforges';
import { Skill } from './skills';
import { SpecialCrop } from './specialcrops';
import { Upgrade, UpgradeReason } from './upgrades';

export enum GearSlot {
	Boots = 'Boots',
	Leggings = 'Leggings',
	Chestplate = 'Chestplate',
	Helmet = 'Helmet',
	Necklace = 'Necklace',
	Cloak = 'Cloak',
	Belt = 'Belt',
	Gloves = 'Gloves',
}

export interface FarmingArmorInfo extends UpgradeableInfo {
	special?: SpecialCrop[];
	slot: GearSlot;
	family?: string;
	name: string;
	maxRarity: Rarity;
	upgrade?: Upgrade;
	wiki: string;
	contestStatsMultiplier?: number;
	perLevelStats?: {
		skill: Skill;
		appliesTo?: ReforgeTarget[];
		stats: Partial<Record<Stat, number>>;
	};
	skillReq?: Partial<Record<Skill, number>>;
}

export const ARMOR_INFO: Record<string, FarmingArmorInfo> = {
	FARMER_BOOTS: {
		name: 'Farmer Boots',
		wiki: 'https://wiki.hypixel.net/Farmer_Boots',
		upgrade: {
			id: 'RANCHERS_BOOTS',
			reason: UpgradeReason.NextTier,
		},
		maxRarity: Rarity.Rare,
		slot: GearSlot.Boots,
		gemSlots: {
			peridot: 1,
		},
		skillReq: {
			[Skill.Farming]: 18,
		},
		perLevelStats: {
			skill: Skill.Farming,
			stats: {
				[Stat.FarmingFortune]: 1,
			},
		},
	},
	RANCHERS_BOOTS: {
		name: "Rancher's Boots",
		wiki: 'https://wiki.hypixel.net/Rancher%27s_Boots',
		upgrade: {
			id: 'FERMENTO_BOOTS',
			reason: UpgradeReason.Situational,
			why: 'Fermento Boots provide more farming fortune, with the tradeoff of not being able to control your speed.',
		},
		maxRarity: Rarity.Legendary,
		slot: GearSlot.Boots,
		gemSlots: {
			peridot: 2,
		},
		skillReq: {
			[Skill.Farming]: 21,
		},
		perLevelStats: {
			skill: Skill.Farming,
			stats: {
				[Stat.FarmingFortune]: 1,
			},
		},
	},
	ENCHANTED_JACK_O_LANTERN: {
		name: 'Lantern Helmet',
		wiki: 'https://wiki.hypixel.net/Lantern_Helmet',
		upgrade: {
			id: 'FERMENTO_HELMET',
			reason: UpgradeReason.DeadEnd, 
		},
		maxRarity: Rarity.Rare,
		slot: GearSlot.Helmet,
		gemSlots: {
			peridot: 2,
		},
		skillReq: {
			[Skill.Farming]: 15,
		},
		perLevelStats: {
			skill: Skill.Farming,
			appliesTo: [ReforgeTarget.Axe],
			stats: {
				[Stat.FarmingFortune]: 1,
			},
		},
	},
	FARM_ARMOR_HELMET: {
		name: 'Farm Armor Helmet',
		wiki: 'https://wiki.hypixel.net/Farm_Armor',
		upgrade: {
			id: 'MELON_HELMET',
			reason: UpgradeReason.DeadEnd, 
		},
		family: 'FARM_ARMOR',
		slot: GearSlot.Helmet,
		gemSlots: {
			peridot: 2,
		},
		maxRarity: Rarity.Epic,
		baseStats: {
			[Stat.FarmingFortune]: 10,
		},
		skillReq: {
			[Skill.Farming]: 10,
		},
	},
	FARM_ARMOR_CHESTPLATE: {
		name: 'Farm Armor Chestplate',
		wiki: 'https://wiki.hypixel.net/Farm_Armor',
		upgrade: {
			id: 'MELON_CHESTPLATE',
			reason: UpgradeReason.DeadEnd, 
		},
		family: 'FARM_ARMOR',
		slot: GearSlot.Chestplate,
		maxRarity: Rarity.Epic,
		gemSlots: {
			peridot: 2,
		},
		baseStats: {
			[Stat.FarmingFortune]: 10,
		},
		skillReq: {
			[Skill.Farming]: 10,
		},
	},
	FARM_ARMOR_LEGGINGS: {
		name: 'Farm Armor Leggings',
		wiki: 'https://wiki.hypixel.net/Farm_Armor',
		upgrade: {
			id: 'MELON_LEGGINGS',
			reason: UpgradeReason.DeadEnd, 
		},
		family: 'FARM_ARMOR',
		slot: GearSlot.Leggings,
		maxRarity: Rarity.Epic,
		gemSlots: {
			peridot: 2,
		},
		baseStats: {
			[Stat.FarmingFortune]: 10,
		},
		skillReq: {
			[Skill.Farming]: 10,
		},
	},
	FARM_ARMOR_BOOTS: {
		name: 'Farm Armor Boots',
		wiki: 'https://wiki.hypixel.net/Farm_Armor',
		upgrade: {
			id: 'MELON_BOOTS',
			reason: UpgradeReason.DeadEnd, 
		},
		family: 'FARM_ARMOR',
		slot: GearSlot.Boots,
		maxRarity: Rarity.Epic,
		gemSlots: {
			peridot: 2,
		},
		baseStats: {
			[Stat.FarmingFortune]: 10,
		},
		skillReq: {
			[Skill.Farming]: 10,
		},
	},
	RABBIT_HELMET: {
		name: 'Rabbit Helmet',
		wiki: 'https://wiki.hypixel.net/Rabbit_Armor',
		upgrade: {
			id: 'MELON_HELMET',
			reason: UpgradeReason.DeadEnd, 
		},
		family: 'RABBIT',
		slot: GearSlot.Helmet,
		maxRarity: Rarity.Uncommon,
		gemSlots: {
			peridot: 1,
		},
		baseStats: {
			[Stat.FarmingFortune]: 15,
		},
		skillReq: {
			[Skill.Farming]: 15,
		},
	},
	RABBIT_CHESTPLATE: {
		name: 'Rabbit Chestplate',
		wiki: 'https://wiki.hypixel.net/Rabbit_Armor',
		upgrade: {
			id: 'MELON_CHESTPLATE',
			reason: UpgradeReason.DeadEnd, 
		},
		family: 'RABBIT',
		slot: GearSlot.Chestplate,
		gemSlots: {
			peridot: 1,
		},
		maxRarity: Rarity.Uncommon,
		baseStats: {
			[Stat.FarmingFortune]: 15,
		},
		skillReq: {
			[Skill.Farming]: 15,
		},
	},
	RABBIT_LEGGINGS: {
		name: 'Rabbit Leggings',
		wiki: 'https://wiki.hypixel.net/Rabbit_Armor',
		upgrade: {
			id: 'MELON_LEGGINGS',
			reason: UpgradeReason.DeadEnd, 
		},
		family: 'RABBIT',
		slot: GearSlot.Leggings,
		maxRarity: Rarity.Uncommon,
		gemSlots: {
			peridot: 1,
		},
		baseStats: {
			[Stat.FarmingFortune]: 15,
		},
		skillReq: {
			[Skill.Farming]: 15,
		},
	},
	RABBIT_BOOTS: {
		name: 'Rabbit Boots',
		wiki: 'https://wiki.hypixel.net/Rabbit_Armor',
		upgrade: {
			id: 'MELON_BOOTS',
			reason: UpgradeReason.DeadEnd, 
		},
		family: 'RABBIT',
		slot: GearSlot.Boots,
		maxRarity: Rarity.Uncommon,
		gemSlots: {
			peridot: 1,
		},
		baseStats: {
			[Stat.FarmingFortune]: 15,
		},
		skillReq: {
			[Skill.Farming]: 15,
		},
	},
	MELON_HELMET: {
		name: 'Melon Helmet',
		wiki: 'https://wiki.hypixel.net/Melon_Armor',
		upgrade: {
			id: 'CROPIE_HELMET',
			reason: UpgradeReason.NextTier, 
		},
		family: 'MELON',
		special: [SpecialCrop.Cropie],
		slot: GearSlot.Helmet,
		maxRarity: Rarity.Rare,
		baseStats: {
			[Stat.FarmingFortune]: 15,
		},
		skillReq: {
			[Skill.Farming]: 25,
		},
	},
	MELON_CHESTPLATE: {
		name: 'Melon Chestplate',
		wiki: 'https://wiki.hypixel.net/Melon_Armor',
		upgrade: {
			id: 'CROPIE_CHESTPLATE',
			reason: UpgradeReason.NextTier, 
		},
		family: 'MELON',
		special: [SpecialCrop.Cropie],
		slot: GearSlot.Chestplate,
		maxRarity: Rarity.Rare,
		baseStats: {
			[Stat.FarmingFortune]: 20,
		},
		skillReq: {
			[Skill.Farming]: 25,
		},
	},
	MELON_LEGGINGS: {
		name: 'Melon Leggings',
		wiki: 'https://wiki.hypixel.net/Melon_Armor',
		upgrade: {
			id: 'CROPIE_LEGGINGS',
			reason: UpgradeReason.NextTier, 
		},
		family: 'MELON',
		special: [SpecialCrop.Cropie],
		slot: GearSlot.Leggings,
		maxRarity: Rarity.Rare,
		baseStats: {
			[Stat.FarmingFortune]: 20,
		},
		skillReq: {
			[Skill.Farming]: 25,
		},
	},
	MELON_BOOTS: {
		name: 'Melon Boots',
		wiki: 'https://wiki.hypixel.net/Melon_Armor',
		upgrade: {
			id: 'CROPIE_BOOTS',
			reason: UpgradeReason.NextTier, 
		},
		family: 'MELON',
		special: [SpecialCrop.Cropie],
		slot: GearSlot.Boots,
		maxRarity: Rarity.Rare,
		baseStats: {
			[Stat.FarmingFortune]: 15,
		},
		skillReq: {
			[Skill.Farming]: 25,
		},
	},
	CROPIE_HELMET: {
		name: 'Cropie Helmet',
		wiki: 'https://wiki.hypixel.net/Cropie_Armor',
		upgrade: {
			id: 'SQUASH_HELMET',
			reason: UpgradeReason.NextTier, 
		},
		family: 'CROPIE',
		special: [SpecialCrop.Squash],
		slot: GearSlot.Helmet,
		maxRarity: Rarity.Epic,
		gemSlots: {
			peridot: 1,
		},
		baseStats: {
			[Stat.FarmingFortune]: 20,
		},
		skillReq: {
			[Skill.Farming]: 30,
		},
	},
	CROPIE_CHESTPLATE: {
		name: 'Cropie Chestplate',
		wiki: 'https://wiki.hypixel.net/Cropie_Armor',
		upgrade: {
			id: 'SQUASH_CHESTPLATE',
			reason: UpgradeReason.NextTier, 
		},
		family: 'CROPIE',
		special: [SpecialCrop.Squash],
		slot: GearSlot.Chestplate,
		maxRarity: Rarity.Epic,
		gemSlots: {
			peridot: 1,
		},
		baseStats: {
			[Stat.FarmingFortune]: 25,
		},
		skillReq: {
			[Skill.Farming]: 30,
		},
	},
	CROPIE_LEGGINGS: {
		name: 'Cropie Leggings',
		wiki: 'https://wiki.hypixel.net/Cropie_Armor',
		upgrade: {
			id: 'SQUASH_LEGGINGS',
			reason: UpgradeReason.NextTier, 
		},
		family: 'CROPIE',
		special: [SpecialCrop.Squash],
		slot: GearSlot.Leggings,
		maxRarity: Rarity.Epic,
		gemSlots: {
			peridot: 1,
		},
		baseStats: {
			[Stat.FarmingFortune]: 25,
		},
		skillReq: {
			[Skill.Farming]: 30,
		},
	},
	CROPIE_BOOTS: {
		name: 'Cropie Boots',
		wiki: 'https://wiki.hypixel.net/Cropie_Armor',
		upgrade: {
			id: 'SQUASH_BOOTS',
			reason: UpgradeReason.NextTier, 
		},
		family: 'CROPIE',
		special: [SpecialCrop.Squash],
		slot: GearSlot.Boots,
		maxRarity: Rarity.Epic,
		gemSlots: {
			peridot: 1,
		},
		baseStats: {
			[Stat.FarmingFortune]: 20,
		},
		skillReq: {
			[Skill.Farming]: 30,
		},
	},
	SQUASH_HELMET: {
		name: 'Squash Helmet',
		wiki: 'https://wiki.hypixel.net/Squash_Armor',
		upgrade: {
			id: 'FERMENTO_HELMET',
			reason: UpgradeReason.NextTier, 
		},
		family: 'SQUASH',
		special: [SpecialCrop.Fermento],
		slot: GearSlot.Helmet,
		maxRarity: Rarity.Legendary,
		gemSlots: {
			peridot: 1,
		},
		baseStats: {
			[Stat.FarmingFortune]: 25,
		},
		skillReq: {
			[Skill.Farming]: 35,
		},
	},
	SQUASH_CHESTPLATE: {
		name: 'Squash Chestplate',
		wiki: 'https://wiki.hypixel.net/Squash_Armor',
		upgrade: {
			id: 'FERMENTO_CHESTPLATE',
			reason: UpgradeReason.NextTier, 
		},
		family: 'SQUASH',
		special: [SpecialCrop.Fermento],
		slot: GearSlot.Chestplate,
		maxRarity: Rarity.Legendary,
		gemSlots: {
			peridot: 1,
		},
		baseStats: {
			[Stat.FarmingFortune]: 30,
		},
		skillReq: {
			[Skill.Farming]: 35,
		},
	},
	SQUASH_LEGGINGS: {
		name: 'Squash Leggings',
		wiki: 'https://wiki.hypixel.net/Squash_Armor',
		upgrade: {
			id: 'FERMENTO_LEGGINGS',
			reason: UpgradeReason.NextTier, 
		},
		family: 'SQUASH',
		special: [SpecialCrop.Fermento],
		slot: GearSlot.Leggings,
		maxRarity: Rarity.Legendary,
		gemSlots: {
			peridot: 1,
		},
		baseStats: {
			[Stat.FarmingFortune]: 30,
		},
		skillReq: {
			[Skill.Farming]: 35,
		},
	},
	SQUASH_BOOTS: {
		name: 'Squash Boots',
		wiki: 'https://wiki.hypixel.net/Squash_Armor',
		upgrade: {
			id: 'FERMENTO_BOOTS',
			reason: UpgradeReason.NextTier, 
		},
		family: 'SQUASH',
		special: [SpecialCrop.Fermento],
		slot: GearSlot.Boots,
		maxRarity: Rarity.Legendary,
		gemSlots: {
			peridot: 1,
		},
		baseStats: {
			[Stat.FarmingFortune]: 25,
		},
		skillReq: {
			[Skill.Farming]: 35,
		},
	},
	FERMENTO_HELMET: {
		name: 'Fermento Helmet',
		wiki: 'https://wiki.hypixel.net/Fermento_Armor',
		family: 'FERMENTO',
		special: [SpecialCrop.Cropie, SpecialCrop.Squash, SpecialCrop.Fermento],
		slot: GearSlot.Helmet,
		maxRarity: Rarity.Mythic,
		gemSlots: {
			peridot: 2,
		},
		baseStats: {
			[Stat.FarmingFortune]: 30,
		},
		skillReq: {
			[Skill.Farming]: 40,
		},
	},
	FERMENTO_CHESTPLATE: {
		name: 'Fermento Chestplate',
		wiki: 'https://wiki.hypixel.net/Fermento_Armor',
		family: 'FERMENTO',
		special: [SpecialCrop.Cropie, SpecialCrop.Squash, SpecialCrop.Fermento],
		slot: GearSlot.Chestplate,
		maxRarity: Rarity.Mythic,
		gemSlots: {
			peridot: 2,
		},
		baseStats: {
			[Stat.FarmingFortune]: 35,
		},
		skillReq: {
			[Skill.Farming]: 40,
		},
	},
	FERMENTO_LEGGINGS: {
		name: 'Fermento Leggings',
		wiki: 'https://wiki.hypixel.net/Fermento_Armor',
		family: 'FERMENTO',
		special: [SpecialCrop.Cropie, SpecialCrop.Squash, SpecialCrop.Fermento],
		slot: GearSlot.Leggings,
		maxRarity: Rarity.Mythic,
		gemSlots: {
			peridot: 2,
		},
		baseStats: {
			[Stat.FarmingFortune]: 35,
		},
		skillReq: {
			[Skill.Farming]: 40,
		},
	},
	FERMENTO_BOOTS: {
		name: 'Fermento Boots',
		wiki: 'https://wiki.hypixel.net/Fermento_Armor',
		upgrade: {
			id: 'RANCHERS_BOOTS',
			reason: UpgradeReason.Situational,
			why: 'Rancher\'s Boots provide less farming fortune, but allow you to control your speed for tricky farms.',
		},
		family: 'FERMENTO',
		special: [SpecialCrop.Cropie, SpecialCrop.Squash, SpecialCrop.Fermento],
		slot: GearSlot.Boots,
		maxRarity: Rarity.Mythic,
		gemSlots: {
			peridot: 2,
		},
		baseStats: {
			[Stat.FarmingFortune]: 30,
		},
		skillReq: {
			[Skill.Farming]: 40,
		},
	},
};

export type ArmorSetBonusStats = Partial<Record<number, Partial<Record<Stat, number>>>>;

export interface ArmorSetBonus {
	name: string;
	piecePotential?: Partial<Record<Stat, number>>;
	stats: ArmorSetBonusStats;
	special?: SpecialCrop[];
}

export const ARMOR_SET_BONUS: Record<string, ArmorSetBonus> = {
	RABBIT: {
		name: 'Bonus Farming Fortune',
		stats: {
			4: {
				[Stat.FarmingFortune]: 10,
			},
		},
	},
	MELON: {
		name: 'Cropier Crops',
		piecePotential: {
			[Stat.FarmingFortune]: 10,
		},
		stats: {
			2: {
				[Stat.FarmingFortune]: 10,
			},
			3: {
				[Stat.FarmingFortune]: 20,
			},
			4: {
				[Stat.FarmingFortune]: 30,
			},
		},
		special: [SpecialCrop.Cropie],
	},
	CROPIE: {
		name: 'Squashbuckle',
		piecePotential: {
			[Stat.FarmingFortune]: 15,
		},
		stats: {
			2: {
				[Stat.FarmingFortune]: 15,
			},
			3: {
				[Stat.FarmingFortune]: 30,
			},
			4: {
				[Stat.FarmingFortune]: 45,
			},
		},
		special: [SpecialCrop.Squash],
	},
	SQUASH: {
		name: 'Mento Fermento',
		piecePotential: {
			[Stat.FarmingFortune]: 20,
		},
		stats: {
			2: {
				[Stat.FarmingFortune]: 20,
			},
			3: {
				[Stat.FarmingFortune]: 40,
			},
			4: {
				[Stat.FarmingFortune]: 60,
			},
		},
		special: [SpecialCrop.Fermento],
	},
	FERMENTO: {
		name: 'Feast',
		piecePotential: {
			[Stat.FarmingFortune]: 25,
		},
		stats: {
			2: {
				[Stat.FarmingFortune]: 25,
			},
			3: {
				[Stat.FarmingFortune]: 50,
			},
			4: {
				[Stat.FarmingFortune]: 75,
			},
		},
		special: [SpecialCrop.Cropie, SpecialCrop.Squash, SpecialCrop.Fermento],
	},
};
