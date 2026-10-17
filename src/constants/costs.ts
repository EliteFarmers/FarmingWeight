import type { JacobContestMedal } from '../util/jacob.js';

export interface UpgradeCost {
	items?: Record<string, number>;
	coins?: number;
	copper?: number;
	bits?: number;
	kernels?: number;
	sowdust?: number;
	medals?: Partial<Record<Exclude<JacobContestMedal, 'platinum' | 'diamond'>, number>>;
	applyCost?: Omit<UpgradeCost, 'applyCost'>;
}

export function mergeCost(...costs: UpgradeCost[]): UpgradeCost {
	const result: UpgradeCost = {};
	for (const cost of costs) {
		addCost(result, cost);
	}
	return result;
}

function addCost(left: UpgradeCost, right: UpgradeCost) {
	if (right.items) {
		left.items ??= {};
		for (const [key, value] of Object.entries(right.items)) {
			left.items[key] = (left.items[key] || 0) + value;
		}
	}

	if (right.coins) {
		left.coins = (left.coins || 0) + (right.coins || 0);
	}
	if (right.copper) {
		left.copper = (left.copper || 0) + (right.copper || 0);
	}
	if (right.bits) {
		left.bits = (left.bits || 0) + (right.bits || 0);
	}
	if (right.kernels) {
		left.kernels = (left.kernels || 0) + (right.kernels || 0);
	}
	if (right.sowdust) {
		left.sowdust = (left.sowdust || 0) + (right.sowdust || 0);
	}

	if (right.medals) {
		left.medals ??= {};
		for (const [key, value] of Object.entries(right.medals) as [keyof typeof left.medals, number][]) {
			left.medals[key] = (left.medals[key] || 0) + value;
		}
	}

	if (right.applyCost) {
		left.applyCost = addCost(left.applyCost || {}, right.applyCost);
	}

	return left;
}
