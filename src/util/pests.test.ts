import { expect, test } from 'vitest';
import { fortuneFromPestBestiary, uncountedCropsFromPests, unlockedPestBestiaryTiers } from './pests.js';
import { Crop } from '../constants/crops.js';
import { PEST_COLLECTION_ADJUSTMENTS, Pest } from '../constants/pests.js';
import { PEST_BESTIARY_SOURCE } from '../constants/specific.js';

test('Pest bestiary fortune', () => {
	const bestiaryKills = {
		pest_fly_1: 1,
		pest_beetle_1: 2,
		random_thing: 100
	}

	expect(fortuneFromPestBestiary(bestiaryKills)).toBeCloseTo(1.2)
})

test('Uncounted crops from pests', () => {
	const bestiaryKills = {
		pest_fly_1: 13414,
		pest_beetle_1: 10,
		pest_worm_1: 51,
		pest_mouse_1: 4
	}

	const uncounted = uncountedCropsFromPests(bestiaryKills);

	expect(Object.values(uncounted)).toHaveLength(3);
	expect(uncounted[Crop.NetherWart]).toBe(0);
	expect(uncounted[Crop.Melon]).toBe(Math.ceil(PEST_COLLECTION_ADJUSTMENTS[Pest.Worm][50] ?? 0));
	expect(uncounted[Crop.Wheat]).toBe(311892563);
})

test('Bestiary tiers', () => {
	const data = '{"cow_1":18,"pig_1":30,"rat_1":45,"pest_mouse_1":30,"sheep_1":111,"silvo_5":1,"slime_1":101,"smog_20":1,"witch_1":5,"yog_100":38,"bezal_80":14,"blaze_12":72,"blaze_15":49,"blaze_25":135,"blaze_70":14,"ghast_17":29,"ghast_85":32,"rabbit_1":30,"sludge_5":54,"spider_1":100,"thyst_20":16,"zombie_1":3589,"chicken_1":15,"creeper_1":38,"goblin_50":35,"grinch_21":1,"mimic_115":5,"pigman_12":16,"sludge_10":43,"spider_15":9,"wraith_50":22,"zombie_15":16,"catfish_23":24,"enderman_1":31,"fire_bat_5":51,"pest_fly_1":571,"pest_rat_1":70,"skeleton_1":158,"sludge_100":22,"watcher_55":1594,"arachne_300":31,"arachne_500":10,"enderman_42":1875,"enderman_45":208,"enderman_50":298,"old_wolf_50":213,"parasite_30":15,"pest_mite_1":78,"pest_moth_1":67,"pest_slug_1":77,"pest_worm_1":67,"skeleton_15":5,"skeletor_80":224,"endermite_37":200,"endermite_40":32,"fire_mage_75":2,"magma_cube_3":195,"magma_cube_6":11,"minotaur_120":55,"pond_squid_1":114,"ruin_wolf_15":1551,"sea_leech_30":6,"sea_walker_4":79,"sea_witch_15":12,"skeletor_100":19,"skeletor_110":36,"automaton_100":114,"automaton_150":69,"bladesoul_200":2,"blue_shark_20":4,"cave_spider_1":32,"cinder_bat_90":1,"dive_ghast_90":5,"farming_cow_1":28,"farming_pig_1":30,"ice_walker_45":2817,"magma_cube_75":206,"nurse_shark_6":3,"pest_beetle_1":308,"pest_locust_1":65,"sadan_golem_1":19,"sea_archer_15":69,"tentaclees_90":20,"trapper_cow_1":7,"trapper_cow_2":6,"trapper_cow_3":3,"trapper_cow_4":2,"trapper_pig_1":9,"trapper_pig_2":6,"trapper_pig_3":2,"batty_witch_60":51,"diamond_guy_80":26,"frozen_steve_7":6,"horseman_bat_5":8,"intro_blaze_50":3,"kada_knight_90":64,"king_midas_130":3,"king_midas_160":1,"lapis_zombie_7":843,"magma_boss_500":1,"mushroom_cow_1":114,"old_dragon_100":2,"pack_spirit_30":2750,"pest_cricket_1":61,"powder_ghast_1":18,"random_slime_8":44,"sadan_statue_1":59,"scary_jerry_30":38,"tentaclees_100":95,"zombie_deep_20":37,"chicken_deep_20":15,"crypt_lurker_41":1239,"crypt_lurker_61":4,"crypt_undead_25":2,"dasher_spider_4":219,"diamond_guy_130":1,"diamond_guy_140":3,"emerald_slime_5":1024,"farming_sheep_1":30,"last_killed_mob":"pest_worm_1","mage_outlaw_200":2,"magma_glare_100":1,"minos_hunter_15":4,"pest_mosquito_1":71,"random_slime_20":2,"sea_guardian_10":79,"siamese_lynx_25":139,"spider_jockey_3":300,"super_archer_90":41,"trapper_horse_1":4,"trapper_horse_2":5,"trapper_horse_3":7,"trapper_horse_4":2,"trapper_sheep_1":6,"trapper_sheep_2":9,"trapper_sheep_3":2,"trapper_sheep_4":2,"watcher_bonzo_5":2,"watcher_livid_6":1,"watcher_scarf_6":2,"weaver_spider_3":341,"wise_dragon_100":1,"wither_gourd_40":47,"zombie_grunt_40":387,"zombie_grunt_60":5,"cellar_spider_45":62,"cellar_spider_65":1,"crypt_lurker_101":65,"crypt_lurker_111":195,"dasher_spider_42":191,"dasher_spider_45":532,"dasher_spider_50":641,"duelist_rollim_1":1,"emerald_slime_10":19,"emerald_slime_15":15,"farming_rabbit_1":10,"goblin_golem_150":27,"key_guardian_100":1,"lonely_spider_35":407,"minos_hunter_125":86,"mutated_blaze_70":10,"spider_jockey_42":251,"super_archer_100":7,"super_archer_110":46,"trapper_rabbit_1":8,"trapper_rabbit_2":3,"trapper_rabbit_3":2,"trapper_rabbit_4":1,"weaver_spider_42":298,"weaver_spider_45":355,"weaver_spider_50":573,"young_dragon_100":3,"zombie_knight_86":135,"arachne_brood_100":234,"arachne_brood_200":32,"caverns_ghost_250":217,"cellar_spider_105":2,"cellar_spider_115":9,"crystal_sentry_50":16,"diamond_zombie_15":812,"diamond_zombie_20":49,"farming_chicken_1":28,"flaming_spider_80":12,"generator_slime_1":16,"goblin_battler_60":93,"goblin_creeper_20":59,"howling_spirit_35":3383,"jockey_skeleton_3":43,"lonely_spider_105":201,"nest_endermite_50":22,"phantom_spirit_35":34,"skeleton_grunt_40":184,"skeleton_grunt_60":6,"splitter_spider_2":447,"strong_dragon_100":2,"trapper_chicken_1":6,"trapper_chicken_2":6,"trapper_chicken_3":3,"trapper_chicken_4":1,"unstable_magma_40":1,"wither_spectre_70":56,"zombie_knight_106":14,"zombie_knight_116":68,"zombie_soldier_83":1011,"zombie_villager_1":1339,"arachne_keeper_100":4,"crypt_dreadlord_47":702,"crypt_dreadlord_67":3,"crypt_souleater_45":303,"crypt_souleater_65":2,"gaia_construct_260":18,"graveyard_zombie_1":3708,"horseman_horse_100":9,"horseman_zombie_10":140,"jockey_skeleton_42":241,"lost_adventurer_80":72,"lost_adventurer_91":1,"mayor_jerry_blue_2":9,"obsidian_wither_55":1408,"pack_magma_cube_90":37,"redstone_pigman_10":273,"scared_skeleton_42":120,"scared_skeleton_62":12,"skeleton_master_48":392,"skeletor_prime_100":12,"skeletor_prime_110":32,"sniper_skeleton_43":53,"splitter_spider_42":302,"splitter_spider_45":393,"splitter_spider_50":597,"wither_skeleton_10":72,"wither_skeleton_70":73,"zealot_bruiser_100":15,"zealot_enderman_55":9471,"zombie_soldier_103":97,"zombie_soldier_113":174,"baby_magma_slug_200":6,"crypt_dreadlord_107":55,"crypt_dreadlord_117":136,"crypt_souleater_105":22,"crypt_souleater_115":87,"diamond_skeleton_15":410,"diamond_skeleton_20":26,"forest_island_bat_3":43,"invisible_creeper_3":81,"lost_adventurer_120":2,"lost_adventurer_121":3,"lost_adventurer_122":1,"lost_adventurer_130":2,"lost_adventurer_131":2,"lost_adventurer_132":1,"lost_adventurer_134":1,"lost_adventurer_141":1,"lost_adventurer_144":2,"lost_adventurer_151":3,"lost_adventurer_152":1,"magma_cube_boss_100":3,"magma_cube_rider_90":13,"mayor_jerry_green_1":15,"shadow_assassin_120":42,"shadow_assassin_140":4,"shadow_assassin_150":12,"skeleton_master_108":30,"skeleton_master_118":109,"skeleton_soldier_46":853,"skeleton_soldier_66":3,"sniper_skeleton_103":3,"sniper_skeleton_113":13,"superior_dragon_100":1,"treasure_hoarder_70":310,"trick_or_treater_30":20,"unburried_zombie_30":17135,"unburried_zombie_60":814,"unstable_dragon_100":2,"voidling_fanatic_85":5286,"voracious_spider_10":1318,"voracious_spider_42":232,"voracious_spider_45":446,"voracious_spider_50":800,"crypt_tank_zombie_40":302,"crypt_tank_zombie_60":6,"dante_slime_goon_100":1,"dungeon_secret_bat_1":75,"guardian_defender_45":4,"master_tentaclees_90":317,"mayor_jerry_purple_3":4,"protector_dragon_100":7,"skeleton_soldier_106":67,"skeleton_soldier_116":167,"soul_of_the_alpha_55":895,"super_tank_zombie_90":347,"zombie_commander_110":20,"bonzo_summon_undead_1":1,"deep_sea_protector_60":3,"fireball_magma_cube_9":125,"frosty_the_snowman_13":5,"goblin_weakling_bow_5":77,"respawning_skeleton_2":108,"super_tank_zombie_100":35,"super_tank_zombie_110":108,"brood_mother_spider_12":3,"fireball_magma_cube_75":174,"goblin_creepertamer_90":15,"goblin_murderlover_150":9,"goblin_murderlover_200":10,"goblin_weakling_bow_25":802,"voidling_extremist_100":179,"corrupted_protector_100":8,"crypt_witherskeleton_90":127,"dojo_knockback_zombie_1":9,"dojo_knockback_zombie_2":7,"dojo_knockback_zombie_3":20,"dojo_knockback_zombie_4":1,"goblin_creepertamer_100":21,"goblin_flamethrower_100":1,"goblin_knife_thrower_25":2016,"goblin_weakling_melee_5":99,"master_wither_guard_100":3,"master_wither_miner_100":4,"watcher_summon_undead_1":428,"watcher_summon_undead_6":28,"watcher_summon_undead_7":35,"blaze_higher_or_lower_15":46,"charging_mushroom_cow_80":5,"crypt_undead_valentin_40":1,"crypt_witherskeleton_100":37,"crypt_witherskeleton_110":53,"goblin_weakling_melee_25":1591,"jockey_shot_silverfish_3":2,"team_treasurite_grunt_50":13,"crypt_undead_alexander_40":1,"crypt_undead_christian_40":1,"crypt_undead_friedrich_40":1,"jockey_shot_silverfish_42":104,"shrine_charged_creeper_50":10,"team_treasurite_viper_100":11,"team_treasurite_wendy_100":11,"brood_mother_cave_spider_6":6,"splitter_spider_silverfish_2":125,"team_treasurite_corleone_200":1,"splitter_spider_silverfish_42":480,"splitter_spider_silverfish_45":661,"splitter_spider_silverfish_50":1016,"team_treasurite_sebastian_100":9,"dungeon_respawning_skeleton_60":8,"dungeon_respawning_skeleton_100":65,"dungeon_respawning_skeleton_110":201,"dungeon_respawning_skeleton_skull_40":852}';
	const bestiaryKills = JSON.parse(data);

	expect(unlockedPestBestiaryTiers(bestiaryKills)).toBe(129);
	expect(fortuneFromPestBestiary(bestiaryKills)).toBeCloseTo(51.6);
	expect(unlockedPestBestiaryTiers(bestiaryKills) * PEST_BESTIARY_SOURCE.fortunePerLevel).toBeCloseTo(51.6);
});