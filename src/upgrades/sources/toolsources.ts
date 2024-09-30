import { Crop } from "../../constants/crops";
import { FARMING_ENCHANTS } from "../../constants/enchants";
import { Rarity, REFORGES, ReforgeTarget } from "../../constants/reforges";
import { Stat } from "../../constants/stats";
import { FarmingToolType } from "../../constants/tools";
import { FortuneSourceProgress } from "../../constants/upgrades";
import { FarmingTool } from "../../fortune/farmingtool";
import { GemRarity } from "../../fortune/item";
import { getFortuneFromEnchant, getMaxFortuneFromEnchant } from "../../util/enchants";
import { getPeridotFortune, getPeridotGemFortune } from "../../util/gems";

export interface DynamicFortuneSource<T> {
	name: string;
	crop?: Crop;
	exists: (upgradable: T) => boolean;
	max: (upgradable: T) => number;
	current: (upgradable: T) => number;
	progress?: (upgradable: T) => FortuneSourceProgress[];
}

export const TOOL_FORTUNE_SOURCES: DynamicFortuneSource<FarmingTool>[] = [
	{
		name: 'Base Stats',
		exists: (tool) => {
			return (tool.getLastItemUpgrade() ?? tool)?.info?.baseStats?.[Stat.FarmingFortune] !== undefined
		},
		max: (tool) => {
			return (tool.getLastItemUpgrade() ?? tool)?.info?.baseStats?.[Stat.FarmingFortune] ?? 0;
		},
		current: (tool) => {
			return tool.info.baseStats?.[Stat.FarmingFortune] ?? 0;
		}
	},
	{
		name: 'Base Stats',
		exists: (tool) => {
			const last = (tool.getLastItemUpgrade() ?? tool)?.info;
			return last?.stats?.[last.maxRarity]?.[Stat.FarmingFortune] !== undefined
		},
		max: (tool) => {
			const last = (tool.getLastItemUpgrade() ?? tool)?.info;
			return last?.stats?.[last.maxRarity]?.[Stat.FarmingFortune] ?? 0;
		},
		current: (tool) => {
			return tool.info.stats?.[tool.rarity]?.[Stat.FarmingFortune] ?? 0;
		}
	},
	{
		name: 'Reforge Stats',
		exists: () => true,
		max: (tool) => {
			const last = (tool.getLastItemUpgrade() ?? tool)?.info;
			return tool.reforge?.name === 'Blessed' 
				? REFORGES.blessed?.tiers[last.maxRarity]?.stats[Stat.FarmingFortune] ?? 0
				: REFORGES.bountiful?.tiers?.[last.maxRarity]?.stats[Stat.FarmingFortune] ?? 0;
		},
		current: (tool) => {
			return tool.reforgeStats?.stats?.[Stat.FarmingFortune] ?? 0;
		}
	},
	{
		name: 'Gemstone Slots',
		exists: (tool) => {
			const last = (tool.getLastItemUpgrade() ?? tool)?.info;
			return last?.gemSlots?.peridot !== undefined
		},
		max: (tool) => {
			const last = (tool.getLastItemUpgrade() ?? tool)?.info;
			return (last?.gemSlots?.peridot ?? 0) * getPeridotGemFortune(last?.maxRarity ?? Rarity.Common, GemRarity.Perfect);
		},
		current: (tool) => {
			return getPeridotFortune(tool.rarity, tool.item);
		}
	},
	{
		name: 'Farming For Dummies',
		exists: () => true,
		max: () => 5,
		current: (tool) => {
			return +(tool.item.attributes?.farming_for_dummies_count ?? 0);
		}
	},
	{
		name: 'Logarithmic Counter',
		exists: (tool) => tool.info.type === FarmingToolType.MathematicalHoe,
		max: () => 16 * 7, // 10 billion counter
		current: (tool) => {
			const numberOfDigits = Math.max(Math.floor(Math.log10(Math.abs(tool.counter ?? 0))), 0) + 1;
			return Math.max((numberOfDigits - 4) * 16, 0);
		}
	},
	{
		name: 'Collection Analysis',
		exists: (tool) => tool.info.type === FarmingToolType.MathematicalHoe,
		max: () => 8 * 7, // 10 billion collection
		current: (tool) => tool.collAnalysis ?? 0
	},
	...Object.entries(FARMING_ENCHANTS)
		.filter(([, enchant]) => enchant.appliesTo.includes(ReforgeTarget.Hoe) || enchant.appliesTo.includes(ReforgeTarget.Axe))
		.map(([id, enchant]) => ({
			name: enchant.name,
			exists: (tool) => enchant.appliesTo.includes(tool.type) && (!enchant.cropSpecific || enchant.cropSpecific === tool.crop),
			max: (tool) => getMaxFortuneFromEnchant(enchant, tool.options, tool.crop),
			current: (tool) => getFortuneFromEnchant(tool.item.enchantments?.[id] ?? 0, enchant, tool.options, tool.crop)
		}) as DynamicFortuneSource<FarmingTool>)
];