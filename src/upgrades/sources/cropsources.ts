import { FARMING_ACCESSORIES_INFO } from "../../items/accessories";
import { Crop, CROP_INFO, EXPORTABLE_CROP_FORTUNE } from "../../constants/crops";
import { GARDEN_CROP_UPGRADES } from "../../constants/specific";
import { Stat } from "../../constants/stats";
import { FARMING_TOOLS, FarmingToolInfo } from "../../items/tools";
import { FarmingTool } from "../../fortune/farmingtool";
import { FarmingPlayer } from "../../player/player";
import { DynamicFortuneSource } from "./toolsources";

export const CROP_FORTUNE_SOURCES: DynamicFortuneSource<{ player: FarmingPlayer, crop: Crop }>[] = [
	{
		name: 'Farming Tool',
		exists: () => true,
		wiki: ({ player, crop }) => {
			return player.getSelectedCropTool(crop)?.info.wiki ?? FARMING_TOOLS[CROP_INFO[crop].startingTool]?.wiki;
		},
		max: ({ crop }) => {
			const tool = FARMING_TOOLS[CROP_INFO[crop].startingTool];
			if (!tool) return 0;
			const progress = FarmingTool.fakeItem(tool)?.getProgress();
			return progress?.reduce((acc, p) => acc + p.maxFortune, 0) ?? 0;
		},
		current: ({ player, crop }) => {
			const tool = player.getSelectedCropTool(crop);
			const progress = tool?.getProgress();
			return progress?.reduce((acc, p) => acc + p.fortune, 0) ?? 0;
		},
		progress: ({ player, crop }) => {
			const tool = player.getSelectedCropTool(crop);
			if (tool) return tool.getProgress();
			
			const fake = FarmingTool.fakeItem(FARMING_TOOLS[CROP_INFO[crop].startingTool] as FarmingToolInfo);
			return fake?.getProgress(true) ?? [];
		},
		info: ({ player, crop }) => {
			const tool = player.selectedTool?.crop === crop 
				? player.selectedTool 
				: player.getSelectedCropTool(crop)
			
			const fake = !tool ? FarmingTool.fakeItem(FARMING_TOOLS[CROP_INFO[crop].startingTool] as FarmingToolInfo) : undefined;

			return {
				item: tool?.item,
				info: tool?.info,
				nextInfo: fake ? fake.info : tool?.getNextItemUpgrade()?.info,
				maxInfo: (fake ? fake : tool)?.getLastItemUpgrade()?.info
			}
		},
	},
	{
		name: 'Exportable Crop',
		api: false,
		wiki: () => 'https://wiki.hypixel.net/Carrolyn',
		exists: ({ crop }) => CROP_INFO[crop].exportable === true,
		max: () => EXPORTABLE_CROP_FORTUNE,
		current: ({ player, crop }) => {
			return player.options.exportableCrops?.[crop] ? EXPORTABLE_CROP_FORTUNE : 0;
		}
	},
	{
		name: 'Garden Crop Upgrade',
		exists: () => true,
		wiki: () => GARDEN_CROP_UPGRADES.wiki,
		max: () => GARDEN_CROP_UPGRADES.fortunePerLevel * GARDEN_CROP_UPGRADES.maxLevel,
		current: ({ player, crop }) => {
			return (player.options.cropUpgrades?.[crop] ?? 0) * GARDEN_CROP_UPGRADES.fortunePerLevel;
		}
	},
	{
		name: 'Fermento Artifact Family',
		exists: () => true,
		wiki: ({ player }) => {
			const highest = player.activeAccessories.find(a => a.info.family === FARMING_ACCESSORIES_INFO.FERMENTO_ARTIFACT?.family);
			return highest?.info.wiki ?? FARMING_ACCESSORIES_INFO.CROPIE_TALISMAN?.wiki;
		},
		max: () => FARMING_ACCESSORIES_INFO.FERMENTO_ARTIFACT?.baseStats?.[Stat.FarmingFortune] ?? 0,
		current: ({ player, crop }) => {
			const highest = player.activeAccessories.find(a => a.info.family === FARMING_ACCESSORIES_INFO.FERMENTO_ARTIFACT?.family);
			if (!highest) return 0;

			if (highest.info.crops && !highest.info.crops.includes(crop)) {
				return 0;
			}

			return highest.info.baseStats?.[Stat.FarmingFortune] ?? 0;
		},
		info: ({ player }) => {
			const highest = player.activeAccessories.find(a => a.info.family === FARMING_ACCESSORIES_INFO.FERMENTO_ARTIFACT?.family);
			const first = !highest ? FARMING_ACCESSORIES_INFO.CROPIE_TALISMAN : undefined;
			return {
				item: highest?.item,
				info: highest?.info,
				nextInfo: first ?? highest?.getNextItemUpgrade()?.info,
				maxInfo: highest?.getLastItemUpgrade()?.info ?? FARMING_ACCESSORIES_INFO.FERMENTO_ARTIFACT
			};
		},
	}
];