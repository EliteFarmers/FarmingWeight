import { ANITA_FORTUNE_UPGRADE, COMMUNITY_CENTER_UPGRADE, FARMING_LEVEL, PEST_BESTIARY_SOURCE, REFINED_TRUFFLE_SOURCE, UNLOCKED_PLOTS } from "../../constants/specific";
import { FarmingAccessory } from "../../fortune/farmingaccessory";
import { FARMING_ACCESSORIES_INFO, FarmingAccessoryInfo } from "../../items/accessories";
import { FarmingPlayer } from "../../player/player";
import { fortuneFromPestBestiary } from "../../util/pests";
import { DynamicFortuneSource } from "./toolsources";

export const GENERAL_FORTUNE_SOURCES: DynamicFortuneSource<FarmingPlayer>[] = [
	{
		name: FARMING_LEVEL.name,
		wiki: () => FARMING_LEVEL.wiki,
		exists: () => true,
		max: () => FARMING_LEVEL.maxLevel * FARMING_LEVEL.fortunePerLevel,
		current: (player) => {
			return (player.options.farmingLevel ?? 0) * FARMING_LEVEL.fortunePerLevel;
		}
	},
	{
		name: PEST_BESTIARY_SOURCE.name,
		wiki: () => PEST_BESTIARY_SOURCE.wiki,
		exists: () => true,
		max: () => PEST_BESTIARY_SOURCE.maxLevel * PEST_BESTIARY_SOURCE.fortunePerLevel,
		current: (player) => {
			return fortuneFromPestBestiary(player.options.bestiaryKills ?? {});
		}
	},
	{
		name: ANITA_FORTUNE_UPGRADE.name,
		wiki: () => ANITA_FORTUNE_UPGRADE.wiki,
		exists: () => true,
		max: () => ANITA_FORTUNE_UPGRADE.maxLevel * ANITA_FORTUNE_UPGRADE.fortunePerLevel,
		current: (player) => {
			return (player.options.anitaBonus ?? 0) * ANITA_FORTUNE_UPGRADE.fortunePerLevel;
		}
	},
	{
		name: UNLOCKED_PLOTS.name,
		wiki: () => UNLOCKED_PLOTS.wiki,
		exists: () => true,
		max: () => UNLOCKED_PLOTS.maxLevel * UNLOCKED_PLOTS.fortunePerLevel,
		current: (player) => {
			return (player.options.plotsUnlocked ?? 0) * UNLOCKED_PLOTS.fortunePerLevel;
		}
	},
	{
		name: COMMUNITY_CENTER_UPGRADE.name,
		api: false,
		wiki: () => COMMUNITY_CENTER_UPGRADE.wiki,
		exists: () => true,
		max: () => COMMUNITY_CENTER_UPGRADE.maxLevel * COMMUNITY_CENTER_UPGRADE.fortunePerLevel,
		current: (player) => {
			return (player.options.communityCenter ?? 0) * COMMUNITY_CENTER_UPGRADE.fortunePerLevel;
		}
	}, 
	{
		name: REFINED_TRUFFLE_SOURCE.name,
		wiki: () => REFINED_TRUFFLE_SOURCE.wiki,
		exists: () => true,
		max: () => REFINED_TRUFFLE_SOURCE.maxLevel * REFINED_TRUFFLE_SOURCE.fortunePerLevel,
		current: (player) => {
			return (player.options.refinedTruffles ?? 0) * REFINED_TRUFFLE_SOURCE.fortunePerLevel;
		}
	},
	{
		name: 'Relic of Power',
		exists: () => true,
		wiki: () => FARMING_ACCESSORIES_INFO.POWER_RELIC?.wiki,
		max: () => {
			const accessory = FarmingAccessory.fakeItem(FARMING_ACCESSORIES_INFO.POWER_RELIC as FarmingAccessoryInfo);
			return accessory?.getProgress()?.reduce((acc, p) => acc + p.maxFortune, 0) ?? 0;
		},
		current: (player) => {
			const accessory = player.accessories.find(a => a.info.skyblockId === 'POWER_RELIC');
			return accessory?.fortune ?? 0;
		},
		info: (player) => {
			const accessory = player.accessories.find(a => a.info.skyblockId === 'POWER_RELIC');
			const fake = !accessory ? FarmingAccessory.fakeItem(FARMING_ACCESSORIES_INFO.POWER_RELIC as FarmingAccessoryInfo) : undefined;

			return {
				item: accessory?.item,
				info: accessory?.info,
				nextInfo: fake ? fake.info : accessory?.getNextItemUpgrade()?.info,
				maxInfo: (fake ? fake : accessory)?.getLastItemUpgrade()?.info
			}
		}
	}
];