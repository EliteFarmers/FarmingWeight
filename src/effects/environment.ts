import type { Crop } from '../constants/crops.js';
import type { EffectEnvironment } from './types.js';

export interface CarnivalHarvestFeastPerks {
	[key: string]: string | null | number | undefined;
	natural_talent?: string | null | number;
	fortunate_feasting?: string | null | number;
	feast_crashers?: string | null | number;
}

export interface HarvestFeastOptions {
	/** Whether a Harvest Feast (or Mayor Finnegan's Grand Feast) is currently active. */
	active: boolean;
	/** The crops that are in-season this month. Caller is responsible for computing this from the SkyBlock date. */
	inSeasonCrops?: Crop[];
	/** Whether the active feast is a Grand Feast (extends to entire SkyBlock year via Mayor Finnegan). */
	grandFeast?: boolean;
	/** Explicit Carnival Harvest Feast perk progress, if the raw profile `perks` bag is unavailable. */
	perks?: CarnivalHarvestFeastPerks;
}

export interface EffectEnvironmentOptions {
	harvestFeast?: HarvestFeastOptions;
	infestedPlotProbability?: number;
	selectedCrop?: Crop;
}

/**
 * Single source-of-truth for building an `EffectEnvironment` from a player.
 *
 * No other call site is allowed to construct an `EffectEnvironment` ad-hoc.
 * Field derivations are intentionally simple and tested.
 */
export function buildEffectEnvironment(player: { options?: EffectEnvironmentOptions }, crop?: Crop): EffectEnvironment {
	return buildEffectEnvironmentFromOptions(player.options, crop);
}

export function buildEffectEnvironmentFromOptions(
	opts: EffectEnvironmentOptions | undefined,
	crop?: Crop
): EffectEnvironment {
	const harvestFeast = opts?.harvestFeast?.active === true;

	const inSeason = harvestFeast && crop !== undefined && (opts?.harvestFeast?.inSeasonCrops?.includes(crop) ?? false);

	const infestedPlot = typeof opts?.infestedPlotProbability === 'number' && opts.infestedPlotProbability > 0;

	const selectedCrop = opts?.selectedCrop;

	return {
		crop,
		harvestFeast,
		inSeason,
		infestedPlot,
		selectedCrop,
	};
}
