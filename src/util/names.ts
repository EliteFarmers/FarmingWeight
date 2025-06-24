import { COMPOSTER_UPGRADE_TYPE_TO_NAME, ComposterUpgrade } from '../constants/composter.js';
import {
	CROP_ID_TO_CROP,
	CROP_TO_ELITE_CROP,
	CROP_TO_MINION,
	CROP_TO_NAME,
	CROP_TO_PROPER_CROP,
	CROP_UNICODE_EMOJIS,
	Crop,
	FULL_NAME_TO_CROP,
	PROPER_CROP_TO_CROP,
	SHORT_NAME_TO_CROP,
} from '../constants/crops.js';
import { CROP_TO_PEST, NAME_TO_PEST, PEST_TO_CROP, PEST_TO_NAME, Pest } from '../constants/pests.js';
import { RARITY_COLORS, Rarity } from '../constants/reforges.js';
import { SPECIAL_CROP_TO_NAME, SpecialCrop } from '../constants/specialcrops.js';

export function getSpecialCropDisplayName(crop: SpecialCrop) {
	return SPECIAL_CROP_TO_NAME[crop] ?? 'Unknown Special Crop';
}

export function getComposterUpgradeDisplayName(upgrade: ComposterUpgrade) {
	return COMPOSTER_UPGRADE_TYPE_TO_NAME[upgrade] ?? 'Unknown Upgrade';
}

export function getCropDisplayName(crop?: Crop | null): string {
	return CROP_TO_PROPER_CROP[crop!] ?? 'Unknown Crop';
}

export function getCropFromName(name: string) {
	const fromDisplay = PROPER_CROP_TO_CROP[name];
	if (fromDisplay) return fromDisplay;

	const fromShort = SHORT_NAME_TO_CROP[name];
	if (fromShort) return fromShort;

	// this covers ELITE_CROP_TO_CROP
	const fromFull = FULL_NAME_TO_CROP[name.toLowerCase().replace(/ /g, '')];
	if (fromFull) return fromFull;

	// this covers API_CROP_TO_CROP_NAME
	const fromId = CROP_ID_TO_CROP[name];
	if (fromId) return fromId;

	return undefined;
}

export function getProperCropFromCrop(crop: Crop) {
	return CROP_TO_PROPER_CROP[crop];
}

export function getCropEmojiFromCrop(crop: Crop) {
	return CROP_UNICODE_EMOJIS[crop];
}

export function getEliteCropFromCrop(crop: Crop) {
	return CROP_TO_ELITE_CROP[crop];
}

export function getPestFromCrop(crop: Crop) {
	return CROP_TO_PEST[crop];
}

export function getMinionFromCrop(crop: Crop) {
	return CROP_TO_MINION[crop];
}

export function getItemIdFromCrop(crop: Crop) {
	return CROP_TO_NAME[crop];
}

export function getPestFromName(name: string) {
	return NAME_TO_PEST[name];
}

export function getCropFromPest(pest: Pest) {
	return PEST_TO_CROP[pest];
}

export function getPestNameFromPest(pest: Pest) {
	return PEST_TO_NAME[pest];
}

export function getCropFromContestKey(contestKey: string) {
	const split = contestKey.split(':');
	if (!split.length) return Crop.Wheat;

	const crop = split.at(-1);
	if (!crop) return Crop.Wheat;

	if (crop === '3') return Crop.CocoaBeans;

	return CROP_ID_TO_CROP[crop] ?? Crop.Wheat;
}

export function getRarityColor(rarity: Rarity) {
	return RARITY_COLORS[rarity];
}
