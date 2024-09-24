import { expect, test } from 'vitest';
import { FarmingArmor } from '../../fortune/farmingarmor';

const almostMaxHelmet = {
	id: 397,
	count: 1,
	skyblockId: 'FERMENTO_HELMET',
	uuid: '9a6966f0-dd42-4797-af83-e0461f00bd02',
	name: '§dMossy Fermento Helmet §4✦',
	lore: [
		'§7§8Harvester Helmet Skin',
		'',
		'§7Health: §a+130',
		'§7Defense: §a+40',
		'§7Speed: §a+12 §9(+7)',
		'§7Farming Fortune: §a+85 §9(+30) §d(+20)',
		'§7Health Regen: §a+10',
		'§7Bonus Pest Chance: §a+10%',
		' §6[§2☘§6] §6[§2☘§6]',
		'',
		'§9Aqua Affinity I',
		'§7Increases your underwater mining',
		'§7rate.',
		'§9Pesterminator V',
		'§7Grants §6+5☘ Farming Fortune §7and',
		'§7§2+10ൠ Bonus Pest Chance§7, which',
		'§7increases your chance to spawn',
		'§7bonus §6Pests §7on the §bGarden§7.',
		'§9Rejuvenate V',
		'§7Grants §c+10❣ Health Regen§7.',
		'§9Respiration III',
		'§7Extends your underwater breathing',
		'§7time by §a45s§7.',
		'',
		'§6Tiered Bonus: Feast (3/4)',
		'§7Combines the Tiered Bonuses of',
		'§7wearing §a3 pieces §7of the Melon Armor,',
		'§7Cropie Armor, and Squash Armor.',
		'§7§7Grants §650☘ Farming Fortune§7.',
		'',
		'§6Ability: Color Swapper  §e§lLEFT CLICK',
		"§7Swap this helmet's skin through §a90",
		'§a§7unlockable skins!',
		'',
		'§7Selected: §8Black Wheat',
		'',
		'§d§l§ka§r §d§l§d§lLEGENDARY HELMET §d§l§ka',
	],
	enchantments: { rejuvenate: 5, respiration: 3, aqua_affinity: 1, pesterminator: 3 },
	attributes: {
		skin: 'FERMENTO_ULTIMATE',
		modifier: 'mossy',
		timestamp: '1676403240000',
		favorite_crop: '89',
	},
	gems: { PERIDOT_0: 'FLAWLESS', PERIDOT_1: 'FINE' },
};

test('Almost maxed fermento fortune sources', () => {
	const item = new FarmingArmor(almostMaxHelmet);
	expect(item.fortune).toBe(69);
	expect(item.fortuneBreakdown['Peridot Gems']).toBe(11);

	const upgrades = item.getUpgrades();
	expect(upgrades).toHaveLength(4);

	const progress = item.getProgress();
	expect(progress).toStrictEqual([
		{
			name: 'Base Stats',
			fortune: 30,
			maxFortune: 30,
			progress: 1,
		},
		{
			name: 'Reforge Stats',
			fortune: 25,
			maxFortune: 30,
			progress: 25 / 30,
		},
		{
			name: 'Gemstone Slots',
			fortune: 11,
			maxFortune: 20,
			progress: 11 / 20,
		},
		{
			name: 'Pesterminator',
			fortune: 3,
			maxFortune: 5,
			progress: 3 / 5,
		}
	]);
});

const melonBoots = {
	id: 301,
	count: 1,
	skyblockId: 'MELON_BOOTS',
	uuid: 'fbd00e00-a616-4a30-b0f9-802f257e7c64',
	name: '§aMelon Boots',
	lore: [
		'§7Health: §a+100',
		'§7Defense: §a+25',
		'§7Speed: §a+2',
		'§7Farming Fortune: §a+15',
		'',
		'§8Tiered Bonus: Cropier Crops (0/4)',
		'§7§7Farming Wheat, Carrots, and Potatoes',
		'§7has a §a0.03% §7chance of dropping a',
		'§7Cropie. §7Grants §60☘ Farming Fortune§7.',
		'',
		"§6Ability: Farmer's Grace ",
		'§7Grants immunity to trampling crops.',
		'',
		'§7§8This item can be reforged!',
		'§a§lUNCOMMON BOOTS',
	],
	enchantments: null,
	attributes: { timestamp: '1676403240000' },
};

test('Melon boots fortune sources', () => {
	const item = new FarmingArmor(melonBoots);
	expect(item.fortune).toBe(15);
	expect(item.fortuneBreakdown['Base Stats']).toBe(15);
	
	const progress = item.getProgress();
	expect(progress).toStrictEqual([
		{
			name: 'Base Stats',
			fortune: 15,
			maxFortune: 30,
			progress: 0.5,
		},
		{
			name: 'Reforge Stats',
			fortune: 0,
			maxFortune: 30,
			progress: 0,
		},
		{
			name: 'Gemstone Slots',
			fortune: 0,
			maxFortune: 20,
			progress: 0,
		},
		{
			name: 'Pesterminator',
			fortune: 0,
			maxFortune: 5,
			progress: 0,
		}
	]);

	expect(progress.reduce((acc, curr) => acc + curr.fortune, 0)).toBe(item.fortune);
});

test('Same maxed armor fortune sources', () => {
	const helmet = new FarmingArmor(almostMaxHelmet);
	const boots = new FarmingArmor(melonBoots);

	const helmetProgress = helmet.getProgress();
	const bootsProgress = boots.getProgress();

	expect(helmetProgress.length).toBe(bootsProgress.length);

	for (let i = 0; i < helmetProgress.length; i++) {
		helmetProgress[i].fortune = 0;
		helmetProgress[i].progress = 0;
		
		bootsProgress[i].fortune = 0;
		bootsProgress[i].progress = 0;
	}

	expect(helmetProgress).toStrictEqual(bootsProgress);
});