import { expect, test } from 'vitest';
import { FarmingPlayer } from '../../player/player';
import { Crop, CROP_INFO } from '../../constants/crops';
import { EliteItemDto } from '../../fortune/item';
import { FarmingTool } from '../../fortune/farmingtool';
import { FARMING_TOOLS, FarmingToolInfo } from '../../items/tools';

const fermentoArtifact: EliteItemDto = {
	id: 397,
	count: 1,
	skyblockId: 'FERMENTO_ARTIFACT',
	uuid: '1eb48c41-c8db-48d7-aec6-bf4221244bcf',
	name: '§5Fermento Artifact',
	lore: ['§7Farming Fortune: §a+30', '', '§5§l§ka§r §5§lEPIC ACCESSORY §5§l§ka'],
	enchantments: null,
	attributes: { timestamp: '1680031500000', rarity_upgrades: '1' },
};

const squashRing: EliteItemDto = {
	id: 397,
	count: 1,
	skyblockId: 'SQUASH_RING',
	uuid: '1eb48c41-c8db-48d7-aec6-bf4221244bcf',
	name: '§5Squash Ring',
	lore: ['§7Farming Fortune: §a+20', '', '§5§l§ka§r §5§lRARE ACCESSORY §5§l§ka'],
	enchantments: null,
	attributes: { timestamp: '1680031500000', rarity_upgrades: '1' },
};

const cropieTalisman: EliteItemDto = {
	id: 397,
	count: 1,
	skyblockId: 'CROPIE_TALISMAN',
	uuid: '1eb48c41-c8db-48d7-aec6-bf4221244bcf',
	name: '§5Cropie Talisman',
	lore: ['§7Farming Fortune: §a+10', '', '§5§l§ka§r §5§lUNCOMMON ACCESSORY §5§l§ka'],
	enchantments: null,
	attributes: { timestamp: '1680031500000', rarity_upgrades: '1' },
};

test('Wheat fortune test', () => {
	const player = new FarmingPlayer({
		exportableCrops: {
			[Crop.Wheat]: true,
		},
		cropUpgrades: {
			[Crop.Wheat]: 1,
		},
		accessories: [ fermentoArtifact, squashRing, cropieTalisman ],
	});

	const progress = player.getCropProgress(Crop.Wheat);

	// These are outside of the scope of this test
	progress.forEach((piece) => {
		delete piece.item;
		delete piece.maxItem;
		delete piece.wiki;
		delete piece.nextInfo;
		delete piece.info;
	});

	expect(progress).toStrictEqual([
		{
			name: 'Farming Tool',
			fortune: 0,
			maxFortune: 475,
			ratio: 0,
			progress: FarmingTool.fakeItem(FARMING_TOOLS[CROP_INFO[Crop.Wheat].startingTool] as FarmingToolInfo)?.getProgress(true)
		},
		{
			name: 'Exportable Crop',
			fortune: 12,
			maxFortune: 12,
			ratio: 1,
		},
		{
			name: 'Garden Crop Upgrade',
			fortune: 5,
			maxFortune: 45,
			ratio: 5 / 45,
		},
		{
			name: 'Fermento Artifact Family',
			fortune: 30,
			maxFortune: 30,
			ratio: 1,
		},
	]);
});

test('Potato fortune test', () => {
	const player = new FarmingPlayer({
		exportableCrops: {
			[Crop.Potato]: true,
		},
		cropUpgrades: {
			[Crop.Potato]: 9,
		},
		accessories: [ squashRing, cropieTalisman ],
	});

	const progress = player.getCropProgress(Crop.Potato);

	// These are outside of the scope of this test
	progress.forEach((piece) => {
		delete piece.item;
		delete piece.maxItem;
		delete piece.wiki;
		delete piece.nextInfo;
		delete piece.info;
	});

	expect(progress).toStrictEqual([
		{
			name: 'Farming Tool',
			fortune: 0,
			maxFortune: 475,
			ratio: 0,
			progress: FarmingTool.fakeItem(FARMING_TOOLS[CROP_INFO[Crop.Potato].startingTool] as FarmingToolInfo)?.getProgress(true)
		},
		{
			name: 'Garden Crop Upgrade',
			fortune: 45,
			maxFortune: 45,
			ratio: 1,
		},
		{
			name: 'Fermento Artifact Family',
			fortune: 20,
			maxFortune: 30,
			ratio: 20 / 30,
		},
	]);
});

test('Nether Wart fortune test', () => {
	const player = new FarmingPlayer({
		accessories: [ squashRing, cropieTalisman ],
	});

	const progress = player.getCropProgress(Crop.NetherWart);

	// These are outside of the scope of this test
	progress.forEach((piece) => {
		delete piece.item;
		delete piece.maxItem;
		delete piece.wiki;
		delete piece.nextInfo;
		delete piece.info;
	});

	expect(progress).toStrictEqual([
		{
			name: 'Farming Tool',
			fortune: 0,
			maxFortune: 475,
			ratio: 0,
			progress: FarmingTool.fakeItem(FARMING_TOOLS[CROP_INFO[Crop.NetherWart].startingTool] as FarmingToolInfo)?.getProgress(true)
		},
		{
			name: 'Garden Crop Upgrade',
			fortune: 0,
			maxFortune: 45,
			ratio: 0,
		},
		{
			name: 'Fermento Artifact Family',
			fortune: 0,
			maxFortune: 30,
			ratio: 0,
		},
	]);
});

test('Carrot fortune test', () => {
	const player = new FarmingPlayer({
		exportableCrops: {
			[Crop.Carrot]: true,
		},
		accessories: [ cropieTalisman ],
		tools: [
			FarmingTool.fakeItem(FARMING_TOOLS['THEORETICAL_HOE_CARROT_2'] as FarmingToolInfo) ?? new FarmingTool({} as EliteItemDto),
		]
	});

	const progress = player.getCropProgress(Crop.Carrot);

	// These are outside of the scope of this test
	progress.forEach((piece) => {
		delete piece.item;
		delete piece.maxItem;
		delete piece.wiki;
		delete piece.nextInfo;
		delete piece.info;
	});

	expect(progress).toStrictEqual([
		{
			name: 'Farming Tool',
			fortune: 25,
			maxFortune: 475,
			ratio: 25 / 475,
			progress: FarmingTool.fakeItem(FARMING_TOOLS['THEORETICAL_HOE_CARROT_2'] as FarmingToolInfo)?.getProgress()
		},
		{
			name: 'Exportable Crop',
			fortune: 12,
			maxFortune: 12,
			ratio: 1,
		},
		{
			name: 'Garden Crop Upgrade',
			fortune: 0,
			maxFortune: 45,
			ratio: 0,
		},
		{
			name: 'Fermento Artifact Family',
			fortune: 10,
			maxFortune: 30,
			ratio: 10 / 30,
		},
	]);
});

test('Melon fortune test', () => {
	const player = new FarmingPlayer({
		cropUpgrades: {
			[Crop.Melon]: 3,
		},
		accessories: [ cropieTalisman ],
	});

	const progress = player.getCropProgress(Crop.Melon);

	// These are outside of the scope of this test
	progress.forEach((piece) => {
		delete piece.item;
		delete piece.maxItem;
		delete piece.wiki;
		delete piece.nextInfo;
		delete piece.info;
	});

	expect(progress).toStrictEqual([
		{
			name: 'Farming Tool',
			fortune: 0,
			maxFortune: 257,
			ratio: 0,
			progress: FarmingTool.fakeItem(FARMING_TOOLS[CROP_INFO[Crop.Melon].startingTool] as FarmingToolInfo)?.getProgress(true)
		},
		{
			name: 'Garden Crop Upgrade',
			fortune: 15,
			maxFortune: 45,
			ratio: 15 / 45,
		},
		{
			name: 'Fermento Artifact Family',
			fortune: 0,
			maxFortune: 30,
			ratio: 0,
		},
	]);
});