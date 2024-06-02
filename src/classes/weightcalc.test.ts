import { expect, test } from 'vitest';
import { createFarmingWeightCalculator } from './weightcalc';
import { Crop } from '../constants/crops';
import { CROP_WEIGHT } from '../constants/weight';
import { uncountedCropsFromPests } from '../util/pests';

const crops = {
	[Crop.Cactus]: CROP_WEIGHT[Crop.Cactus] * 50,
	[Crop.Carrot]: CROP_WEIGHT[Crop.Carrot] * 10,
	[Crop.CocoaBeans]: CROP_WEIGHT[Crop.CocoaBeans] * 10,
	[Crop.Melon]: CROP_WEIGHT[Crop.Melon] * 10,
	[Crop.NetherWart]: CROP_WEIGHT[Crop.NetherWart] * 10,
	[Crop.Potato]: CROP_WEIGHT[Crop.Potato] * 10,
	[Crop.Pumpkin]: CROP_WEIGHT[Crop.Pumpkin] * 10,
	[Crop.SugarCane]: CROP_WEIGHT[Crop.SugarCane] * 50,
	[Crop.Wheat]: CROP_WEIGHT[Crop.Wheat] * 10,
};

const pests = {
	pest_fly_1: 150,
	pest_beetle_1: 86,
}

test('Basic weight calculation', () => {
	const weight = createFarmingWeightCalculator({
		collection: crops
	});

	expect(weight.getWeightInfo().totalWeight).toBeCloseTo(170)
})

test('Mushroom weight calculation', () => {
	const weight = createFarmingWeightCalculator({
		collection: {
			...crops,
			[Crop.Mushroom]: CROP_WEIGHT[Crop.Mushroom] * 13.74,
		}
	});

	expect(weight.getWeightInfo().totalWeight).toBeCloseTo(180)
})

test('Pest debuff weight calculation', () => {
	const weight = createFarmingWeightCalculator({
		collection: crops,
		pests: pests
	});

	const uncounted = uncountedCropsFromPests(pests);
	const uncountedWheat = uncounted[Crop.Wheat] ?? 0;
	const uncountedWart = uncounted[Crop.NetherWart] ?? 0;

	expect(weight.getWeightInfo().uncountedCrops[Crop.Wheat]).toBeCloseTo(uncountedWheat);
	expect(weight.getWeightInfo().uncountedCrops[Crop.NetherWart]).toBeCloseTo(uncountedWart);

	const weightExpected = createFarmingWeightCalculator({
		collection: {
			...crops,
			[Crop.Wheat]: crops[Crop.Wheat] - uncountedWheat,
			[Crop.NetherWart]: crops[Crop.NetherWart] - uncountedWart,
		}
	});

	expect(weight.getWeightInfo().cropWeight).toBeCloseTo(weightExpected.getWeightInfo().cropWeight);
})