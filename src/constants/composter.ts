import { Crop } from './crops.js';
import { SpecialCrop } from './specialcrops.js';

export enum ComposterUpgrade {
	COMPOSTER_SPEED = 'COMPOSTER_SPEED',
	MULTI_DROP = 'MULTI_DROP',
	FUEL_CAP = 'FUEL_CAP',
	ORGANIC_MATTER_CAP = 'ORGANIC_MATTER_CAP',
	COST_REDUCTION = 'COST_REDUCTION',
}

export interface ComposterUpgradeCost {
	copper: number;
	specialCrop: SpecialCrop | null;
	specialCropAmount: number;
	crop: Crop;
	cropAmount: number;
}

export const COMPOSTER_UPGRADE_CROPS: Record<ComposterUpgrade, [Crop, Crop]> = {
	[ComposterUpgrade.COMPOSTER_SPEED]: [Crop.Wheat, Crop.Carrot],
	[ComposterUpgrade.MULTI_DROP]: [Crop.Potato, Crop.Pumpkin],
	[ComposterUpgrade.FUEL_CAP]: [Crop.SugarCane, Crop.Melon],
	[ComposterUpgrade.ORGANIC_MATTER_CAP]: [Crop.Cactus, Crop.CocoaBeans],
	[ComposterUpgrade.COST_REDUCTION]: [Crop.Mushroom, Crop.NetherWart],
};
