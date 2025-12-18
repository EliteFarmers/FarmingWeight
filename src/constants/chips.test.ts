import { expect, test } from 'vitest';
import { GARDEN_CHIP_MAX_LEVEL, getChipLevel } from './chips';

test('Garden chip level clamp test', () => {
	expect(getChipLevel(undefined)).toBe(0);
	expect(getChipLevel(null)).toBe(0);
	expect(getChipLevel(0)).toBe(0);
	expect(getChipLevel(-5)).toBe(0);

	expect(getChipLevel(1)).toBe(1);
	expect(getChipLevel(1.9)).toBe(1);
	expect(getChipLevel(GARDEN_CHIP_MAX_LEVEL)).toBe(GARDEN_CHIP_MAX_LEVEL);
	expect(getChipLevel(GARDEN_CHIP_MAX_LEVEL + 100)).toBe(GARDEN_CHIP_MAX_LEVEL);
});
