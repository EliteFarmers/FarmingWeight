import { FARMING_ACCESSORIES_INFO } from "../../constants/accessories";
import { Crop, CROP_INFO, EXPORTABLE_CROP_FORTUNE } from "../../constants/crops";
import { GARDEN_CROP_UPGRADES } from "../../constants/specific";
import { Stat } from "../../constants/stats";
import { FARMING_TOOLS, FarmingToolInfo } from "../../constants/tools";
import { FarmingTool } from "../../fortune/farmingtool";
import { FarmingPlayer } from "../../player/player";
import { DynamicFortuneSource } from "./toolsources";

export const CROP_FORTUNE_SOURCES: DynamicFortuneSource<{ player: FarmingPlayer, crop: Crop }>[] = [
	{
		name: 'Farming Tool',
		exists: () => true,
		max: ({ crop }) => {
			const tool = FARMING_TOOLS[CROP_INFO[crop].startingTool];
			if (!tool) return 0;
			const progress = FarmingTool.fakeItem(tool)?.getProgress();
			return progress?.reduce((acc, p) => acc + p.maxFortune, 0) ?? 0;
		},
		current: ({ player, crop }) => {
			const tool = player.getBestTool(crop);
			const progress = tool?.getProgress();
			return progress?.reduce((acc, p) => acc + p.fortune, 0) ?? 0;
		},
		progress: ({ player, crop }) => {
			const tool = player.getBestTool(crop);
			if (tool) return tool.getProgress();
			
			const fake = FarmingTool.fakeItem(FARMING_TOOLS[CROP_INFO[crop].startingTool] as FarmingToolInfo);
			return fake?.getProgress(true) ?? [];
		},
		item: ({ player, crop }) => {
			const tool = player.selectedTool?.crop === crop 
				? player.selectedTool 
				: player.getBestTool(crop);
			return tool?.item;
		},
		maxItem: ({ crop }) => {
			const startingTool = FARMING_TOOLS[CROP_INFO[crop].startingTool];
			if (!startingTool) return;
			const tool = FarmingTool.fakeItem(startingTool);
			return (tool?.getLastItemUpgrade() ?? tool)?.info;
		}
	},
	{
		name: 'Exportable Crop',
		exists: ({ crop }) => CROP_INFO[crop].exportable === true,
		max: () => EXPORTABLE_CROP_FORTUNE,
		current: ({ player, crop }) => {
			return player.options.exportableCrops?.[crop] ? EXPORTABLE_CROP_FORTUNE : 0;
		}
	},
	{
		name: 'Garden Crop Upgrade',
		exists: () => true,
		max: () => GARDEN_CROP_UPGRADES.fortunePerLevel * GARDEN_CROP_UPGRADES.maxLevel,
		current: ({ player, crop }) => {
			return (player.options.cropUpgrades?.[crop] ?? 0) * GARDEN_CROP_UPGRADES.fortunePerLevel;
		}
	},
	{
		name: 'Fermento Artifact Family',
		exists: () => true,
		max: () => FARMING_ACCESSORIES_INFO.FERMENTO_ARTIFACT?.baseStats?.[Stat.FarmingFortune] ?? 0,
		current: ({ player, crop }) => {
			const highest = player.activeAccessories.find(a => a.info.family === FARMING_ACCESSORIES_INFO.FERMENTO_ARTIFACT?.family);
			if (!highest) return 0;

			if (highest.info.crops && !highest.info.crops.includes(crop)) {
				return 0;
			}

			return highest.info.baseStats?.[Stat.FarmingFortune] ?? 0;
		},
		item: ({ player }) => {
			return player.activeAccessories.find(a => a.info.family === FARMING_ACCESSORIES_INFO.FERMENTO_ARTIFACT?.family)?.item;
		},
		maxItem: () => {
			return FARMING_ACCESSORIES_INFO.FERMENTO_ARTIFACT;
		}
	}
];