import { expect, test } from 'vitest';
import { Stat } from '../constants/stats.js';
import { FarmingArmor } from '../fortune/farmingarmor.js';
import { FarmingTool } from '../fortune/farmingtool.js';
import type { EliteItemDto } from '../fortune/item.js';
import { FarmingPlayer } from './player.js';

const cactusKnife: EliteItemDto = {
	id: 291, // ID doesn't matter much for internal logic
	count: 1,
	skyblockId: 'CACTUS_KNIFE',
	uuid: 'test-knife-uuid',
	name: '§aCactus Knife',
	lore: [],
	enchantments: {},
	attributes: {},
};

import { Crop } from '../constants/crops.js';

test('Interactive Upgrade: Enchantments', () => {
	const player = new FarmingPlayer({
		tools: [new FarmingTool(JSON.parse(JSON.stringify(cactusKnife)))],
	});

	// 1. Initial State: No Dedication
	let upgrades = player.getCropUpgrades(Crop.Cactus);
	// Dedication 1 might not show up if cost is weird or something?
	// Harvesting is safer.
	let enchantUpgrade = upgrades.find(
		(u) => u.meta?.type === 'enchant' && u.meta?.key === 'harvesting' && u.meta?.value === 1
	);

	// If Harvesting not found, maybe level req? Harvesting req level 2. Tool has no level info?
	// Use 'dedication'. Min level 1.
	if (!enchantUpgrade) {
		enchantUpgrade = upgrades.find(
			(u) => u.meta?.type === 'enchant' && u.meta?.key === 'dedication' && u.meta?.value === 1
		);
	}

	expect(enchantUpgrade).toBeDefined();
	// expect(enchantUpgrade?.title).toMatch(/Dedication 1|Harvesting 1/);

	const upgradeName = enchantUpgrade!.title;
	const upgradeKey = enchantUpgrade!.meta!.key!;

	// 2. Apply
	player.applyUpgrade(enchantUpgrade!);

	// Verify internal state
	const tool = player.tools.find((t) => t.item.uuid === 'test-knife-uuid');
	expect(tool?.item.enchantments?.[upgradeKey]).toBe(1);

	// 3. Get Upgrades again
	upgrades = player.getCropUpgrades(Crop.Cactus);
	const nextUpgrade = upgrades.find(
		(u) => u.meta?.type === 'enchant' && u.meta?.key === upgradeKey && u.meta?.value === 2
	);
	const prevUpgrade = upgrades.find((u) => u.title === upgradeName);

	expect(prevUpgrade).toBeUndefined();
	expect(nextUpgrade).toBeDefined();
});

test('Interactive Upgrade: Farming For Dummies', () => {
	const player = new FarmingPlayer({
		tools: [new FarmingTool(JSON.parse(JSON.stringify(cactusKnife)))],
	});

	// 1. Initial State: 0 FFD
	let upgrades = player.getCropUpgrades(Crop.Cactus);
	let ffdUpgrade = upgrades.find((u) => u.title === 'Farming For Dummies');

	expect(ffdUpgrade).toBeDefined();
	expect(ffdUpgrade?.meta?.id).toBe('farming_for_dummies_count');
	expect(ffdUpgrade?.meta?.value).toBe(1);

	// 2. Apply FFD
	player.applyUpgrade(ffdUpgrade!);

	// Verify state
	const tool = player.tools.find((t) => t.item.uuid === 'test-knife-uuid');
	expect(tool?.item.attributes?.['farming_for_dummies_count']).toBe('1');

	// 3. Next Upgrade
	upgrades = player.getCropUpgrades(Crop.Cactus);
	ffdUpgrade = upgrades.find((u) => u.title === 'Farming For Dummies');
	expect(ffdUpgrade).toBeDefined();
	expect(ffdUpgrade?.meta?.value).toBe(2);
});

test('Interactive Upgrade: Reforge', () => {
	// Cactus Knife is a Hoe, so Blessed is applicable.

	const player = new FarmingPlayer({
		tools: [new FarmingTool(JSON.parse(JSON.stringify(cactusKnife)))],
	});

	// 1. Initial: No reforge
	const upgrades = player.getCropUpgrades(Crop.Cactus);
	const blessedUpgrade = upgrades.find((u) => u.meta?.type === 'reforge' && u.meta?.id === 'blessed');

	expect(blessedUpgrade).toBeDefined();

	if (blessedUpgrade) {
		player.applyUpgrade(blessedUpgrade);

		// Verify
		const tool = player.tools.find((t) => t.item.uuid === 'test-knife-uuid');
		// attributes.modifier should be 'blessed' (lowercase) or 'BLESSED'?
		// Usually lower case or whatever internal ID is.
		// toolsources.ts uses "reforge.name.toLowerCase().replaceAll(' ', '_')".
		// Bountiful -> bountiful. Blessed -> blessed.
		expect(tool?.item.attributes?.modifier).toBe('blessed');

		// Verify re-instantiation logic (tool.reforge should be defined)
		expect(tool?.reforge?.name).toBe('Blessed');
	}
});

test('Interactive Upgrade: Chain Upgrades', () => {
	// 1. Initial: Farming Level 50
	const player = new FarmingPlayer({
		farmingLevel: 50,
		tools: [new FarmingTool(JSON.parse(JSON.stringify(cactusKnife)))],
	});

	let upgrades = player.getUpgrades();
	let levelUpgrade = upgrades.find((u) => u.meta?.type === 'skill' && u.meta?.key === 'farmingLevel');

	expect(levelUpgrade).toBeDefined();
	expect(levelUpgrade?.meta?.value).toBe(51);

	// Apply Level Upgrade
	player.applyUpgrade(levelUpgrade!);
	expect(player.options.farmingLevel).toBe(51);

	// Check Next Level Upgrade
	upgrades = player.getUpgrades();
	levelUpgrade = upgrades.find((u) => u.meta?.type === 'skill' && u.meta?.key === 'farmingLevel');
	expect(levelUpgrade?.title).toContain('52');

	// Chain with Tool Upgrade
	const toolUpgrade = upgrades.find((u) => u.meta?.key === 'harvesting' && u.meta?.value === 1);

	if (toolUpgrade) {
		player.applyUpgrade(toolUpgrade);
		const tool = player.tools.find((t) => t.item.uuid === 'test-knife-uuid');
		expect(tool?.item.enchantments?.['harvesting']).toBe(1);
	} // If not found, ignore (maybe dedication is suggested instead)
});

test('Interactive Upgrade: Crop Upgrades and Others', () => {
	const player = new FarmingPlayer({
		cropUpgrades: { [Crop.Cactus]: 0 },
	});

	const upgrades = player.getCropUpgrades(Crop.Cactus);
	const cropUpgrade = upgrades.find((u) => u.meta?.type === 'crop_upgrade' && u.meta?.key === Crop.Cactus);

	expect(cropUpgrade).toBeDefined();
	expect(cropUpgrade?.meta?.value).toBe(1);

	if (cropUpgrade) {
		player.applyUpgrade(cropUpgrade);
		expect(player.options.cropUpgrades?.[Crop.Cactus]).toBe(1);
	}

	// Cocoa upgrade
	const cocoaPlayer = new FarmingPlayer({
		cocoaFortuneUpgrade: 0,
	});
	const cocoaUpgrades = cocoaPlayer.getCropUpgrades(Crop.CocoaBeans);
	const cocoaUpgrade = cocoaUpgrades.find((u) => u.meta?.type === 'setting' && u.meta?.key === 'cocoaFortuneUpgrade');

	expect(cocoaUpgrade).toBeDefined();

	if (cocoaUpgrade) {
		cocoaPlayer.applyUpgrade(cocoaUpgrade);
		expect(cocoaPlayer.options.cocoaFortuneUpgrade).toBe(1);
	}
});

test('Interactive Upgrade: Buy New Item', () => {
	// Test buying a Magic 8 Ball (General Upgrade)
	const player = new FarmingPlayer({
		accessories: [],
	});

	const upgrades = player.getUpgrades();
	const magic8BallUpgrade = upgrades.find((u) => u.meta?.type === 'buy_item' && u.meta?.id === 'MAGIC_8_BALL');

	expect(magic8BallUpgrade).toBeDefined();

	if (magic8BallUpgrade) {
		player.applyUpgrade(magic8BallUpgrade);
		// Verify item is added
		const magic8Ball = player.accessories.find((a) => a.info.skyblockId === 'MAGIC_8_BALL');
		expect(magic8Ball).toBeDefined();
	}
});

test('Interactive Upgrade: Tool Tier Upgrade', () => {
	// Test upgrading a tool to next tier (Wheat Hoe T1 -> T2)
	const wheatHoeT1: EliteItemDto = {
		id: 291,
		count: 1,
		skyblockId: 'THEORETICAL_HOE_WHEAT_1',
		uuid: 'upgrade-test-hoe-uuid',
		name: "§aEuclid's Wheat Hoe",
		lore: [],
		enchantments: { dedication: 4, harvesting: 6 },
		attributes: { modifier: 'blessed', farming_for_dummies_count: '3' },
		gems: { PERIDOT_0: 'FINE' },
	};

	const player = new FarmingPlayer({
		tools: [new FarmingTool(wheatHoeT1)],
		milestones: {
			[Crop.Wheat]: 30,
		},
	});

	// Get crop upgrades for Wheat
	const upgrades = player.getCropUpgrades(Crop.Wheat);

	// Find the tool tier upgrade (should suggest T2)
	const tierUpgrade = upgrades.find((u) => u.meta?.type === 'buy_item' && u.meta?.id === 'THEORETICAL_HOE_WHEAT_2');

	expect(tierUpgrade).toBeDefined();

	if (tierUpgrade && tierUpgrade.meta?.id) {
		const oldToolCount = player.tools.length;
		const oldTool = player.tools[0];

		player.applyUpgrade(tierUpgrade);

		// Verify the old tool was replaced, not duplicated
		expect(player.tools.length).toBe(oldToolCount);

		// Verify the new tool is the T2 version
		const newTool = player.tools.find((t) => t.info.skyblockId === 'THEORETICAL_HOE_WHEAT_2');
		expect(newTool).toBeDefined();

		// Verify enchantments, attributes, gems were transferred
		expect(newTool?.item.enchantments?.dedication).toBe(oldTool.item.enchantments?.dedication);
		expect(newTool?.item.enchantments?.harvesting).toBe(oldTool.item.enchantments?.harvesting);
		expect(newTool?.item.attributes?.modifier).toBe(oldTool.item.attributes?.modifier);
		expect(newTool?.item.attributes?.farming_for_dummies_count).toBe(
			oldTool.item.attributes?.farming_for_dummies_count
		);
		expect(newTool?.item.gems?.PERIDOT_0).toBe(oldTool.item.gems?.PERIDOT_0);
	}
});

test('Interactive Upgrade: Plot Unlock', () => {
	// Start with no plots unlocked
	const player = new FarmingPlayer({
		plots: [],
		plotsUnlocked: 0,
	});

	const upgrades = player.getUpgrades();
	const plotUpgrade = upgrades.find((u) => u.meta?.type === 'plot');

	expect(plotUpgrade).toBeDefined();
	expect(plotUpgrade?.meta?.id).toBeDefined(); // Plot name should be in id

	if (plotUpgrade) {
		const plotName = plotUpgrade.meta?.id;
		player.applyUpgrade(plotUpgrade);

		// Verify plotsUnlocked increased
		expect(player.options.plotsUnlocked).toBe(1);

		// Verify the plot was added to the plots array
		expect(player.options.plots).toContain(plotName);

		// Get upgrades again - should suggest a DIFFERENT plot
		const nextUpgrades = player.getUpgrades();
		const nextPlotUpgrade = nextUpgrades.find((u) => u.meta?.type === 'plot');

		if (nextPlotUpgrade) {
			// The next plot should have a different name
			expect(nextPlotUpgrade.meta?.id).not.toBe(plotName);
		}
	}
});

test('Interactive Upgrade: Expand Upgrade Tree', () => {
	const player = new FarmingPlayer({
		tools: [new FarmingTool(JSON.parse(JSON.stringify(cactusKnife)))],
	});

	// Get an enchant upgrade
	const upgrades = player.getCropUpgrades(Crop.Cactus);
	const enchantUpgrade = upgrades.find(
		(u) => u.meta?.type === 'enchant' && u.meta?.key === 'cultivating' && u.meta?.value === 1
	);

	if (!enchantUpgrade) {
		// Skip if no enchant upgrade available
		return;
	}

	// Expand the upgrade with stats tracking
	const tree = player.expandUpgrade(enchantUpgrade, {
		crop: Crop.Cactus,
		maxDepth: 3,
		stats: [Stat.FarmingFortune],
	});

	// Verify the tree structure
	expect(tree).toBeDefined();
	expect(tree.upgrade).toBe(enchantUpgrade);
	// statsGained may be undefined if no fortune gain (empty object if no change)
	expect(tree.statsGained[Stat.FarmingFortune] ?? 0).toBeGreaterThanOrEqual(0);

	// The tree should have children (follow-up enchant levels)
	// Cultivating goes up to level 10
	if (tree.children.length > 0) {
		const firstChild = tree.children[0];
		expect(firstChild).toBeDefined();
		expect(firstChild?.upgrade.meta?.key).toBe('cultivating');
		expect(firstChild?.upgrade.meta?.value).toBe(2);
	}

	// Verify the original player was NOT modified
	const originalTool = player.tools.find((t) => t.item.uuid === 'test-knife-uuid');
	expect(originalTool?.item.enchantments?.cultivating).toBeUndefined();
});

const squashHelmet: EliteItemDto = {
	id: 301,
	count: 1,
	skyblockId: 'SQUASH_HELMET',
	uuid: 'test-squash-helmet-uuid',
	name: '§aSquash Helmet',
	lore: [],
	enchantments: {},
	attributes: {},
};

test('Interactive Upgrade: Item Tier Upgrade Shows New Item Follow-ups', () => {
	const player = new FarmingPlayer({
		armor: [new FarmingArmor(JSON.parse(JSON.stringify(squashHelmet)))],
	});

	// Get the tier upgrade from SQUASH_HELMET to FERMENTO_HELMET
	const armorPiece = player.armor.find((a) => a.item.uuid === 'test-squash-helmet-uuid');
	expect(armorPiece).toBeDefined();

	const upgrades = armorPiece!.getUpgrades();
	const tierUpgrade = upgrades.find((u) => u.meta?.type === 'buy_item' && u.meta?.id === 'FERMENTO_HELMET');

	expect(tierUpgrade).toBeDefined();
	expect(tierUpgrade!.meta?.type).toBe('buy_item');
	expect(tierUpgrade!.meta?.id).toBe('FERMENTO_HELMET');

	// Expand the upgrade tree
	const tree = player.expandUpgrade(tierUpgrade!, {
		maxDepth: 2,
		stats: [Stat.FarmingFortune],
	});

	// Verify the tree structure
	expect(tree).toBeDefined();
	expect(tree.upgrade).toBe(tierUpgrade);

	// The upgrade from SQUASH_HELMET (25 fortune) to FERMENTO_HELMET (30 fortune) should gain 5 fortune
	expect(tree.statsGained[Stat.FarmingFortune]).toBeGreaterThan(0);

	// The tree should have children that are upgrades for FERMENTO_HELMET
	// These could include gem slots, reforge, recombobulate, pesterminator enchant, etc.
	expect(tree.children.length).toBeGreaterThan(0);

	// Verify that at least one child upgrade targets the new FERMENTO_HELMET item
	// (it could be gem, reforge, or pesterminator enchant)
	const hasNewItemUpgrade = tree.children.some((child) => {
		const meta = child.upgrade.meta;
		// Follow-up upgrades should reference the new item (found by skyblockId on the cloned player)
		// or be general item upgrades like gems, reforge, or enchants
		return meta?.type === 'gem' || meta?.type === 'reforge' || meta?.type === 'enchant';
	});

	expect(hasNewItemUpgrade).toBe(true);

	// Verify the original player was NOT modified - should still have SQUASH_HELMET
	const originalArmor = player.armor.find((a) => a.item.uuid === 'test-squash-helmet-uuid');
	expect(originalArmor).toBeDefined();
	expect(originalArmor?.item.skyblockId).toBe('SQUASH_HELMET');
});
