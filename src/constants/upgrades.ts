import type { EliteItemDto } from '../fortune/item.js';
import type { UpgradeableInfo } from '../fortune/upgradeable.js';
import type { GearSlot } from '../items/armor.js';
import type { FARMING_TOOLS } from '../items/tools.js';
import type { JacobContestMedal } from '../util/jacob.js';
import type { Crop } from './crops.js';
import type { Stat } from './stats.js';

export enum UpgradeReason {
	NextTier = 'next', // Standard upgrade
	DeadEnd = 'dead', // Not worth using, no more upgrades
	Situational = 'situational', // Worth using in some situations
}

// export interface UpgradeCost {
// 	items: Record<string, number>;
// 	coins?: number;
// 	copper?: number;
// }

export interface FortuneSource {
	name: string;
	fortunePerLevel: number;
	cropSpecific?: boolean;
	maxLevel: number;
	wiki: string;
	statsPerLevel?: Partial<Record<Stat, number>>;
	upgradeCosts?: Partial<Record<number, UpgradeCost>>;
}

export interface FortuneSourceProgress {
	name: string;
	fortune: number;
	ratio: number;
	maxLevel?: number;
	fortunePerLevel?: number;
	maxFortune: number;
	wiki?: string;
	upgrades?: FortuneUpgrade[];
	progress?: FortuneSourceProgress[];
	item?: EliteItemDto;
	info?: UpgradeableInfo;
	nextInfo?: UpgradeableInfo;
	maxInfo?: UpgradeableInfo;
	api?: boolean;
	active?: {
		active: boolean;
		reason?: string;
		fortune?: number;
	};
}

export interface UpgradeCost {
	items?: Record<string, number>;
	coins?: number;
	copper?: number;
	bits?: number;
	medals?: Partial<Record<Exclude<JacobContestMedal, 'platinum' | 'diamond'>, number>>;
	applyCost?: Omit<UpgradeCost, 'applyCost'>;
}

export function mergeCost(...costs: UpgradeCost[]): UpgradeCost {
	const result: UpgradeCost = {};
	for (const cost of costs) {
		addCost(result, cost);
	}
	return result;
}

function addCost(left: UpgradeCost, right: UpgradeCost) {
	if (right.items) {
		left.items ??= {};
		for (const [key, value] of Object.entries(right.items)) {
			left.items[key] = (left.items[key] || 0) + value;
		}
	}

	if (right.coins) {
		left.coins = (left.coins || 0) + (right.coins || 0);
	}
	if (right.copper) {
		left.copper = (left.copper || 0) + (right.copper || 0);
	}
	if (right.bits) {
		left.bits = (left.bits || 0) + (right.bits || 0);
	}

	if (right.medals) {
		left.medals ??= {};
		for (const [key, value] of Object.entries(right.medals) as [keyof typeof left.medals, number][]) {
			left.medals[key] = (left.medals[key] || 0) + value;
		}
	}

	if (right.applyCost) {
		left.applyCost = addCost(left.applyCost || {}, right.applyCost);
	}

	return left;
}

export enum UpgradeCategory {
	Enchant = 'enchantment',
	Rarity = 'rarity',
	Item = 'item',
	Gem = 'gem',
	Reforge = 'reforge',
	Plot = 'plot',
	Skill = 'skill',
	CommunityCenter = 'community_center',
	Anita = 'anita',
	Misc = 'misc',
	Attribute = 'attribute',
	Composter = 'composter',
}

export enum UpgradeAction {
	Apply = 'apply',
	Recombobulate = 'recombobulate',
	LevelUp = 'levelup',
	Purchase = 'purchase',
	Consume = 'consume',
	Upgrade = 'upgrade',
	Unlock = 'unlock',
}

export interface UpgradeInfoImprovement<T> {
	name: string;
	output: T;
}

export interface FortuneUpgradeImprovement {
	name: string;
	fortune: number;
}

export interface UpgradeInfo<T> {
	title: string;
	onto?: {
		name?: string | null;
		skyblockId?: string | null;
		slot?: GearSlot;
	};
	max?: T;
	increase: T;
	action: UpgradeAction;
	purchase?: string;
	category: UpgradeCategory;
	optional?: boolean;
	api?: boolean;
	repeatable?: number;
	deadEnd?: boolean;
	cost?: UpgradeCost;
	wiki?: string;
	improvements?: UpgradeInfoImprovement<T>[];
}

export interface FortuneUpgrade {
	title: string;
	onto?: {
		name?: string | null;
		skyblockId?: string | null;
		slot?: GearSlot;
	};
	max?: number;
	increase: number;
	action: UpgradeAction;
	purchase?: string;
	category: UpgradeCategory;
	optional?: boolean;
	api?: boolean;
	repeatable?: number;
	deadEnd?: boolean;
	cost?: UpgradeCost;
	wiki?: string;
	improvements?: FortuneUpgradeImprovement[];
	// upgrade: Upgrade;
}

export interface Upgrade {
	id: string;
	reason: UpgradeReason;
	cost?: UpgradeCost;
	why?: string;
	preferred?: boolean;
}

export interface InitialItems {
	tools: Partial<Record<Crop, keyof typeof FARMING_TOOLS>>;
	armor: Record<GearSlot, string | string[]>;
	pets: string[];
}
