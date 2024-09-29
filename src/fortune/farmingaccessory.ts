import { FARMING_ACCESSORIES_INFO, FarmingAccessoryInfo } from '../constants/accessories';
import { Rarity } from '../constants/reforges';
import { Stat } from "../constants/stats";
import { FortuneSourceProgress } from '../constants/upgrades';
import { PlayerOptions } from '../player/player';
import { getLastItemUpgrade, getUpgrades } from '../upgrades/upgrades';
import { getPeridotFortune } from '../util/gems';
import { getRarityFromLore } from '../util/itemstats';
import { EliteItemDto } from './item';
import { Upgradeable, UpgradeableInfo } from './upgradable';

export class FarmingAccessory implements Upgradeable {
	public declare readonly item: EliteItemDto;
	public declare readonly info: FarmingAccessoryInfo;

	public declare readonly rarity: Rarity;
	public declare readonly recombobulated: boolean;

	public declare fortune: number;
	public declare fortuneBreakdown: Record<string, number>;

	public declare options?: PlayerOptions;

	constructor(item: EliteItemDto, options?: PlayerOptions) {
		this.item = item;
		this.options = options;

		const info = FARMING_ACCESSORIES_INFO[item.skyblockId as keyof typeof FARMING_ACCESSORIES_INFO];
		if (!info) {
			throw new Error(`Unknown accessory: ${item.name} (${item.skyblockId})`);
		}
		this.info = info;

		if (item.lore) {
			this.rarity = getRarityFromLore(item.lore);
		}

		this.recombobulated = this.item.attributes?.rarity_upgrades === '1';

		this.getFortune();
	}

	getUpgrades() {
		return getUpgrades(this);
	}

	getItemUpgrade() {
		return this.info.upgrade;
	}

	getLastItemUpgrade() {
		return getLastItemUpgrade(this, FARMING_ACCESSORIES_INFO);
	}

	getProgress(): FortuneSourceProgress[] {
		return [];
	}

	getFortune() {
		this.fortuneBreakdown = {};
		let sum = 0;

		// Base fortune
		const base = this.info.baseStats?.[Stat.FarmingFortune] ?? 0;
		if (base > 0) {
			this.fortuneBreakdown['Base Stats'] = base;
			sum += base;
		}

		// Gems
		let peridot = getPeridotFortune(this.rarity, this.item);
		if (peridot > 0) {
			peridot = +(peridot / 2).toFixed(2); // Only half the fortune is applied on accessories

			this.fortuneBreakdown['Peridot Gems'] = peridot;
			sum += peridot;
		}

		this.fortune = sum;
		return sum;
	}

	static isValid(item: EliteItemDto): boolean {
		return FARMING_ACCESSORIES_INFO[item.skyblockId as keyof typeof FARMING_ACCESSORIES_INFO] !== undefined;
	}

	static fromArray(items: EliteItemDto[]): FarmingAccessory[] {
		return items
			.filter((item) => FarmingAccessory.isValid(item))
			.map((item) => new FarmingAccessory(item))
			.sort((a, b) => b.fortune - a.fortune);
	}

	static fakeItem(info: UpgradeableInfo, options?: PlayerOptions): FarmingAccessory | undefined {
		const fake: EliteItemDto = {
			name: 'Fake Item',
			skyblockId: info.skyblockId,
			lore: [],
			attributes: {},
			enchantments: {},
		};

		if (!FarmingAccessory.isValid(fake)) return undefined;

		return new FarmingAccessory(fake, options);
	}
}
