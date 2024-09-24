import { Crop } from "../constants/crops";
import { FarmingEnchant } from "../constants/enchants";
import { Stat } from "../constants/reforges";
import { PlayerOptions } from "../player/player";

export function getFortuneFromEnchant(level: number, enchant: FarmingEnchant, options?: PlayerOptions, crop?: Crop): number {
	if (level <= 0) return 0;

	const tier = enchant.levels?.[level];
	if (!tier) return 0;

	let fortune = tier.stats?.[Stat.FarmingFortune] ?? 0;
	
	if (options) {
		fortune += tier.computed?.[Stat.FarmingFortune]?.(options) ?? 0;
	}

	if (crop && (!enchant.cropSpecific || enchant.cropSpecific === crop)) {
		fortune += tier.cropComputed?.[Stat.FarmingFortune]?.(crop, options) ?? 0;
	}

	return fortune;
}

export function getMaxFortuneFromEnchant(enchant: FarmingEnchant, options?: PlayerOptions, crop?: Crop): number {
	if (enchant.maxStats) {
		return enchant.maxStats[Stat.FarmingFortune] ?? 0;
	}

	const tier = enchant.levels?.[enchant.maxLevel];
	if (!tier) return 0;

	let fortune = tier?.stats?.[Stat.FarmingFortune] ?? 0;
	
	if (options) {
		fortune += tier?.computed?.[Stat.FarmingFortune]?.(options) ?? 0;
	}

	if (crop && (!enchant.cropSpecific || enchant.cropSpecific === crop)) {
		fortune += tier?.cropComputed?.[Stat.FarmingFortune]?.(crop, options) ?? 0;
	}

	return fortune;
}