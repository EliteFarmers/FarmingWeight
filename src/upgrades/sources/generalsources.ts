import { ANITA_FORTUNE_UPGRADE, COMMUNITY_CENTER_UPGRADE, FARMING_LEVEL, PEST_BESTIARY_SOURCE, REFINED_TRUFFLE_SOURCE, UNLOCKED_PLOTS } from "../../constants/specific";
import { FarmingPlayer } from "../../player/player";
import { unlockedPestBestiaryTiers } from "../../util/pests";
import { DynamicFortuneSource } from "./toolsources";

export const GENERAL_FORTUNE_SOURCES: DynamicFortuneSource<FarmingPlayer>[] = [
	{
		name: FARMING_LEVEL.name,
		exists: () => true,
		max: () => FARMING_LEVEL.maxLevel * FARMING_LEVEL.fortunePerLevel,
		current: (player) => {
			return (player.options.farmingLevel ?? 0) * FARMING_LEVEL.fortunePerLevel;
		}
	},
	{
		name: PEST_BESTIARY_SOURCE.name,
		exists: () => true,
		max: () => PEST_BESTIARY_SOURCE.maxLevel * PEST_BESTIARY_SOURCE.fortunePerLevel,
		current: (player) => {
			return unlockedPestBestiaryTiers(player.options.bestiaryKills ?? {}) * PEST_BESTIARY_SOURCE.fortunePerLevel;
		}
	},
	{
		name: ANITA_FORTUNE_UPGRADE.name,
		exists: () => true,
		max: () => ANITA_FORTUNE_UPGRADE.maxLevel * ANITA_FORTUNE_UPGRADE.fortunePerLevel,
		current: (player) => {
			return (player.options.anitaBonus ?? 0) * ANITA_FORTUNE_UPGRADE.fortunePerLevel;
		}
	},
	{
		name: UNLOCKED_PLOTS.name,
		exists: () => true,
		max: () => UNLOCKED_PLOTS.maxLevel * UNLOCKED_PLOTS.fortunePerLevel,
		current: (player) => {
			return (player.options.plotsUnlocked ?? 0) * UNLOCKED_PLOTS.fortunePerLevel;
		}
	},
	{
		name: COMMUNITY_CENTER_UPGRADE.name,
		exists: () => true,
		max: () => COMMUNITY_CENTER_UPGRADE.maxLevel * COMMUNITY_CENTER_UPGRADE.fortunePerLevel,
		current: (player) => {
			return (player.options.communityCenter ?? 0) * COMMUNITY_CENTER_UPGRADE.fortunePerLevel;
		}
	}, 
	{
		name: REFINED_TRUFFLE_SOURCE.name,
		exists: () => true,
		max: () => REFINED_TRUFFLE_SOURCE.maxLevel * REFINED_TRUFFLE_SOURCE.fortunePerLevel,
		current: (player) => {
			return (player.options.refinedTruffles ?? 0) * REFINED_TRUFFLE_SOURCE.fortunePerLevel;
		}
	}
];