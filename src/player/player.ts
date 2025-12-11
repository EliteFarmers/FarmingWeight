import { FARMING_ATTRIBUTE_SHARDS, getShardStat } from '../constants/attributes.js';
import { CROP_INFO, Crop, EXPORTABLE_CROP_FORTUNE } from '../constants/crops.js';
import { fortuneFromPersonalBestContest } from '../constants/personalbests.js';
import {
	ANITA_FORTUNE_UPGRADE,
	COCOA_FORTUNE_UPGRADE,
	COMMUNITY_CENTER_UPGRADE,
	FARMING_LEVEL,
	GARDEN_CROP_UPGRADES,
	UNLOCKED_PLOTS,
} from '../constants/specific.js';
import { Stat } from '../constants/stats.js';
import { TEMPORARY_FORTUNE, type TemporaryFarmingFortune } from '../constants/tempfortune.js';
import { type FortuneUpgrade, UpgradeAction, UpgradeCategory } from '../constants/upgrades.js';
import { FarmingAccessory } from '../fortune/farmingaccessory.js';
import { ArmorSet, FarmingArmor } from '../fortune/farmingarmor.js';
import { FarmingEquipment } from '../fortune/farmingequipment.js';
import { FarmingPet } from '../fortune/farmingpet.js';
import { FarmingTool } from '../fortune/farmingtool.js';
import type { EliteItemDto } from '../fortune/item.js';
import { FarmingPets } from '../items/pets.js';
import { FARMING_TOOLS } from '../items/tools.js';
import { getFortune } from '../upgrades/getfortune.js';
import { getSourceProgress } from '../upgrades/getsourceprogress.js';
import { getFakeItem } from '../upgrades/itemregistry.js';
import { CROP_FORTUNE_SOURCES } from '../upgrades/sources/cropsources.js';
import { GENERAL_FORTUNE_SOURCES } from '../upgrades/sources/generalsources.js';
import { getCropDisplayName, getItemIdFromCrop } from '../util/names.js';
import { fortuneFromPestBestiary } from '../util/pests.js';
import { calculateDetailedDrops } from '../util/ratecalc.js';
import { createFarmingWeightCalculator, type FarmingWeightInfo } from '../weight/weightcalc.js';
import type { PlayerOptions } from './playeroptions.js';

export function createFarmingPlayer(options: PlayerOptions) {
	return new FarmingPlayer(options);
}

export class FarmingPlayer {
	declare options: PlayerOptions;
	declare permFortune: number;
	declare tempFortune: number;
	get fortune() {
		return this.permFortune + this.tempFortune;
	}
	declare breakdown: Record<string, number>;
	declare tempFortuneBreakdown: Record<string, number>;

	declare tools: FarmingTool[];
	declare armor: FarmingArmor[];
	declare armorSet: ArmorSet;
	declare equipment: FarmingEquipment[];
	declare accessories: FarmingAccessory[];
	declare activeAccessories: FarmingAccessory[];
	declare pets: FarmingPet[];

	declare selectedTool?: FarmingTool;
	declare selectedPet?: FarmingPet;

	get attributes() {
		return this.options.attributes ?? {};
	}

	constructor(options: PlayerOptions) {
		this.setOptions(options);
	}

	setOptions(options: PlayerOptions) {
		this.options = options;

		this.populatePets();
		this.populateTools();
		this.populateArmor();
		this.populateEquipment();
		this.populateActiveAccessories();

		this.permFortune = this.getGeneralFortune();
		this.tempFortune = this.getTempFortune();
	}

	populatePets() {
		this.options.pets ??= [];
		if (this.options.pets[0] instanceof FarmingPet) {
			this.pets = (this.options.pets as FarmingPet[]).sort((a, b) => b.fortune - a.fortune);
			for (const pet of this.pets) pet.setOptions(this.options);
		} else {
			this.pets = FarmingPet.fromArray(this.options.pets as EliteItemDto[], this.options);
		}

		this.selectedPet = this.options.selectedPet;
	}

	populateTools() {
		this.options.tools ??= [];
		if (this.options.tools[0] instanceof FarmingTool) {
			this.tools = this.options.tools as FarmingTool[];
			for (const tool of this.tools) tool.setOptions(this.options);
			this.tools.sort((a, b) => b.fortune - a.fortune);
		} else {
			this.tools = FarmingTool.fromArray(this.options.tools as EliteItemDto[], this.options);
		}

		this.selectedTool = this.options.selectedTool ?? this.tools[0];
	}

	populateArmor() {
		this.options.armor ??= [];
		if (this.options.armor instanceof ArmorSet) {
			this.armorSet = this.options.armor;

			this.armor = this.armorSet.pieces;
			this.armor.sort((a, b) => b.potential - a.potential);

			this.equipment = this.armorSet.equipmentPieces;
			this.equipment.sort((a, b) => b.fortune - a.fortune);

			this.armorSet.setOptions(this.options);
		} else if (this.options.armor[0] instanceof FarmingArmor) {
			this.armor = (this.options.armor as FarmingArmor[]).sort((a, b) => b.potential - a.potential);
			for (const a of this.armor) a.setOptions(this.options);
			this.armorSet = new ArmorSet(this.armor);
		} else {
			this.armor = FarmingArmor.fromArray(this.options.armor as EliteItemDto[], this.options);
			this.armorSet = new ArmorSet(this.armor);
		}
	}

	populateEquipment() {
		this.options.equipment ??= [];
		if (this.options.equipment[0] instanceof FarmingEquipment) {
			this.equipment = (this.options.equipment as FarmingEquipment[]).sort((a, b) => b.fortune - a.fortune);
			for (const e of this.equipment) e.setOptions(this.options);
		} else {
			this.equipment = FarmingEquipment.fromArray(this.options.equipment as EliteItemDto[], this.options);
		}

		// Load in equipment to armor set if it's empty
		if (this.armorSet.equipment.filter((e) => e).length === 0) {
			this.armorSet.setEquipment(this.equipment);
		}
	}

	populateActiveAccessories() {
		this.options.accessories ??= [];
		this.activeAccessories = [];

		if (this.options.accessories[0] instanceof FarmingAccessory) {
			this.accessories = (this.options.accessories as FarmingAccessory[]).sort((a, b) => b.fortune - a.fortune);
		} else {
			this.accessories = FarmingAccessory.fromArray(this.options.accessories as EliteItemDto[]);
		}
	}

	changeArmor(armor: FarmingArmor[]) {
		this.armorSet = new ArmorSet(armor.sort((a, b) => b.fortune - a.fortune));
	}

	selectTool(tool: FarmingTool) {
		this.selectedTool = tool;
		this.permFortune = this.getGeneralFortune();
	}

	selectPet(pet: FarmingPet) {
		this.selectedPet = pet;
		this.permFortune = this.getGeneralFortune();
	}

	setStrength(strength: number) {
		this.options.strength = strength;
		for (const pet of this.pets) {
			pet.fortune = pet.getFortune();
		}
		this.permFortune = this.getGeneralFortune();
	}

	getProgress() {
		return getSourceProgress<FarmingPlayer>(this, GENERAL_FORTUNE_SOURCES);
	}

	getUpgrades() {
		const upgrades = getSourceProgress<FarmingPlayer>(this, GENERAL_FORTUNE_SOURCES).flatMap(
			(source) => source.upgrades ?? []
		);

		const armorSetUpgrades = this.armorSet.getUpgrades();
		if (armorSetUpgrades.length > 0) {
			upgrades.push(...armorSetUpgrades);
		}

		upgrades.sort((a, b) => b.increase - a.increase);
		return upgrades;
	}

	getCropUpgrades(crop?: Crop, tool?: FarmingTool) {
		const upgrades = [] as FortuneUpgrade[];
		if (!crop) return upgrades;

		const cropUpgrades = this.getCropProgress(crop);
		for (const source of cropUpgrades) {
			if (source.upgrades) {
				upgrades.push(...source.upgrades);
			}
		}

		const cropTool = tool ?? this.getSelectedCropTool(crop);
		if (cropTool) {
			const toolUpgrades = cropTool.getUpgrades();
			upgrades.push(...toolUpgrades);
		} else {
			const startingInfo = FARMING_TOOLS[CROP_INFO[crop].startingTool];
			if (startingInfo) {
				const fakeItem = getFakeItem(startingInfo.skyblockId, this.options);
				const purchaseId = fakeItem?.item.skyblockId ?? CROP_INFO[crop].startingTool;

				upgrades.push({
					title: startingInfo.name,
					action: UpgradeAction.Purchase,
					purchase: purchaseId,
					increase: fakeItem?.getFortune() ?? 0,
					wiki: startingInfo.wiki,
					max: fakeItem?.getProgress()?.reduce((acc, p) => acc + p.maxFortune, 0) ?? 0,
					category: UpgradeCategory.Item,
					cost: {
						items: {
							[purchaseId]: 1,
						},
					},
				});
			}
		}

		upgrades.sort((a, b) => b.increase - a.increase);
		return upgrades;
	}

	getGeneralFortune() {
		const { value, breakdown } = this.getStatBreakdown(Stat.FarmingFortune);
		this.breakdown = breakdown;
		return value;
	}

	getStat(stat: Stat) {
		return this.getStatBreakdown(stat).value;
	}

	getStatBreakdown(stat: Stat) {
		let sum = 0;
		const breakdown: Record<string, number> = {};

		// Plots
		const plots = getFortune(this.options.plots?.length ?? this.options.plotsUnlocked, UNLOCKED_PLOTS, stat);
		if (plots > 0) {
			breakdown['Unlocked Plots'] = plots;
			sum += plots;
		}

		// Farming Level
		const level = getFortune(this.options.farmingLevel, FARMING_LEVEL, stat);
		if (level > 0) {
			breakdown['Farming Level'] = level;
			sum += level;
		}

		// Bestiary
		if (stat === Stat.FarmingFortune && this.options.bestiaryKills) {
			const bestiary = fortuneFromPestBestiary(this.options.bestiaryKills);
			if (bestiary > 0) {
				breakdown['Pest Bestiary'] = bestiary;
				sum += bestiary;
			}
		}

		// Armor pieces
		for (const piece of this.armorSet.armor) {
			if (!piece) continue;
			const val = piece.getStat(stat);
			if (val > 0) {
				breakdown[piece.item.name ?? 'Armor Piece'] = val;
				sum += val;
			}
		}

		// Armor Set Bonuses
		for (const { bonus, count } of this.armorSet.setBonuses) {
			if (count < 2 || count > 4) continue;
			const val = bonus.stats?.[count]?.[stat] ?? 0;
			if (val > 0) {
				breakdown[bonus.name] = val;
				sum += val;
			}
		}

		// Equipment pieces
		for (const piece of this.armorSet.equipment) {
			if (!piece) continue;
			const val = piece.getStat(stat);
			if (val > 0) {
				breakdown[piece.item.name ?? 'Equipment Piece'] = val;
				sum += val;
			}
		}

		// Equipment Set Bonuses
		for (const { bonus, count } of this.armorSet.equipmentSetBonuses) {
			if (count < 2 || count > 4) continue;
			const val = bonus.stats?.[count]?.[stat] ?? 0;
			if (val > 0) {
				breakdown[bonus.name] = val;
				sum += val;
			}
		}

		// Anita Bonus
		const anitaBonus = getFortune(this.options.anitaBonus, ANITA_FORTUNE_UPGRADE, stat);
		if (anitaBonus > 0) {
			breakdown['Anita Bonus Drops'] = anitaBonus;
			sum += anitaBonus;
		}

		// Community Center
		const communityCenter = getFortune(this.options.communityCenter, COMMUNITY_CENTER_UPGRADE, stat);
		if (communityCenter > 0) {
			breakdown['Community Center'] = communityCenter;
			sum += communityCenter;
		}

		// Selected Pet
		const pet = this.selectedPet;
		if (pet) {
			const val = pet.getFortune(stat);
			if (val > 0) {
				breakdown[pet.info.name ?? 'Selected Pet'] = val;
				sum += val;
			}
		}

		// Accessories
		const families = new Map<string, FarmingAccessory>();
		const activeAccessories = [];

		const sortedAccessories = [...this.accessories]
			.map((a) => ({ acc: a, val: a.getStat(stat) }))
			.filter((item) => item.val > 0)
			.sort((a, b) => b.val - a.val);

		for (const { acc, val } of sortedAccessories) {
			if (!acc.info.family) continue;

			const existing = families.get(acc.info.family);
			if (!existing) {
				families.set(acc.info.family, acc);
				activeAccessories.push(acc);

				breakdown[acc.item.name ?? acc.item.skyblockId ?? 'Accessory'] = val;
				sum += val;
			}
		}

		if (stat === Stat.FarmingFortune) {
			this.activeAccessories = activeAccessories;
		}

		// Refined Truffles
		if (stat === Stat.FarmingFortune) {
			const truffles = Math.min(5, this.options.refinedTruffles ?? 0);
			if (truffles > 0) {
				breakdown['Refined Truffles'] = truffles;
				sum += truffles;
			}
		}

		// Attribute Shards
		for (const [shardId, value] of Object.entries(this.attributes)) {
			const shard = FARMING_ATTRIBUTE_SHARDS[shardId as keyof typeof FARMING_ATTRIBUTE_SHARDS];
			if (!shard || value <= 0) continue;

			const val = getShardStat(shard, this, stat);
			if (val <= 0) continue;

			breakdown[shard.name] = val;
			sum += val;
		}

		// Extra Fortune
		if (stat === Stat.FarmingFortune) {
			for (const extra of this.options.extraFortune ?? []) {
				if (extra.crop) continue;

				breakdown[extra.name ?? 'Extra Fortune'] = extra.fortune;
				sum += extra.fortune;
			}

			const temp = this.getTempFortune();
			if (temp > 0) {
				breakdown['Temporary Fortune'] = temp;
			}
		}

		return { value: sum, breakdown };
	}

	getTempFortune() {
		let sum = 0;
		const breakdown = {} as Record<string, number>;

		if (!this.options.temporaryFortune) {
			this.tempFortuneBreakdown = breakdown;
			return sum;
		}

		for (const entry of Object.keys(this.options.temporaryFortune)) {
			const source = TEMPORARY_FORTUNE[entry as keyof TemporaryFarmingFortune];
			if (!source) continue;

			const fortune = source.fortune(this.options.temporaryFortune);
			if (fortune) {
				breakdown[source.name] = fortune;
				sum += fortune;
			}
		}

		this.tempFortuneBreakdown = breakdown;
		return sum;
	}

	getCropFortune(crop: Crop, tool = this.selectedTool) {
		if (tool) {
			this.selectTool(tool);
		}

		const { fortuneType } = CROP_INFO[crop];

		let sum = 0;
		const breakdown = {} as Record<string, number>;

		// Selected Pet
		const petFortune = this.selectedPet?.getFortune(fortuneType);
		if (petFortune && petFortune > 0) {
			breakdown[this.selectedPet?.info.name ?? 'Selected Pet'] = petFortune;
			sum += petFortune;
		}

		// Crop upgrades
		const upgrade = getFortune(this.options.cropUpgrades?.[crop], GARDEN_CROP_UPGRADES);
		if (upgrade > 0) {
			breakdown['Crop Upgrade'] = upgrade;
			sum += upgrade;
		}

		// Personal bests
		const personalBest =
			this.options.personalBests?.[getItemIdFromCrop(crop)] ??
			this.options.personalBests?.[getCropDisplayName(crop).replace(/ /g, '')];
		if (this.options.personalBestsUnlocked && personalBest) {
			const fortune = fortuneFromPersonalBestContest(crop, personalBest);
			if (fortune > 0) {
				breakdown['Personal Best'] = fortune;
				sum += fortune;
			}
		}

		// Tool
		const toolFortune = this.selectedTool?.fortune ?? 0;
		if (toolFortune > 0) {
			breakdown['Selected Tool'] = toolFortune;
			sum += toolFortune;
		}

		// Accessories with crop specific fortune
		const accessory = this.activeAccessories.find((a) => a.info.crops && a.info.crops.includes(crop));
		if (accessory && accessory.fortune > 0) {
			breakdown[accessory.item.name ?? 'Accessories'] = accessory.fortune ?? 0;
			sum += accessory.fortune ?? 0;
		}

		// Exportable Crops
		if (this.options.exportableCrops?.[crop]) {
			const exportable = this.options.exportableCrops[crop];
			if (exportable) {
				breakdown['Exportable Crop'] = EXPORTABLE_CROP_FORTUNE;
				sum += EXPORTABLE_CROP_FORTUNE;
			}
		}

		// Extra Fortune
		for (const extra of this.options.extraFortune ?? []) {
			if (extra.crop !== crop) continue;

			breakdown[extra.name ?? 'Extra Fortune'] = extra.fortune;
			sum += extra.fortune;
		}

		if (crop === Crop.CocoaBeans) {
			const upgrade = getFortune(this.options.cocoaFortuneUpgrade, COCOA_FORTUNE_UPGRADE);
			if (upgrade > 0) {
				breakdown['Cocoa Fortune Upgrade'] = upgrade;
				sum += upgrade;
			}
		}

		return {
			fortune: sum,
			breakdown: breakdown,
		};
	}

	getCropProgress(crop: Crop) {
		return getSourceProgress<{ crop: Crop; player: FarmingPlayer }>({ crop, player: this }, CROP_FORTUNE_SOURCES);
	}

	getRates(crop: Crop, blocksBroken: number): ReturnType<typeof calculateDetailedDrops> {
		const tool = this.getBestTool(crop);
		const cropFortune = this.getCropFortune(crop, tool);
		const fortune = this.permFortune + this.tempFortune + cropFortune.fortune;

		return calculateDetailedDrops({
			crop: crop,
			blocksBroken: blocksBroken,
			farmingFortune: fortune,
			bountiful: tool?.bountiful ?? false,
			mooshroom: this.selectedPet?.type === FarmingPets.MooshroomCow,
		});
	}

	getWeightCalc(info?: FarmingWeightInfo): ReturnType<typeof createFarmingWeightCalculator> {
		return createFarmingWeightCalculator({
			collection: this.options.collection,
			pests: this.options.bestiaryKills,
			farmingXp: this.options.farmingXp,
			levelCapUpgrade: Math.min((this.options.farmingLevel ?? 0) - 50, 0),
			...info,
		});
	}

	getBestTool(crop: Crop) {
		return this.tools.find((t) => t.crop === crop);
	}

	getSelectedCropTool(crop: Crop) {
		return this.selectedTool?.crop === crop ? this.selectedTool : this.getBestTool(crop);
	}

	applyUpgrade(upgrade: FortuneUpgrade) {
		if (!upgrade.meta) return;
		const { type, itemUuid, key, value, id } = upgrade.meta;

		if (itemUuid) {
			const candidates = [...this.tools, ...this.armor, ...this.equipment, ...this.accessories];
			const target = candidates.find((i) => i.item.uuid === itemUuid);

			if (target) {
				if (type === 'enchant' && key) {
					target.item.enchantments ??= {};
					target.item.enchantments[key] = Number(value);
				} else if (type === 'reforge' && id) {
					target.item.attributes ??= {};
					target.item.attributes.modifier = id;
					// Re-initialize to update logic
					if (target instanceof FarmingTool) {
						const idx = this.tools.indexOf(target);
						if (idx >= 0) {
							this.tools[idx] = new FarmingTool(target.item, this.options);
						}
					} else if (target instanceof FarmingArmor) {
						const idx = this.armor.indexOf(target);
						if (idx >= 0) {
							const updatedPiece = new FarmingArmor(target.item, this.options);
							this.armor[idx] = updatedPiece;
							this.armorSet.updateArmorSlot(updatedPiece);
						}
					} else if (target instanceof FarmingEquipment) {
						const idx = this.equipment.indexOf(target);
						if (idx >= 0) {
							const updatedPiece = new FarmingEquipment(target.item, this.options);
							this.equipment[idx] = updatedPiece;
							this.armorSet.updateEquipmentSlot(updatedPiece);
						}
					} else if (target instanceof FarmingAccessory) {
						const idx = this.accessories.indexOf(target);
						if (idx >= 0) {
							this.accessories[idx] = new FarmingAccessory(target.item, this.options);
						}
					}
				} else if (type === 'item' && id === 'farming_for_dummies_count') {
					target.item.attributes ??= {};
					target.item.attributes.farming_for_dummies_count = String(value);
				} else if (type === 'gem' && upgrade.meta.slot && value) {
					target.item.gems ??= {};
					target.item.gems[upgrade.meta.slot] = String(value);
				} else if (type === 'item' && id === 'rarity_upgrades' && value) {
					target.item.attributes ??= {};
					target.item.attributes.rarity_upgrades = String(value);
					// Recomb affects rarity, which affects stats. Need to reload tool.
					if (target instanceof FarmingTool) {
						const idx = this.tools.indexOf(target);
						if (idx >= 0) {
							this.tools[idx] = new FarmingTool(target.item, this.options);
						}
					} else if (target instanceof FarmingArmor) {
						const idx = this.armor.indexOf(target);
						if (idx >= 0) {
							const updatedPiece = new FarmingArmor(target.item, this.options);
							this.armor[idx] = updatedPiece;
							this.armorSet.updateArmorSlot(updatedPiece);
						}
					} else if (target instanceof FarmingEquipment) {
						const idx = this.equipment.indexOf(target);
						if (idx >= 0) {
							const updatedPiece = new FarmingEquipment(target.item, this.options);
							this.equipment[idx] = updatedPiece;
							this.armorSet.updateEquipmentSlot(updatedPiece);
						}
					} else if (target instanceof FarmingAccessory) {
						const idx = this.accessories.indexOf(target);
						if (idx >= 0) {
							this.accessories[idx] = new FarmingAccessory(target.item, this.options);
						}
					}
				} else if (type === 'buy_item' && id) {
					// Tier upgrade: replace the old item with a new one
					const newItem = getFakeItem(id);
					if (newItem) {
						// Transfer enchantments, attributes, gems from old item
						newItem.item.enchantments = {
							...newItem.item.enchantments,
							...target.item.enchantments,
						};
						newItem.item.attributes = {
							...newItem.item.attributes,
							...target.item.attributes,
						};
						newItem.item.gems = {
							...newItem.item.gems,
							...target.item.gems,
						};

						if (target instanceof FarmingTool && newItem instanceof FarmingTool) {
							const idx = this.tools.indexOf(target);
							if (idx >= 0) {
								this.tools[idx] = new FarmingTool(newItem.item, this.options);
							}
						} else if (target instanceof FarmingArmor && newItem instanceof FarmingArmor) {
							const idx = this.armor.indexOf(target);
							if (idx >= 0) {
								const updatedPiece = new FarmingArmor(newItem.item, this.options);
								this.armor[idx] = updatedPiece;
								this.armorSet.updateArmorSlot(updatedPiece);
							}
						} else if (target instanceof FarmingEquipment && newItem instanceof FarmingEquipment) {
							const idx = this.equipment.indexOf(target);
							if (idx >= 0) {
								const updatedPiece = new FarmingEquipment(newItem.item, this.options);
								this.equipment[idx] = updatedPiece;
								this.armorSet.updateEquipmentSlot(updatedPiece);
							}
						} else if (target instanceof FarmingAccessory && newItem instanceof FarmingAccessory) {
							const idx = this.accessories.indexOf(target);
							if (idx >= 0) {
								this.accessories[idx] = new FarmingAccessory(newItem.item, this.options);
							}
						}
						this.permFortune = this.getGeneralFortune();
					}
				}
			}
		} else if (type === 'skill') {
			if (key === 'farmingLevel' && value) {
				this.options.farmingLevel = Number(value);
			} else if (key === 'anitaBonus' && value) {
				this.options.anitaBonus = Number(value);
			} else if (key === 'communityCenter' && value) {
				this.options.communityCenter = Number(value);
			}
			this.permFortune = this.getGeneralFortune();
		} else if (type === 'plot' && (value || id)) {
			this.options.plotsUnlocked = Number(value);
			// Also add to plots array if using id (the plot name)
			if (id) {
				this.options.plots ??= [];
				if (!this.options.plots.includes(id)) {
					this.options.plots.push(id);
				}
			}
			this.permFortune = this.getGeneralFortune();
		} else if (type === 'attribute' && key && value) {
			this.options.attributes ??= {};
			this.options.attributes[key] = Number(value);
			this.permFortune = this.getGeneralFortune();
		} else if (type === 'crop_upgrade' && key && value) {
			this.options.cropUpgrades ??= {};
			// @ts-ignore
			this.options.cropUpgrades[key] = Number(value);
			this.permFortune = this.getGeneralFortune();
		} else if (type === 'setting' && key && value) {
			if (key === 'cocoaFortuneUpgrade') {
				this.options.cocoaFortuneUpgrade = Number(value);
			}
			this.permFortune = this.getGeneralFortune();
		} else if (type === 'unlock' && id) {
			if (id === 'personal_best') {
				this.options.personalBestsUnlocked = true;
			}
			this.permFortune = this.getGeneralFortune();
		} else if (type === 'buy_item' && id) {
			const newItem = getFakeItem(id);
			if (newItem) {
				if (newItem instanceof FarmingTool) {
					const oldIdx = itemUuid ? this.tools.findIndex((t) => t.item.uuid === itemUuid) : -1;
					if (oldIdx >= 0) {
						const oldItem = this.tools[oldIdx]!;
						// Transfer enchantments, attributes, gems from old item
						newItem.item.enchantments = {
							...newItem.item.enchantments,
							...oldItem.item.enchantments,
						};
						newItem.item.attributes = {
							...newItem.item.attributes,
							...oldItem.item.attributes,
						};
						newItem.item.gems = { ...newItem.item.gems, ...oldItem.item.gems };
						// Re-instantiate to recalculate fortune with transferred properties
						this.tools[oldIdx] = new FarmingTool(newItem.item, this.options);
					} else {
						this.tools.push(newItem);
					}
				} else if (newItem instanceof FarmingArmor) {
					const oldIdx = itemUuid ? this.armor.findIndex((a) => a.item.uuid === itemUuid) : -1;
					if (oldIdx >= 0) {
						const oldItem = this.armor[oldIdx]!;
						newItem.item.enchantments = {
							...newItem.item.enchantments,
							...oldItem.item.enchantments,
						};
						newItem.item.attributes = {
							...newItem.item.attributes,
							...oldItem.item.attributes,
						};
						newItem.item.gems = { ...newItem.item.gems, ...oldItem.item.gems };
						this.armor[oldIdx] = new FarmingArmor(newItem.item, this.options);
					} else {
						this.armor.push(newItem);
					}
				} else if (newItem instanceof FarmingEquipment) {
					const oldIdx = itemUuid ? this.equipment.findIndex((e) => e.item.uuid === itemUuid) : -1;
					if (oldIdx >= 0) {
						const oldItem = this.equipment[oldIdx]!;
						newItem.item.enchantments = {
							...newItem.item.enchantments,
							...oldItem.item.enchantments,
						};
						newItem.item.attributes = {
							...newItem.item.attributes,
							...oldItem.item.attributes,
						};
						newItem.item.gems = { ...newItem.item.gems, ...oldItem.item.gems };
						this.equipment[oldIdx] = new FarmingEquipment(newItem.item, this.options);
					} else {
						this.equipment.push(newItem);
					}
				} else if (newItem instanceof FarmingAccessory) {
					const oldIdx = itemUuid ? this.accessories.findIndex((a) => a.item.uuid === itemUuid) : -1;
					if (oldIdx >= 0) {
						const oldItem = this.accessories[oldIdx]!;
						newItem.item.enchantments = {
							...newItem.item.enchantments,
							...oldItem.item.enchantments,
						};
						newItem.item.attributes = {
							...newItem.item.attributes,
							...oldItem.item.attributes,
						};
						newItem.item.gems = { ...newItem.item.gems, ...oldItem.item.gems };
						this.accessories[oldIdx] = new FarmingAccessory(newItem.item, this.options);
					} else {
						this.accessories.push(newItem);
					}
				}
				this.permFortune = this.getGeneralFortune();
			}
		}
	}
}

export interface JacobFarmingContest {
	crop: Crop;
	timestamp: number;
	collected: number;
	position?: number;
	participants?: number;
	medal?: number;
}
