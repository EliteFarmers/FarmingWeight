import { ARMOR_INFO, ARMOR_SET_BONUS, GEAR_SLOTS, GearSlot } from "../../items/armor";
import { EQUIPMENT_INFO } from "../../items/equipment";
import { ReforgeTarget } from "../../constants/reforges";
import { Stat } from "../../constants/stats";
import { ArmorSet, FarmingArmor } from "../../fortune/farmingarmor";
import { FarmingEquipment } from "../../fortune/farmingequipment";
import { UpgradeableInfo } from "../../fortune/upgradeable";
import { DynamicFortuneSource } from "./toolsources";

export const ARMOR_SET_FORTUNE_SOURCES: DynamicFortuneSource<ArmorSet>[] = [
	{
		name: 'Armor Set Bonus',
		exists: () => true,
		wiki: () => 'https://wiki.hypixel.net/Fermento_Armor#Four_Pieces_',
		max: () => ARMOR_SET_BONUS.FERMENTO?.stats[4]?.[Stat.FarmingFortune] ?? 0,
		current: (set) => set.setBonuses.reduce((acc, bonus) => {
			return acc + (bonus.bonus.stats[bonus.count]?.[Stat.FarmingFortune] ?? 0);
		}, 0)
	},
	...Object.entries(GEAR_SLOTS).map<DynamicFortuneSource<ArmorSet>>(([ slot, info ]) => ({
		name: slot,
		exists: () => true,
		wiki: (set) => {
			const current = set.getPiece(slot as GearSlot);
			return current?.info.wiki ?? (info.target === ReforgeTarget.Armor
				? ARMOR_INFO[info.startingItem]?.wiki
				: EQUIPMENT_INFO[info.startingItem]?.wiki);
		},
		max: () => {
			const item = info.target === ReforgeTarget.Armor
				? FarmingArmor.fakeItem(ARMOR_INFO[info.startingItem] as UpgradeableInfo)
				: FarmingEquipment.fakeItem(EQUIPMENT_INFO[info.startingItem] as UpgradeableInfo);

			const progress = item?.getProgress();
			const maxed = progress?.reduce((acc, p) => acc + p.maxFortune, 0) ?? 0;
			return maxed;
		},
		current: (set) => {
			const item = set.getPiece(slot as GearSlot);
			const progress = item?.getProgress();
			return progress?.reduce((acc, p) => acc + p.fortune, 0) ?? 0;
		},
		progress: (set) => {
			const item = set.getPiece(slot as GearSlot);
			if (item) return item.getProgress();
			
			const fake = info.target === ReforgeTarget.Armor
				? FarmingArmor.fakeItem(ARMOR_INFO[info.startingItem] as UpgradeableInfo)
				: FarmingEquipment.fakeItem(EQUIPMENT_INFO[info.startingItem] as UpgradeableInfo);

			return fake?.getProgress(true) ?? [];
		},
		info: (set) => {
			const piece = set.getPiece(slot as GearSlot);

			return {
				item: piece?.item,
				info: piece?.info,
				nextInfo: piece?.getNextItemUpgrade()?.info,
				maxInfo: piece?.getLastItemUpgrade()?.info
			}
		},
	}))
];