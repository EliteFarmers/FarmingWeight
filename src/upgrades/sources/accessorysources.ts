import { Rarity } from "../../constants/reforges";
import { Stat } from "../../constants/stats";
import { FarmingAccessory } from "../../fortune/farmingaccessory";
import { GemRarity } from "../../fortune/item";
import { getPeridotFortune, getPeridotGemFortune } from "../../util/gems";
import { DynamicFortuneSource } from "./toolsources";

export const ACCESSORY_FORTUNE_SOURCES: DynamicFortuneSource<FarmingAccessory>[] = [
	{
		name: 'Base Stats',
		exists: (accessory) => {
			return (accessory.getLastItemUpgrade() ?? accessory)?.info?.baseStats?.[Stat.FarmingFortune] !== undefined
		},
		max: (accessory) => {
			return (accessory.getLastItemUpgrade() ?? accessory)?.info?.baseStats?.[Stat.FarmingFortune] ?? 0;
		},
		current: (accessory) => {
			return accessory.info.baseStats?.[Stat.FarmingFortune] ?? 0;
		}
	},
	{
		name: 'Gemstone Slots',
		exists: (accessory) => {
			const last = (accessory.getLastItemUpgrade() ?? accessory)?.info;
			return last?.gemSlots?.peridot !== undefined
		},
		max: (accessory) => {
			const last = (accessory.getLastItemUpgrade() ?? accessory)?.info;
			return 0.5 * (last?.gemSlots?.peridot ?? 0) * getPeridotGemFortune(last?.maxRarity ?? Rarity.Common, GemRarity.Perfect);
		},
		current: (accessory) => {
			return 0.5 * getPeridotFortune(accessory.rarity, accessory.item);
		}
	}
];