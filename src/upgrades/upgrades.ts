import { FARMING_ENCHANTS } from "../constants/enchants";
import { Stat } from "../constants/reforges";
import { FortuneSource, FortuneUpgrade, FortuneUpgradeImprovement, UpgradeAction } from "../constants/upgrades";
import { GemRarity } from "../fortune/item";
import { Upgradeable } from "../fortune/upgradable";
import { getFortuneFromEnchant } from "../util/enchants";
import { getGemRarityName, getNextGemRarity, getPeridotFortune, getPeridotGemFortune, getPeridotGems } from "../util/gems";
import { nextRarity } from "../util/itemstats";

export function getFortune(level: number | null | undefined, source: FortuneSource) {
	return Math.min(Math.max(level ?? 0, 0), source.maxLevel) * source.fortunePerLevel;
}

export function getUpgrades(upgradeable: Upgradeable): FortuneUpgrade[] {
	return [
		getUpgradeableRarityUpgrade(upgradeable),
		...getUpgradeableEnchants(upgradeable),
		...getUpgradeableGems(upgradeable)
	].filter(u => u) as FortuneUpgrade[];
}

export function getUpgradeableRarityUpgrade(upgradeable: Upgradeable): FortuneUpgrade | undefined {
	if (upgradeable.recombobulated) return;

	const rarity = upgradeable.rarity;
	const next = nextRarity(upgradeable.rarity);

	const result = {
		title: 'Recombobulator',
		increase: 0,
		action: UpgradeAction.Recombobulate,
		improvements: [] as FortuneUpgradeImprovement[]
	} satisfies FortuneUpgrade;

	const currentPeridot = getPeridotFortune(upgradeable.rarity, upgradeable.item);
	const nextPeridot = getPeridotFortune(next, upgradeable.item);
	if (nextPeridot > currentPeridot) {
		result.increase += nextPeridot - currentPeridot;
		result.improvements.push({
			name: 'Peridot Gems Rarity Increase',
			fortune: nextPeridot - currentPeridot
		});
	}

	if (!upgradeable.reforge) {
		return result;
	}

	const reforgeTiers = upgradeable.reforge.tiers;
	const currentFortune = reforgeTiers?.[rarity]?.stats?.[Stat.FarmingFortune] ?? 0;
	const nextFortune = reforgeTiers?.[next]?.stats?.[Stat.FarmingFortune] ?? 0;

	if (nextFortune > currentFortune) {
		result.increase += nextFortune - currentFortune;
		result.improvements.push({
			name: 'Reforge Rarity Increase',
			fortune: nextFortune - currentFortune
		});
	}
	
	return result;
}

export function getUpgradeableEnchants(upgradeable: Upgradeable): FortuneUpgrade[] {
	if (!upgradeable.type) return [];

	const result = [] as FortuneUpgrade[];
	
	for (const enchantId in FARMING_ENCHANTS) {
		const enchant = FARMING_ENCHANTS[enchantId];
		if (!enchant || !enchant.appliesTo.includes(upgradeable.type)) continue;
		if (upgradeable.crop && enchant.cropSpecific !== upgradeable.crop) continue;

		const applied = upgradeable.item.enchantments?.[enchantId];
		if (!applied) {
			result.push({
				title: enchant.name + ' 1',
				increase: getFortuneFromEnchant(enchant.minLevel, enchant, upgradeable.options, upgradeable.crop),
				wiki: enchant.wiki,
				action: UpgradeAction.Apply
			});

			continue;
		}

		if (applied >= enchant.maxLevel) continue;

		const currentFortune = getFortuneFromEnchant(applied, enchant, upgradeable.options, upgradeable.crop);
		const nextFortune = getFortuneFromEnchant(applied + 1, enchant, upgradeable.options, upgradeable.crop);
		
		result.push({
			title: enchant.name + ' ' + (applied + 1),
			increase: nextFortune - currentFortune,
			action: UpgradeAction.Apply
		});
	}

	return result;
}

export function getUpgradeableGems(upgradeable: Upgradeable): FortuneUpgrade[] {
	const peridotSlots = upgradeable.info.gemSlots?.peridot;
	if (!peridotSlots) return [];

	const applied = getPeridotGems(upgradeable.item);

	const result = [] as FortuneUpgrade[];

	for (let i = applied.length; i < peridotSlots; i++) {
		// Intentionally skipping Rough and Flawed gems as they are not really worth applying
		result.push({
			title: 'Fine Peridot Gemstone',
			increase: getPeridotGemFortune(upgradeable.rarity, GemRarity.Fine),
			action: UpgradeAction.Apply
		});
	}
	
	for (const gem of applied) {
		if (gem === GemRarity.Perfect) continue;

		const nextGem = getNextGemRarity(gem);
		const currentFortune = getPeridotGemFortune(upgradeable.rarity, gem);
		const nextFortune = getPeridotGemFortune(upgradeable.rarity, nextGem);
 
		if (nextFortune > currentFortune) {
			result.push({
				title: getGemRarityName(nextGem) + ' Peridot Gemstone',
				increase: nextFortune - currentFortune,
				action: UpgradeAction.Apply
			});
		}
	}

	return result;
}