import { Crop } from "../constants/crops";
import { Rarity, Reforge, ReforgeTarget } from "../constants/reforges";
import { FortuneUpgrade, Upgrade } from "../constants/upgrades";
import { PlayerOptions } from "../player/player";
import { EliteItemDto } from "./item";

export interface UpgradeableInfo {
	upgrade?: Upgrade;
	wiki?: string;
	gemSlots?: {
		peridot: number;
	};
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

	getUpgrades(): FortuneUpgrade[];
}