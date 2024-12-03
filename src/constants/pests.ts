import { Crop } from './crops.js';

export enum Pest {
	Beetle = 'beetle',
	Cricket = 'cricket',
	Worm = 'worm',
	Fly = 'fly',
	Locust = 'locust',
	Mite = 'mite',
	Mosquito = 'mosquito',
	Moth = 'moth',
	Rat = 'rat',
	Slug = 'slug',
	Mouse = 'mouse',
}

export const FORTUNE_PER_PEST_BRACKET = 0.4;

const killsPerPestBracket: Record<number, number> = {
	1: 1,
	2: 2,
	3: 3,
	4: 5,
	5: 7,
	6: 9,
	7: 14,
	8: 17,
	9: 21,
	10: 25,
	11: 50,
	12: 80,
	13: 125,
	14: 175,
	15: 250,
};

export const BESTIARY_PEST_BRACKETS: Record<Pest, Record<number, number>> = {
	[Pest.Beetle]: killsPerPestBracket,
	[Pest.Cricket]: killsPerPestBracket,
	[Pest.Worm]: killsPerPestBracket,
	[Pest.Fly]: killsPerPestBracket,
	[Pest.Locust]: killsPerPestBracket,
	[Pest.Mite]: killsPerPestBracket,
	[Pest.Mosquito]: killsPerPestBracket,
	[Pest.Moth]: killsPerPestBracket,
	[Pest.Rat]: killsPerPestBracket,
	[Pest.Slug]: killsPerPestBracket,
	[Pest.Mouse]: {
		1: 1,
		2: 2,
		3: 3,
		4: 5,
		5: 7,
		6: 9,
		7: 11,
		8: 14,
		9: 17,
		10: 20,
		11: 30,
		12: 40,
		13: 55,
		14: 75,
		15: 100,
	},
};

export const PEST_EXCHANGE_RATES = {
	0: 0,
	1: 10,
	2: 20,
	3: 30,
	4: 40,
	5: 50,
	6: 60,
	7: 70,
	8: 80,
	9: 90,
	10: 100,
	11: 105,
	12: 110,
	13: 115,
	14: 120,
	15: 125,
	16: 130,
	17: 135,
	18: 140,
	19: 145,
	20: 150,
	21: 153,
	22: 156,
	23: 159,
	24: 162,
	25: 165,
	26: 168,
	27: 171,
	28: 174,
	29: 177,
	30: 180,
	31: 182,
	32: 184,
	33: 186,
	34: 188,
	35: 190,
	36: 192,
	37: 194,
	38: 196,
	39: 198,
	40: 200,
};

export const PEST_IDS: Pest[] = [
	Pest.Beetle,
	Pest.Cricket,
	Pest.Worm,
	Pest.Fly,
	Pest.Locust,
	Pest.Mite,
	Pest.Mosquito,
	Pest.Moth,
	Pest.Rat,
	Pest.Slug,
	Pest.Mouse,
];

export const PEST_TO_CROP: Partial<Record<Pest, Crop>> = {
	mite: Crop.Cactus,
	cricket: Crop.Carrot,
	moth: Crop.CocoaBeans,
	worm: Crop.Melon,
	slug: Crop.Mushroom,
	beetle: Crop.NetherWart,
	locust: Crop.Potato,
	rat: Crop.Pumpkin,
	mosquito: Crop.SugarCane,
	fly: Crop.Wheat,
};

export const CROP_TO_PEST: Record<Crop, Pest> = {
	[Crop.Cactus]: Pest.Mite,
	[Crop.Carrot]: Pest.Cricket,
	[Crop.CocoaBeans]: Pest.Moth,
	[Crop.Melon]: Pest.Worm,
	[Crop.Mushroom]: Pest.Slug,
	[Crop.NetherWart]: Pest.Beetle,
	[Crop.Potato]: Pest.Locust,
	[Crop.Pumpkin]: Pest.Rat,
	[Crop.SugarCane]: Pest.Mosquito,
	[Crop.Wheat]: Pest.Fly,
	[Crop.Seeds]: Pest.Fly, // Same as wheat
};

export const PEST_COLLECTION_BRACKETS = [0, 50, 100, 250, 500, 750, 1000];

// Taken from https://api.elitebot.dev/weights/all
export const PEST_COLLECTION_ADJUSTMENTS: Omit<Record<Pest, Record<number, number>>, Pest.Mouse> = {
	mite: {
		'0': 0,
		'50': 392.81450646884014,
		'100': 669.923748937681,
		'250': 947.0330011428568,
		'500': 1224.1422338753637,
		'750': 1390.407781303933,
		'1000': 1556.6733482051768,
		'5000': 1778.3607382857135,
	},
	cricket: {
		'0': 0,
		'50': 489.7523779006233,
		'100': 902.7047558012473,
		'250': 1315.6571428571424,
		'500': 1728.609511602488,
		'750': 1976.3809401739236,
		'1000': 2224.152387055896,
		'5000': 2554.5142857142855,
	},
	moth: {
		'0': 0,
		'50': 298.189635562343,
		'100': 495.4108711246863,
		'250': 692.6321142857141,
		'500': 889.8533422493692,
		'750': 1008.1860851065103,
		'1000': 1126.5188431610259,
		'5000': 1284.2958285714303,
	},
	worm: {
		'0': 0,
		'50': 213.57277446402622,
		'100': 364.2367361280558,
		'250': 514.9007030857138,
		'500': 665.5646594561076,
		'750': 755.9630375132474,
		'1000': 846.3614261576658,
		'5000': 966.8925933714272,
	},
	slug: {
		'0': 0,
		'50': 167.24639496106215,
		'100': 285.229618722125,
		'250': 403.21284662857124,
		'500': 521.1960662442498,
		'750': 591.986001329964,
		'1000': 662.7759447064464,
		'5000': 757.1625220571423,
	},
	beetle: {
		'0': 0,
		'50': 853.9206973770688,
		'100': 1428.2624411541383,
		'250': 2002.6042084571436,
		'500': 2576.9459287082755,
		'750': 2921.550979679705,
		'1000': 3266.1560777030063,
		'5000': 3725.629463314286,
	},
	locust: {
		'0': 0,
		'50': 593.1620207157785,
		'100': 1049.2292862315571,
		'250': 1505.2965677714292,
		'500': 1961.3638172631108,
		'750': 2235.004179777403,
		'1000': 2508.6445743398726,
		'5000': 2873.4983803428586,
	},
	rat: {
		'0': 0,
		'50': 14.107772226298493,
		'100': 24.060037252596885,
		'250': 34.01230262857098,
		'500': 43.96456730519367,
		'750': 49.93592639090821,
		'1000': 55.90728617597506,
		'5000': 63.869098057142764,
	},
	mosquito: {
		'0': 0,
		'50': 20.584146115646945,
		'100': 35.10514023129508,
		'250': 49.62613485714246,
		'500': 64.14712846258954,
		'750': 72.85972503401717,
		'1000': 81.57232262585057,
		'5000': 93.18911771428247,
	},
	fly: { '50': 0, '100': 0, '250': 0, '500': 0, '750': 0, '1000': 0, '5000': 0, '0': 0 },
};
