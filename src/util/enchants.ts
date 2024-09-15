import { Crop } from "../constants/crops";
import { FarmingEnchant } from "../constants/enchants";
import { Stat } from "../constants/reforges";
import { PlayerOptions } from "../player/player";

export function getFortuneFromEnchant(level: number, enchant: FarmingEnchant, options?: PlayerOptions, crop?: Crop): number {
	let fortune = enchant.levels?.[level]?.[Stat.FarmingFortune] ?? 0;
	
	if (options) {
		fortune += enchant.computed?.[level]?.[Stat.FarmingFortune]?.(options) ?? 0;
	}

	if (crop && (!enchant.cropSpecific || enchant.cropSpecific === crop)) {
		fortune += enchant.cropComputed?.[level]?.[Stat.FarmingFortune]?.(crop, options) ?? 0;
	}

	return fortune;
}