import type { Crop } from '../constants/crops.js';
import { Rarity, REFORGES, type Reforge, type ReforgeTarget, type ReforgeTier } from '../constants/reforges.js';
import type { Stat } from '../constants/stats.js';
import type { FortuneSourceProgress, FortuneUpgrade, Upgrade } from '../constants/upgrades.js';
import type { PlayerOptions } from '../player/playeroptions.js';
import { getItemUpgrades, getLastItemUpgradeableTo, getNextItemUpgradeableTo } from '../upgrades/upgrades.js';
import { getRarityFromLore, previousRarity } from '../util/itemstats.js';
import type { EliteItemDto } from './item.js';
import type { Upgradeable, UpgradeableInfo } from './upgradeable.js';

export class UpgradeableBase implements Upgradeable {
	public item: EliteItemDto;
	public info: UpgradeableInfo;

	private _type?: ReforgeTarget | undefined;
	public get type(): ReforgeTarget | undefined {
		return this._type;
	}
	public set type(value: ReforgeTarget | undefined) {
		this._type = value;
	}

	public crop?: Crop;
	public options?: PlayerOptions;

	public recombobulated: boolean;
	public rarity: Rarity;
	public reforge?: Reforge | undefined;
	public reforgeStats?: ReforgeTier | undefined;

	public fortune: number;

	private items: Partial<Record<string, UpgradeableInfo>>;

	constructor(options: {
		item: EliteItemDto;
		options?: PlayerOptions;
		items: Partial<Record<string, UpgradeableInfo>>;
	}) {
		this.item = options.item;
		const info = options.items[options.item.skyblockId as keyof typeof options.items];
		if (!info) {
			throw new Error(`Unknown item: ${options.item.name} (${options.item.skyblockId})`);
		}
		this.info = info;
		this.options = options.options;
		this.items = options.items;

		if (this.item.lore) {
			this.rarity = getRarityFromLore(this.item.lore);
		} else {
			this.rarity = previousRarity(this.info.maxRarity);
			this.rarity ??= Rarity.Common;
		}

		this.reforge = REFORGES[options.item.attributes?.modifier ?? ''] ?? undefined;
		this.reforgeStats = this.reforge?.tiers?.[this.rarity];

		this.recombobulated = this.item.attributes?.rarity_upgrades === '1';
		this.fortune = 0;
	}

	getFortune(): number {
		return this.fortune;
	}

	getCalculatedStats(): Partial<Record<Stat, number>> {
		if (!this.info.computedStats || !this.options) return {};
		return this.info.computedStats?.(this.options) ?? {};
	}

	getUpgrades(): FortuneUpgrade[] {
		return getItemUpgrades(this);
	}

	getProgress(): FortuneSourceProgress[] {
		return [];
	}

	getItemUpgrade(): Upgrade | undefined {
		return this.info.upgrade;
	}

	getNextItemUpgrade(): { upgrade: Upgrade; info: UpgradeableInfo } | undefined {
		return getNextItemUpgradeableTo(this, this.items);
	}

	getLastItemUpgrade(): { upgrade: Upgrade; info: UpgradeableInfo } | undefined {
		return getLastItemUpgradeableTo(this, this.items);
	}
}
