import { CROP_INFO, Crop } from '../constants/crops';
import { MATCHING_SPECIAL_CROP, SPECIAL_CROP_INFO } from '../constants/specialcrops';

export function calculateAverageSpecialCrops(blocksBroken: number, crop: Crop, armor: 1 | 2 | 3 | 4) {
	const type = MATCHING_SPECIAL_CROP[crop];

	const { rates, npc } = SPECIAL_CROP_INFO[type];
	const chance = rates[armor - 1] ?? 0;
	const amount = blocksBroken * chance * (CROP_INFO[crop]?.breaks ?? 1);

	return {
		type,
		amount: amount,
		npc: npc * amount,
	};
}
