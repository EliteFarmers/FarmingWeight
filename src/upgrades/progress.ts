import { FortuneSource, FortuneSourceProgress } from "../constants/upgrades";
import { Upgradeable } from "../fortune/upgradable";
import { getFortune } from "./upgrades";


export function getFortuneProgress(level: number | null | undefined, source: FortuneSource): FortuneSourceProgress {
	return {
		name: source.name,
		max: source.maxLevel,
		fortunePerLevel: source.fortunePerLevel,
		wiki: source.wiki,
		fortune: getFortune(level, source),
		progress: Math.min((level ?? 0) / source.maxLevel, 1),
		maxFortune: source.maxLevel * source.fortunePerLevel,
		upgrades: []
	};
}

export function getItemProgress(item: Upgradeable): FortuneSourceProgress {
	const info = item.info;
	const upgrades = item.getUpgrades();

	return {
		name: item.item.name ?? item.item.skyblockId ?? 'Unknown Item',
		fortune: item.fortune,
		progress: 0,
		max: 0,
		fortunePerLevel: 0,
		maxFortune: 0,
		wiki: info.wiki,
		upgrades
	};
}
