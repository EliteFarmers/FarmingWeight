import { ARMOR_INFO, ARMOR_SET_BONUS, GEAR_SLOTS, GearSlot } from "../../constants/armor";
import { EQUIPMENT_INFO } from "../../constants/equipment";
import { ReforgeTarget } from "../../constants/reforges";
import { Stat } from "../../constants/stats";
import { ArmorSet, FarmingArmor } from "../../fortune/farmingarmor";
import { FarmingEquipment } from "../../fortune/farmingequipment";
import { UpgradeableInfo } from "../../fortune/upgradable";
import { DynamicFortuneSource } from "./toolsources";

export const ARMOR_SET_FORTUNE_SOURCES: DynamicFortuneSource<ArmorSet>[] = [
	{
		name: 'Armor Set Bonus',
		exists: () => true,
		max: () => ARMOR_SET_BONUS.FERMENTO?.stats[4]?.[Stat.FarmingFortune] ?? 0,
		current: (set) => {
			return set.setBonuses.reduce((acc, bonus) => {
				return acc + (bonus.bonus.stats[bonus.count]?.[Stat.FarmingFortune] ?? 0);
			}, 0);
		}
	},
	...Object.entries(GEAR_SLOTS).map<DynamicFortuneSource<ArmorSet>>(([ slot, info ]) => ({
		name: slot,
		exists: () => true,
		max: () => {
			const item = info.target === ReforgeTarget.Armor
				? FarmingArmor.fakeItem(ARMOR_INFO[info.startingItem] as UpgradeableInfo)
				: FarmingEquipment.fakeItem(EQUIPMENT_INFO[info.startingItem] as UpgradeableInfo);

			const progress = item?.getProgress();
			return progress?.reduce((acc, p) => acc + p.maxFortune, 0) ?? 0;
		},
		current: (set) => {
			const item = set.getPiece(slot as GearSlot);
			const progress = item?.getProgress();
			return progress?.reduce((acc, p) => acc + p.fortune, 0) ?? 0;
		}
	}))
];