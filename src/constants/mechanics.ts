export enum FarmingMechanic {
	CropGrowth = 'crop_growth',
	SprayonatorMaterialChance = 'sprayonator_material_chance',
	EnchantedCropChance = 'enchanted_crop_chance',
	AtmosphericFilterEffect = 'atmospheric_filter_effect',
	PestCooldownReductionSeconds = 'pest_cooldown_reduction_seconds',
	FarmingToolExperience = 'farming_tool_experience',
	CropFeverChance = 'crop_fever_chance',
}

export interface FarmingMechanicInfo {
	name: string;
}

export const FARMING_MECHANIC_INFO: Record<FarmingMechanic, FarmingMechanicInfo> = {
	[FarmingMechanic.CropFeverChance]: { name: 'Crop Fever Chance' },
	[FarmingMechanic.CropGrowth]: { name: 'Crop Growth' },
	[FarmingMechanic.SprayonatorMaterialChance]: { name: 'Sprayonator Material Chance' },
	[FarmingMechanic.EnchantedCropChance]: { name: 'Enchanted Crop Chance' },
	[FarmingMechanic.AtmosphericFilterEffect]: { name: 'Atmospheric Filter Effect' },
	[FarmingMechanic.PestCooldownReductionSeconds]: { name: 'Pest Cooldown Reduction' },
	[FarmingMechanic.FarmingToolExperience]: { name: 'Farming Tool EXP' },
};
