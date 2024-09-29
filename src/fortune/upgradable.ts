import { Crop } from "../constants/crops";
import { Rarity, Reforge, ReforgeTarget } from "../constants/reforges";
import { Stat } from "../constants/stats";
import { FortuneSourceProgress, FortuneUpgrade, Upgrade } from "../constants/upgrades";
import { PlayerOptions } from "../player/player";
import { EliteItemDto } from "./item";

export interface UpgradeableInfo {
	upgrade?: Upgrade;
	wiki?: string;
	gemSlots?: {
		peridot: number;
	};
	maxRarity: Rarity;
	stats?: Partial<Record<Rarity, Partial<Record<Stat, number>>>>;
	baseStats?: Partial<Record<Stat, number>>;
}

export interface Upgradeable {
	item: EliteItemDto;
	info: UpgradeableInfo;
	type?: ReforgeTarget;
	crop?: Crop;
	options?: PlayerOptions;

	recombobulated: boolean;
	rarity: Rarity;
	reforge?: Reforge | undefined;

	fortune: number;

	getFortune(): number;
	getUpgrades(): FortuneUpgrade[];
	getItemUpgrade(): Upgrade | undefined;
	getLastItemUpgrade(): { upgrade: Upgrade, info: UpgradeableInfo } | undefined;
	getProgress(): FortuneSourceProgress[];
}