import type { Crop } from '../constants/crops.js';
import { CROP_MILESTONES, GARDEN_EXP_REQUIRED } from '../constants/garden.js';
import { getCropFromName } from './names.js';

export interface LevelingStats {
	level: number;
	ratio: number;
	maxed: boolean;
	progress: number;
	goal?: number;
	next?: number;
	total: number;
}

/**
 * Gets user's current level based on experience
 * @param exp Current experience/progress
 * @param expRequired Array of the amount of experience required to reach each level, not cumulative
 * @param maxLevel Maximum level to return
 * @param overflow Calculate overflow levels
 */
export function getLevel(exp: number, expRequired: number[], maxLevel?: number, overflow = false): LevelingStats {
	let level = 0;
	let xp = exp;
	let maxed = true;

	for (const xpRequired of expRequired) {
		xp -= xpRequired;
		if (xp > 0) {
			level++;

			if (level === maxLevel) {
				break;
			}
		} else {
			maxed = false;
			xp += xpRequired;
			break;
		}
	}

	const overflowing = !maxLevel && maxed && overflow;

	if (overflowing) {
		const overflowReq = expRequired.at(-1) ?? 0;
		if (overflowReq) {
			const overflowLevels = Math.floor(xp / overflowReq);
			level += overflowLevels;
			xp -= overflowLevels * overflowReq;
		}
	}

	const nextReq = overflowing ? (expRequired.at(-1) ?? 0) : expRequired[level];

	return {
		total: exp,
		level: level,
		maxed: maxed,
		ratio: maxed && !overflowing ? 1 : xp / (nextReq ?? xp),
		progress: xp,
		goal: maxed && !overflowing ? undefined : nextReq,
		next: maxed && !overflowing ? undefined : level + 1,
	};
}

export function getGardenLevel(exp: number, overflow = false): LevelingStats {
	return getLevel(exp, GARDEN_EXP_REQUIRED, undefined, overflow);
}

export function getCropMilestone(crop: Crop, collection: number, overflow = false): LevelingStats {
	return getLevel(collection, CROP_MILESTONES[crop], undefined, overflow);
}

export function getCropMilestones(
	crops: Record<string, number | string>,
	overflow = false
): Record<Crop, LevelingStats> {
	const milestones = {} as Record<string, LevelingStats>;

	for (const [cropName, collection] of Object.entries(crops)) {
		const crop = getCropFromName(cropName);
		const col = typeof collection === 'string' ? parseInt(collection) : collection;
		if (isNaN(col) || !crop) continue;

		milestones[crop] = getLevel(col, CROP_MILESTONES[crop], undefined, overflow);
	}

	return milestones;
}

export function getCropMilestoneLevels(
	crops: Record<string, number | string | null | undefined>,
	overflow = false
): Record<Crop, number> {
	const milestones = {} as Record<string, number>;

	for (const [cropName, collection] of Object.entries(crops)) {
		const crop = getCropFromName(cropName);
		const col = typeof collection === 'string' ? parseInt(collection) : (collection ?? NaN);
		if (isNaN(col) || !crop) continue;

		milestones[crop] = getLevel(col, CROP_MILESTONES[crop], undefined, overflow).level;
	}

	return milestones;
}

export function getCropUpgrades(upgrades: Record<string, number>): Record<Crop, number> {
	const cropUpgrades = {} as Record<string, number>;

	for (const [cropName, upgrade] of Object.entries(upgrades)) {
		const crop = getCropFromName(cropName);
		if (!crop) continue;

		cropUpgrades[crop] = upgrade;
	}

	return cropUpgrades;
}
