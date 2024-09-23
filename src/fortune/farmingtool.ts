import { Crop } from '../constants/crops';
import { FARMING_ENCHANTS } from '../constants/enchants';
import { REFORGES, Rarity, Reforge, ReforgeTier, Stat } from '../constants/reforges';
import { FARMING_TOOLS, FarmingToolInfo, FarmingToolType } from '../constants/tools';
import { getPeridotFortune } from '../util/gems';
import { getRarityFromLore, previousRarity } from '../util/itemstats';
import { extractNumberFromLine } from '../util/lore';
import { EliteItemDto } from './item';
import { PlayerOptions } from '../player/player';
import { Upgradeable } from './upgradable';
import { getLastItemUpgrade, getSourceProgress, getUpgrades } from '../upgrades/upgrades';
import { getFortuneFromEnchant } from '../util/enchants';
import { FortuneSourceProgress } from '../constants/upgrades';
import { TOOL_FORTUNE_SOURCES } from '../upgrades/sources/toolsources';

export class FarmingTool implements Upgradeable {
	public declare item: EliteItemDto;
	public declare crop: Crop;
	public declare info: FarmingToolInfo;
	public get type() {
		return this.info.reforgeType;
	}
	
	// Backwards compatibility
	public get tool(): FarmingToolInfo {
		return this.info;
	}

	public declare itemname: string;
	private declare colorPrefix: string;
	public get name() {
		return this.colorPrefix + (this.reforge?.name ?? '') + ' ' + this.itemname;
	}

	public declare rarity: Rarity;
	public declare counter: number | undefined;
	public declare cultivating: number;
	public declare reforge: Reforge | undefined;
	public declare reforgeStats: ReforgeTier | undefined;
	public declare logCounter: number;
	public declare collAnalysis: number;

	public declare farmingForDummies: number;
	public declare recombobulated: boolean;

	public declare fortune: number;
	public declare fortuneBreakdown: Record<string, number>;

	public declare options?: PlayerOptions;

	constructor(item: EliteItemDto, options?: PlayerOptions) {
		this.rebuildTool(item, options);
	}

	getUpgrades() {
		return getUpgrades(this);
	}

	getItemUpgrade() {
		return this.info.upgrade;
	}

	getLastItemUpgrade() {
		return getLastItemUpgrade(this, FARMING_TOOLS);
	}

	getProgress(): FortuneSourceProgress[] {
		return getSourceProgress<FarmingTool>(this, TOOL_FORTUNE_SOURCES);
	}

	setOptions(options: PlayerOptions) {
		this.options = options;
		this.fortune = this.getFortune();
	}

	rebuildTool(item: EliteItemDto, options?: PlayerOptions) {
		this.options = options;
		this.item = item;

		const tool = FARMING_TOOLS[item.skyblockId as keyof typeof FARMING_TOOLS];

		if (!tool) {
			throw new Error(`Unknown farming tool: ${item.name} (${item.skyblockId})`);
		}

		this.info = tool;
		this.crop = tool.crop;

		if (item.lore) {
			this.rarity = getRarityFromLore(item.lore);
		}

		this.counter = this.getCounter();
		this.cultivating = this.getCultivating() ?? 0;

		this.setReforge(item.attributes?.modifier ?? '');

		this.farmingForDummies = +(this.item.attributes?.farming_for_dummies_count ?? 0);
		this.recombobulated = this.item.attributes?.rarity_upgrades === '1';

		this.fortune = this.getFortune();

		if (this.reforge?.name && item.name) {
			const [prefix, name] = item.name.split(this.reforge.name);
			this.colorPrefix = prefix ?? '';
			this.itemname = name?.trim() ?? '';
		} else {
			this.colorPrefix = '';
			this.itemname = item.name ?? '';
		}
	}

	private setReforge(reforgeId: string) {
		this.reforge = REFORGES[reforgeId] ?? undefined;
		this.reforgeStats = this.reforge?.tiers?.[this.rarity];
	}

	changeReforgeTo(reforgeId: string) {
		this.setReforge(reforgeId);
		this.fortune = this.getFortune();
	}

	changeFarmedCropsTo(crops: number) {
		if (this.tool.type !== FarmingToolType.MathematicalHoe) return;

		const digits = Math.floor(crops).toString().length - 4;

		if (this.logCounter > 0) {
			this.logCounter = digits * 16;
		}

		if (this.collAnalysis > 0) {
			this.collAnalysis = digits * 8;
		}

		this.fortune = this.getFortune();
	}

	getFortune(): number {
		this.fortuneBreakdown = {};
		let sum = 0;

		// Base fortune
		const base = this.tool.baseStats?.[Stat.FarmingFortune] ?? 0;
		if (base > 0) {
			this.fortuneBreakdown['Tool Bonus'] = base;
			sum += base;
		}

		// Tool rarity stats
		const baseRarity = this.recombobulated ? previousRarity(this.rarity) : this.rarity;
		const rarityStats = this.tool.stats?.[baseRarity]?.[Stat.FarmingFortune] ?? 0;

		if (rarityStats > 0) {
			this.fortuneBreakdown['Tool Stats'] = rarityStats;
			sum += rarityStats;
		}

		// Reforge stats
		const reforge = this.reforgeStats?.stats?.[Stat.FarmingFortune] ?? 0;
		if (reforge > 0) {
			this.fortuneBreakdown[this.reforge?.name ?? 'Reforge'] = reforge;
			sum += reforge;
		}

		// Farming for Dummies
		if (this.farmingForDummies > 0) {
			this.fortuneBreakdown['Farming for Dummies'] = this.farmingForDummies;
			sum += this.farmingForDummies;
		}

		// Collection analysis and digit bonuses
		if (this.tool.type === FarmingToolType.MathematicalHoe) {
			this.getFarmingAbilityFortune();

			if (this.logCounter > 0) {
				this.fortuneBreakdown['Logarithmic Counter'] = this.logCounter;
				sum += this.logCounter;
			}

			if (this.collAnalysis > 0) {
				this.fortuneBreakdown['Collection Analysis'] = this.collAnalysis;
				sum += this.collAnalysis;
			}
		}

		// Gems
		const peridot = getPeridotFortune(this.rarity, this.item);
		if (peridot > 0) {
			this.fortuneBreakdown['Peridot Gems'] = peridot;
			sum += peridot;
		}

		// Enchantments
		const enchantments = Object.entries(this.item.enchantments ?? {});
		for (const [enchant, level] of enchantments) {
			if (!level) continue;

			const enchantment = FARMING_ENCHANTS[enchant];
			if (!enchantment || !level) continue;
			if (enchantment.cropSpecific && enchantment.cropSpecific !== this.crop) continue;

			const fortune = getFortuneFromEnchant(level, enchantment, this.options, this.crop);
			if (fortune > 0) {
				this.fortuneBreakdown[enchantment.name] = fortune;
				sum += fortune;
			}
		}

		this.fortune = sum;
		return sum;
	}

	private getCounter(): number | undefined {
		const counter = +(this.item?.attributes?.mined_crops ?? 0);
		return counter && !isNaN(counter) ? counter : undefined;
	}

	private getCultivating(): number | undefined {
		const cultivating = +(this.item?.attributes?.farmed_cultivating ?? 0);
		return cultivating && !isNaN(cultivating) ? cultivating : undefined;
	}

	getCultivatingLevel(): number {
		return this.item.enchantments?.cultivating ?? 0;
	}

	get farmed(): number {
		return this.counter ?? this.cultivating ?? 0;
	}

	isUsed(): boolean {
		if (this.farmed > 0) return true;
		if (this.getCultivatingLevel() > 0) return true;
		return false;
	}

	isMissingDedication() {
		return this.item?.enchantments?.dedication && (this.options?.milestones?.[this.crop] ?? 0) <= 0;
	}

	private getFarmingAbilityFortune() {
		const regex = /§7You have §6\+(\d+)☘/g;
		let foundCounter = false;

		for (const line of this.item.lore ?? []) {
			const found = extractNumberFromLine(line, regex) ?? 0;
			if (!found) continue;

			if (!foundCounter) {
				this.logCounter = found;
				foundCounter = true;
			} else {
				this.collAnalysis = found;
			}
		}

		return this.logCounter + this.collAnalysis;
	}

	static isValid(item: EliteItemDto | FarmingTool): boolean {
		if (item instanceof FarmingTool) return true;
		return FARMING_TOOLS[item.skyblockId as keyof typeof FARMING_TOOLS] !== undefined;
	}

	static fromArray(items: EliteItemDto[], options?: PlayerOptions): FarmingTool[] {
		return items
			.filter((item) => FarmingTool.isValid(item))
			.map((item) => new FarmingTool(item, options))
			.sort((a, b) => b.fortune - a.fortune);
	}
}
