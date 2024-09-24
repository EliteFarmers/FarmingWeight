import { FARMING_ENCHANTS } from "../../constants/enchants";
import { Rarity, REFORGES, ReforgeTarget, Stat } from "../../constants/reforges";
import { FarmingArmor } from "../../fortune/farmingarmor";
import { FarmingEquipment } from "../../fortune/farmingequipment";
import { GemRarity } from "../../fortune/item";
import { getFortuneFromEnchant, getMaxFortuneFromEnchant } from "../../util/enchants";
import { getPeridotFortune, getPeridotGemFortune } from "../../util/gems";
import { DynamicFortuneSource } from "./toolsources";

export const GEAR_FORTUNE_SOURCES: DynamicFortuneSource<FarmingArmor | FarmingEquipment>[] = [
	{
		name: 'Base Stats',
		exists: (gear) => {
			return (gear.getLastItemUpgrade() ?? gear)?.info?.baseStats?.[Stat.FarmingFortune] !== undefined
		},
		max: (gear) => {
			return (gear.getLastItemUpgrade() ?? gear)?.info?.baseStats?.[Stat.FarmingFortune] ?? 0;
		},
		current: (gear) => {
			return gear.info.baseStats?.[Stat.FarmingFortune] ?? 0;
		}
	},
	{
		name: 'Reforge Stats',
		exists: () => true,
		max: (gear) => {
			const maxRarity = gear.getLastItemUpgrade()?.info.maxRarity ?? gear.info.maxRarity;
			return gear.type === ReforgeTarget.Equipment 
				? REFORGES.rooted?.tiers[maxRarity]?.stats[Stat.FarmingFortune] ?? 0
				: REFORGES.mossy?.tiers[maxRarity]?.stats[Stat.FarmingFortune] ?? 0;
		},
		current: (tool) => {
			return tool.reforgeStats?.stats?.[Stat.FarmingFortune] ?? 0;
		}
	},
	{
		name: 'Gemstone Slots',
		exists: (gear) => {
			const last = (gear.getLastItemUpgrade() ?? gear)?.info;
			return last?.gemSlots?.peridot !== undefined
		},
		max: (gear) => {
			const last = (gear.getLastItemUpgrade() ?? gear)?.info;
			return (last?.gemSlots?.peridot ?? 0) * getPeridotGemFortune(last?.maxRarity ?? Rarity.Common, GemRarity.Perfect);
		},
		current: (gear) => {
			return getPeridotFortune(gear.rarity, gear.item);
		}
	},
	{
		name: 'Salesperson Ability',
		exists: (gear) => gear.type === ReforgeTarget.Equipment && gear.info.family === 'LOTUS',
		max: () => 15,
		current: (gear) => {
			if (gear.type !== ReforgeTarget.Equipment) return 0;
			return gear.getPieceBonus();
		}
	},
	...Object.entries(FARMING_ENCHANTS)
		.filter(([, enchant]) => enchant.appliesTo.includes(ReforgeTarget.Armor) || enchant.appliesTo.includes(ReforgeTarget.Equipment))
		.map(([id, enchant]) => ({
			name: enchant.name,
			exists: (gear) => enchant.appliesTo.includes(gear.type),
			max: (gear) => getMaxFortuneFromEnchant(enchant, gear.options),
			current: (gear) => getFortuneFromEnchant(gear.item.enchantments?.[id] ?? 0, enchant, gear.options)
		}) as DynamicFortuneSource<FarmingArmor | FarmingEquipment>)
];