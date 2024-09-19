import { Stat } from "../../constants/reforges";
import { FarmingTool } from "../../fortune/farmingtool";

export interface DynamicFortuneSource {
	name: string;
	exisits: (tool: FarmingTool) => boolean;
	items: string[];
}

export const TOOL_FORTUNE_SOURCES: DynamicFortuneSource[] = [
	{
		name: 'Base Stats',
		exisits: (tool) => {
			return tool.getLastItemUpgrade()?.info?.baseStats?.[Stat.FarmingFortune] !== undefined
		},
		items: [ 'baseStats' ]
	}
];