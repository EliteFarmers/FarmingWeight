import { expect, test } from "vitest";
import { FarmingPlayer } from "../../player/player";

test("General fortune sources", () => {
	const player = new FarmingPlayer({
		farmingLevel: 10,
		bestiaryKills: {
			pest_fly_1: 10
		},
		anitaBonus: 10,
		plotsUnlocked: 10,
		communityCenter: 10
	});

	const progress = player.getProgress();

	expect(progress).toStrictEqual([
		{
			name: 'Farming Level',
			fortune: 40,
			maxFortune: 240,
			progress: 4 / 24,
		},
		{
			name: 'Pest Bestiary',
			fortune: 6,
			maxFortune: 60,
			progress: 6 / 60,
		},
		{
			name: 'Anita Bonus Fortune',
			fortune: 40,
			maxFortune: 60,
			progress: 4 / 6,
		},
		{
			name: 'Unlocked Plots',
			fortune: 30,
			maxFortune: 72,
			progress: 30 / 72,
		},
		{
			name: 'Community Center Upgrade',
			fortune: 50,
			maxFortune: 50,
			progress: 1,
		},
		{
			name: 'Refined Dark Cacao Truffle',
			fortune: 0,
			maxFortune: 5,
			progress: 0,
		}
	]);

});