import { Crop } from "../constants/crops";
import { FarmingEnchant } from "../constants/enchants";
import { Stat } from "../constants/reforges";
import { PlayerOptions } from "../player/player";

export function getFortuneFromEnchant(level: number, enchant: FarmingEnchant, options?: PlayerOptions, crop?: Crop): number {
	if (level <= 0) return 0;

	let fortune = enchant.levels?.[level]?.[Stat.FarmingFortune] ?? 0;
	
	if (options) {
		fortune += enchant.computed?.[level]?.[Stat.FarmingFortune]?.(options) ?? 0;
	}

	if (crop && (!enchant.cropSpecific || enchant.cropSpecific === crop)) {
		fortune += enchant.cropComputed?.[level]?.[Stat.FarmingFortune]?.(crop, options) ?? 0;
	}

	return fortune;
}

export function getMaxFortuneFromEnchant(enchant: FarmingEnchant, options?: PlayerOptions, crop?: Crop): number {
	if (enchant.maxStats) {
		return enchant.maxStats[Stat.FarmingFortune] ?? 0;
	}

	let fortune = enchant.levels?.[enchant.maxLevel]?.[Stat.FarmingFortune] ?? 0;
	
	if (options) {
		fortune += enchant.computed?.[enchant.maxLevel]?.[Stat.FarmingFortune]?.(options) ?? 0;
	}

	if (crop && (!enchant.cropSpecific || enchant.cropSpecific === crop)) {
		fortune += enchant.cropComputed?.[enchant.maxLevel]?.[Stat.FarmingFortune]?.(crop, options) ?? 0;
	}

	return fortune;
}