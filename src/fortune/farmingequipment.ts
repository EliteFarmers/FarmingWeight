import { FarmingArmorInfo } from '../constants/armor';
import { FARMING_ENCHANTS } from '../constants/enchants';
import { EQUIPMENT_INFO } from '../constants/equipment';
import { REFORGES, Rarity, Reforge, ReforgeTarget, ReforgeTier, Stat } from '../constants/reforges';
import { getRarityFromLore } from '../util/itemstats';
import { extractNumberFromLine } from '../util/lore';
import { EliteItemDto } from './item';
import { PlayerOptions, ZorroMode } from '../player/player';
import { Upgradeable } from './upgradable';
import { getUpgrades } from '../upgrades/upgrades';
import { getFortuneFromEnchant } from '../util/enchants';

export class FarmingEquipment implements Upgradeable {
	public readonly item: EliteItemDto;
	public readonly info: FarmingArmorInfo;
	public readonly type = ReforgeTarget.Equipment;

	public get slot() {
		return this.info.slot;
	}

	public declare readonly rarity: Rarity;
	public declare readonly reforge: Reforge | undefined;
	public declare readonly reforgeStats: ReforgeTier | undefined;
	public declare readonly recombobulated: boolean;

	public declare fortune: number;
	public declare fortuneBreakdown: Record<string, number>;
	public declare options?: PlayerOptions;

	constructor(item: EliteItemDto, options?: PlayerOptions) {
		this.options = options;
		this.item = item;

		const info = EQUIPMENT_INFO[item.skyblockId as keyof typeof EQUIPMENT_INFO];
		if (!info) {
			throw new Error(`Unknown equipment: ${item.name} (${item.skyblockId})`);
		}
		this.info = info;

		if (item.lore) {
			this.rarity = getRarityFromLore(item.lore);
		}

		this.reforge = REFORGES[item.attributes?.modifier ?? ''] ?? undefined;
		this.reforgeStats = this.reforge?.tiers?.[this.rarity];
		this.recombobulated = this.item.attributes?.rarity_upgrades === '1';

		this.getFortune();
	}

	getUpgrades() {
		return getUpgrades(this);
	}

	setOptions(options: PlayerOptions) {
		this.options = options;
		this.getFortune();
	}

	getFortune() {
		this.fortuneBreakdown = {};
		let sum = 0;

		// Base fortune
		const base = this.info.stats?.[Stat.FarmingFortune] ?? 0;
		if (base > 0) {
			this.fortuneBreakdown['Base Stats'] = base;
			sum += base;
		}

		// Reforge
		const reforge = this.reforgeStats?.stats?.[Stat.FarmingFortune] ?? 0;
		if (reforge > 0) {
			this.fortuneBreakdown['Reforge'] = reforge;
			sum += reforge;
		}

		// Enchantments
		for (const [key, level] of Object.entries(this.item.enchantments ?? {})) {
			const enchant = FARMING_ENCHANTS[key];
			if (!enchant || !level || enchant.cropSpecific) continue;
			
			const fortune = getFortuneFromEnchant(level, enchant, this.options);
			if (fortune > 0) {
				this.fortuneBreakdown[enchant.name] = fortune;
				sum += fortune;
			}
		}

		// Lotus Piece Specific
		if (this.info.family === 'LOTUS') {
			// Green thumb from lore as a fallback
			if (!this.options?.uniqueVisitors) {
				const visitors = this.getFortuneFromVisitors(base, reforge);
				if (visitors > 0) {
					this.fortuneBreakdown['Green Thumb'] = visitors;
					sum += visitors;
				}
			}

			// Salesperson lotus piece bonus
			const pieceBonus = this.getPieceBonus();
			if (pieceBonus > 0) {
				this.fortuneBreakdown['Salesperson'] = pieceBonus;
				sum += pieceBonus;
			}
		}

		if (this.item.skyblockId === 'ZORROS_CAPE') {
			// If Zorro is disabled, set fortune to 0
			if (this.options?.zorro?.enabled === false) {
				this.fortune = 0;
				return 0;
			}

			// Zorro's Cape
			const zorro = this.options?.zorro ?? {
				enabled: true,
				mode: ZorroMode.Normal
			};

			switch (zorro.mode) {
				case ZorroMode.Averaged:
					sum *= 1.3333;
					for (const key in this.fortuneBreakdown) {
						if (this.fortuneBreakdown[key] === undefined) continue;
						this.fortuneBreakdown[key] *= 1.3333;
					}
					break;
				case ZorroMode.Contest:
					sum *= 2;
					for (const key in this.fortuneBreakdown) {
						if (this.fortuneBreakdown[key] === undefined) continue;
						this.fortuneBreakdown[key] *= 2;
					}
					break;
				case ZorroMode.Normal:
				default:
					break;
			}
		}

		this.fortune = sum;
		return sum;
	}

	private getFortuneFromVisitors(base: number, reforge: number): number {
		if (!this.item.enchantments?.green_thumb) return 0;

		const regex = /§7Farming Fortune: §a\+(\d+.?\d+)/g;
		let found = 0;

		for (const line of this.item.lore ?? []) {
			const number = extractNumberFromLine(line, regex) ?? 0;
			if (!number) continue;

			found = +number;
			break;
		}

		if (found === 0) return 0;
		return Math.max(0, found - base - reforge);
	}

	private getPieceBonus(): number {
		const regex = /§7Piece Bonus: §6\+(\d+)☘/g;
		let found = 0;

		for (const line of (this.item.lore ?? []).reverse()) {
			const number = extractNumberFromLine(line, regex) ?? 0;
			if (!number) continue;

			found = number;
			break;
		}

		return found;
	}

	static isValid(item: EliteItemDto): boolean {
		return EQUIPMENT_INFO[item.skyblockId as keyof typeof EQUIPMENT_INFO] !== undefined;
	}

	static fromArray(items: EliteItemDto[], options?: PlayerOptions): FarmingEquipment[] {
		return items
			.filter((item) => FarmingEquipment.isValid(item))
			.map((item) => new FarmingEquipment(item, options))
			.sort((a, b) => b.fortune - a.fortune);
	}
}

// For backwards compatibility
// eslint-disable-next-line @typescript-eslint/naming-convention
export const LotusGear = FarmingEquipment;