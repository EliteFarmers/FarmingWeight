import { expect, test } from "vitest";
import { FarmingTool } from "../../fortune/farmingtool";
import { Crop } from "../../constants/crops";

const netherwartHoe = {
	id: 293,
	count: 1,
	skyblockId: 'THEORETICAL_HOE_WARTS_3',
	uuid: '103d2e1f-0351-429f-b116-c85e81886597',
	name: '§dBountiful Newton Nether Warts Hoe',
	lore: [
		'§7Speed: §a+13 §9(+13)',
		'§7Farming Fortune: §a+128 §2(+5) §9(+10) §d(+18)',
		'§7Farming Wisdom: §a+10',
		'§7Nether Wart Fortune: §a+279',
		' §9[§2☘§9] §9[§2☘§9] §9[§2☘§9]',
		'',
		'§9§d§lUltimate Wise V',
		'§9Cultivating X',
		'§9Dedication IV',
		'§9Harvesting VI',
		'§9Replenish I',
		'§9Turbo-Warts V',
		'',
		'§7Gain §6+50☘ Nether Wart Fortune §7and',
		'§7§3+12☯ Farming Wisdom §7for nether',
		'§7warts.',
		'',
		'§7Counter: §e1,102,505,308 Nether Warts',
		'',
		'§6Logarithmic Counter',
		'§7Gain §6+16☘ Nether Wart Fortune §7per',
		'§7digits on the Counter, minus 4!',
		'§7You have §6+96☘ Nether Wart Fortune§7.',
		'',
		'§6Collection Analysis',
		'§7Gain §6+8☘ Nether Wart Fortune §7per digits',
		'§7of your collection, minus 4!',
		'§7You have §6+40☘ Nether Wart Fortune§7.',
		'',
		'§7§8Bonus nether warts percent',
		"§8increases your Farmhand perk's",
		'§8chances.',
		'',
		'§9Bountiful Bonus',
		'§7Grants §a+10 §6☘ Farming Fortune§7, which',
		'§7increases your chance for multiple',
		'§7crops.',
		'§7Grants §6+0.2 coins §7per crop.',
		'',
		'§d§l§ka§r §d§l§d§lMYTHIC HOE §d§l§ka',
	],
	enchantments: {
		replenish: 1,
		dedication: 4,
		harvesting: 6,
		cultivating: 10,
		telekinesis: 1,
		turbo_warts: 5,
		ultimate_wise: 5,
	},
	attributes: {
		modifier: 'bountiful',
		originTag: 'UNKNOWN',
		timestamp: '1631561580000',
		mined_crops: '1102505308',
		rarity_upgrades: '1',
		farmed_cultivating: '1016448482',
		farming_for_dummies_count: '5',
	},
	gems: { PERIDOT_0: 'PERFECT' },
};


test("Test tool fortune sources", () => {
	const tool = new FarmingTool(netherwartHoe, {
		milestones: {
			[Crop.NetherWart]: 12,
		}
	});

	expect(tool.fortune).toBe(355);

	expect(tool.counter).toBe(1102505308);

	const progress = tool.getProgress();
	expect(progress).toStrictEqual([
		{
			name: 'Tool Base Stats',
			fortune: 50,
			maxFortune: 50,
			progress: 1,
		},
		{
			name: 'Tool Reforge',
			fortune: 10,
			maxFortune: 10,
			progress: 1,
		},
		{
			name: 'Tool Gemstone',
			fortune: 10,
			maxFortune: 30,
			progress: 10 / 30,
		},
		{
			name: 'Farming For Dummies',
			fortune: 5,
			maxFortune: 5,
			progress: 1,
		},
		{
			name: 'Logarithmic Counter',
			fortune: 96,
			maxFortune: 112,
			progress: 96 / 112,
		},
		{
			name: 'Collection Analysis',
			fortune: 40,
			maxFortune: 56,
			progress: 40 / 56,
		},
		{
			name: 'Harvesting',
			fortune: 75,
			maxFortune: 75,
			progress: 1,
		},
		{
			name: 'Cultivating',
			fortune: 20,
			maxFortune: 20,
			progress: 1,
		},
		{
			name: 'Dedication',
			fortune: 24,
			maxFortune: 92,
			progress: 24 / 92,
		},
		{
			name: 'Turbo-Warts',
			fortune: 25,
			maxFortune: 25,
			progress: 1,
		}
	]);

	expect(progress.reduce((acc, curr) => acc + curr.fortune, 0)).toBe(355);
});