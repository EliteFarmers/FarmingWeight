# Farming Weight

NPM package for Farming Weight and fortune calculations in Hypixel SkyBlock.

Created specifically for the [EliteWebsite](https://github.com/EliteFarmers/Website) and [EliteBot](https://github.com/EliteFarmers/Bot) projects, but can be used for any project, as long as some credit is given per the license.

**This is a new package that's changing rapidly, there aren't any comprehensive docs at this time**

## Installation

```bash
npm install farming-weight
```

## Usage

This package is made with TypeScript, and has type definitions included. While there is a lack of docs, relevant types and autocomplete should help a lot with understanding the package.

### General philosophy

The goal of this package is to provide an easy way to pass in existing data and get Farming Weight information back. With this in mind, the **input data is not always raw Hypixel API responses, as those are prone to change**. While this may be inconvenient for some projects, it should be easy enough to convert the data to the format expected by this package, and it moves the burden of keeping up with Hypixel API changes out of this package.

### Farming Weight Calculator

The `createFarmingWeightCalculator` function is the main entry point for this package. It takes in a single object with data required for the full farming weight calculation. Data can be skipped, and the weight calculator will skip the related weight that would be calculated from that data.

```ts
import { createFarmingWeightCalculator } from 'farming-weight';

const member = // Get SkyBlock member from elsewhere (https://api.hypixel.net/)

const calculator = createFarmingWeightCalculator({
	collection: member.collection,
	farmingXp: member.player_data?.experience?.SKILL_FARMING,
	levelCapUpgrade: member.jacobs_contest?.perks?.farming_level_cap,
	anitaBonusFarmingFortuneLevel?: member.jacobs_contest?.perks?.double_drops,
	minions: member.player_data?.crafted_generators, // You should also include minions crafted from other members on the same profile
	contests: Object.values(member.jacob_contest?.contests ?? {}),
	pests: member.bestiary.kills
})

// Can pass in some values instead of calculating them (you can exclude contests above if you do this)
calculator.setEarnedMedals({
	diamond: /* Number of diamond medals */,
	platinum: /* Number of platinum medals */,
	gold: /* Number of gold medals */,
})

const weight = calculator.getWeightInfo();

console.log(weight.totalWeight);
// 10000.53 (or whatever the total weight is)

console.log(weight.bonusSources);
// { "Contest Medals": 123.25, "Farming Level": 250, ... }

```

### Rates Calculator

The rates calculator turns farming fortune and a list of effects into expected drops, collection and NPC profit.

```ts
import {
	buildEffectEnvironmentFromOptions,
	calculateDetailedDropsFromEffects,
	Crop,
	type Effect,
} from 'farming-weight';

const crop = Crop.Wheat;
const env = buildEffectEnvironmentFromOptions({ selectedCrop: crop }, crop);

const effects: Effect[] = [
	// Effects from your tools, armor, pets, etc.
];

const drops = calculateDetailedDropsFromEffects({
	crop,
	blocksBroken: 24000, // 100% efficiency for 20 minutes
	farmingFortune: 2000,
	effects,
	env,
});

console.log(drops.collection);
console.log(drops.effectsBreakdown);
console.log(drops.appliedEffects);
```

Effects are resolved by the functions in `effects/resolver.ts`, which are also exported if you only need stat totals or breakdowns.
