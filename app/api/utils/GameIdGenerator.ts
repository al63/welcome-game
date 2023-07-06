const ADJECTIVES = [
  "Abundant",
  "Acidic",
  "Acrobatic",
  "Adventurous",
  "Affectionate",
  "Agile",
  "Alert",
  "Altruistic",
  "Ambitious",
  "Amiable",
  "Ample",
  "Ancient",
  "Angry",
  "Annoyed",
  "Anxious",
  "Apprehensive",
  "Artistic",
  "Ashamed",
  "Astonishing",
  "Athletic",
  "Attentive",
  "Attractive",
  "Average",
  "Awkward",
  "Beautiful",
  "Beeg",
  "Benevolent",
  "Bewildered",
  "Big",
  "Bitter",
  "Blissful",
  "Boisterous",
  "Bold",
  "Bountiful",
  "Brave",
  "Bright",
  "Brilliant",
  "Busy",
  "Calm",
  "Capable",
  "Careful",
  "Careless",
  "Cautious",
  "Charming",
  "Cheerful",
  "Chilly",
  "Clumsy",
  "Cold",
  "Colossal",
  "Comfortable",
  "Comical",
  "Compassionate",
  "Competent",
  "Confident",
  "Confused",
  "Considerate",
  "Content",
  "Cooperative",
  "Courageous",
  "Cowardly",
  "Crazed",
  "Crazy",
  "Creamy",
  "Creative",
  "Creepy",
  "Cruel",
  "Curious",
  "Dainty",
  "Dangerous",
  "Daring",
  "Dark",
  "Dazzling",
  "Dead",
  "Deafening",
  "Decisive",
  "Deep",
  "Defiant",
  "Delicate",
  "Delightful",
  "Depressed",
  "Determined",
  "Devoted",
  "Dirty",
  "Disgusted",
  "Distinct",
  "Dizzy",
  "Drab",
  "Dramatic",
  "Dull",
  "Eager",
  "Easygoing",
  "Eccentric",
  "Ecstatic",
  "Elated",
  "Elegant",
  "Embarrassed",
  "Enchanting",
  "Encouraging",
  "Energetic",
  "Enormous",
  "Enthusiastic",
  "Evil",
  "Exasperated",
  "Excellent",
  "Excitable",
  "Excited",
  "Exhausted",
  "Exhilarated",
  "Extraordinary",
  "Fair",
  "Faithful",
  "Fancy",
  "Fantastic",
  "Fearful",
  "Fierce",
  "Filthy",
  "Fine",
  "Flamboyant",
  "Flawless",
  "Flexible",
  "Fluffy",
  "Foolish",
  "Forceful",
  "Fragile",
  "Frail",
  "Frantic",
  "Freezing",
  "Friendly",
  "Frightened",
  "Frivolous",
  "Frothy",
  "Frustrated",
  "Funny",
  "Furious",
  "Gentle",
  "Giddy",
  "Gifted",
  "Gigantic",
  "Glad",
  "Gloomy",
  "Glorious",
  "Graceful",
  "Grateful",
  "Greedy",
  "Grieving",
  "Grumpy",
  "Handsome",
  "Happy",
  "Hardworking",
  "Harmful",
  "Harmonious",
  "Harsh",
  "Healthy",
  "Heartfelt",
  "Helpful",
  "Hesitant",
  "Honest",
  "Hopeful",
  "Horrified",
  "Hospitable",
  "Humble",
  "Humorous",
  "Hungry",
  "Hurried",
  "Hypnotic",
  "Idealistic",
  "Ignorant",
  "Ill",
  "Imaginative",
  "Impatient",
  "Impressive",
  "Inquisitive",
  "Insane",
  "Insecure",
  "Intelligent",
  "Intense",
  "Intimidating",
  "Intriguing",
  "Inventive",
  "Irresponsible",
  "Irritable",
  "Itchy",
  "Jolly",
  "Joyful",
  "Jubilant",
  "Jumpy",
  "Kind",
  "Lazy",
  "Lively",
  "Lonely",
  "Longing",
  "Loud",
  "Loving",
  "Lucky",
  "Lustrous",
  "Mad",
  "Magical",
  "Malicious",
  "Melancholic",
  "Mellow",
  "Meticulous",
  "Mighty",
  "Mischievous",
  "Miserable",
  "Misguided",
  "Modest",
  "Moody",
  "Motivated",
  "Mysterious",
  "Nasty",
  "Naughty",
  "Nervous",
  "Nice",
  "Obedient",
  "Obnoxious",
  "Optimistic",
  "Ordinary",
  "Outgoing",
  "Outrageous",
  "Overjoyed",
  "Painful",
  "Passionate",
  "Patient",
  "Peaceful",
  "Perfect",
  "Playful",
  "Pleasant",
  "Plucky",
  "Polite",
  "Powerful",
  "Precious",
  "Proud",
  "Puzzled",
  "Quaint",
  "Quick",
  "Quiet",
  "Quirky",
  "Radiant",
  "Rash",
  "Rebellious",
  "Reflective",
  "Relaxed",
  "Reliable",
  "Remarkable",
  "Repulsive",
  "Resilient",
  "Responsible",
  "Restless",
  "Rich",
  "Ridiculous",
  "Robust",
  "Rude",
  "Sad",
  "Salty",
  "Sassy",
  "Scared",
  "Scary",
  "Selfish",
  "Sensible",
  "Sensitive",
  "Serene",
  "Serious",
  "Shiny",
  "Shy",
  "Silly",
  "Sincere",
  "Skillful",
  "Sleek",
  "Sleepy",
  "Slimy",
  "Sloppy",
  "Slow",
  "Sly",
  "Smart",
  "Smelly",
  "Smiling",
  "Smol",
  "Smooth",
  "Sneaky",
  "Soft",
  "Solemn",
  "Solid",
  "Sorrowful",
  "Sparkling",
  "Spicy",
  "Spirited",
  "Splendid",
  "Spontaneous",
  "Squeaky",
  "Squeaky",
  "Stable",
  "Stable",
  "Stern",
  "Stern",
  "Sticky",
  "Sticky",
  "Stinky",
  "Strange",
  "Strange",
  "Strong",
  "Strong",
  "Stubborn",
  "Stubborn",
  "Sturdy",
  "Sturdy",
  "Subtle",
  "Successful",
  "Sulky",
  "Sunny",
  "Surprised",
  "Suspicious",
  "Sweet",
  "Swift",
  "Sympathetic",
  "Tactful",
  "Talented",
  "Talkative",
  "Tasty",
  "Tenacious",
  "Tender",
  "Thankful",
  "Thoughtful",
  "Thrilled",
  "Timid",
  "Tired",
  "Tolerant",
  "Tough",
  "Tranquil",
  "Trusting",
  "Trustworthy",
  "Truthful",
  "Ugly",
  "Unbelievable",
  "Unbiased",
  "Uncomfortable",
  "Unconventional",
  "Understanding",
  "Unforgettable",
  "Unique",
  "Unpredictable",
  "Unusual",
  "Upbeat",
  "Uplifting",
  "Valiant",
  "Vibrant",
  "Victorious",
  "Vigilant",
  "Vivacious",
  "Wandering",
  "Warm",
  "Wary",
  "Weak",
  "Wealthy",
  "Weary",
  "Whimsical",
  "Wild",
  "Wise",
  "Witty",
  "Wonderful",
  "Worried",
  "Wretched",
  "Wrong",
  "Youthful",
  "Zealous",
];

const COLORS = [
  "Alabaster",
  "AliceBlue",
  "AlloyOrange",
  "Almond",
  "Amaranth",
  "Amber",
  "Amethyst",
  "AntiqueBrass",
  "Aqua",
  "Aquamarine",
  "ArcticBlue",
  "ArmyGreen",
  "AshGray",
  "Auburn",
  "Azure",
  "BabyBlue",
  "BabyPink",
  "BananaYellow",
  "Beige",
  "Berry",
  "BerylGreen",
  "Bistre",
  "Black",
  "BlanchedAlmond",
  "Blue",
  "BlueGray",
  "BlueGreen",
  "BlueViolet",
  "BlushPink",
  "BrickRed",
  "BrightGreen",
  "Bronze",
  "Brown",
  "BubbleGumPink",
  "Buff",
  "Burgundy",
  "BurntOrange",
  "BurntSienna",
  "BurntUmber",
  "CadetBlue",
  "CanaryYellow",
  "CandyPink",
  "Caramel",
  "CardinalRed",
  "CaribbeanGreen",
  "Carmine",
  "CarolinaBlue",
  "Celadon",
  "CelestialBlue",
  "Cerise",
  "Cerulean",
  "Champagne",
  "Chartreuse",
  "CherryBlossomPink",
  "Chestnut",
  "ChocolateBrown",
  "Cinnamon",
  "Citrine",
  "CitrusOrange",
  "Claret",
  "CobaltBlue",
  "CoffeeBrown",
  "CoolGray",
  "Copper",
  "Coral",
  "CoralPink",
  "CornflowerBlue",
  "Cornsilk",
  "Cream",
  "Crimson",
  "Cyan",
  "DandelionYellow",
  "DarkBlue",
  "DarkBrown",
  "DarkCyan",
  "DarkGoldenrod",
  "DarkGray",
  "DarkGreen",
  "DarkKhaki",
  "DarkMagenta",
  "DarkOliveGreen",
  "DarkOrange",
  "DarkOrchid",
  "DarkRed",
  "DarkSalmon",
  "DarkSeaGreen",
  "DarkSlateBlue",
  "DarkSlateGray",
  "DarkTurquoise",
  "DarkViolet",
  "DeepPink",
  "DeepSkyBlue",
  "DenimBlue",
  "DesertSand",
  "DodgerBlue",
  "Eggplant",
  "ElectricBlue",
  "ElectricGreen",
  "EmeraldGreen",
  "FernGreen",
  "Firebrick",
  "FlamingoPink",
  "ForestGreen",
  "Fuchsia",
  "FuzzyWuzzyBrown",
  "Gainsboro",
  "GambogeOrange",
  "GhostWhite",
  "Ginger",
  "GlaucousBlue",
  "Gold",
  "Goldenrod",
  "GrannySmithApple",
  "GrapePurple",
  "GrassGreen",
  "Gray",
  "Green",
  "GreenYellow",
  "Honeydew",
  "HotPink",
  "IndianRed",
  "Indigo",
  "Ivory",
  "JadeGreen",
  "Jasmine",
  "JungleGreen",
  "Khaki",
  "LapisLazuliBlue",
  "Lavender",
  "LemonYellow",
  "LightBlueLightCoral",
  "LightCyan",
  "LightGoldenrod",
  "LightGray",
  "LightGreen",
  "LightPink",
  "LightSalmon",
  "LightSeaGreen",
  "LightSkyBlue",
  "LightSlateGray",
  "LightSteelBlue",
  "LightYellow",
  "Lilac",
  "LimeGreen",
  "LimeYellow",
  "Linen",
  "Magenta",
  "Mahogany",
  "Maize",
  "MalachiteGreen",
  "Mango",
  "Maroon",
  "Mauve",
  "MediumAquamarine",
  "MediumBlue",
  "MediumOrchid",
  "MediumPurple",
  "MediumSeaGreen",
  "MediumSlateBlue",
  "MediumSpringGreen",
  "MediumTurquoise",
  "MediumVioletRed",
  "MidnightBlue",
  "MintCream",
  "MistyRose",
  "Moccasin",
  "MoonstoneBlue",
  "MossGreen",
  "MountainMeadowGreen",
  "MustardYellow",
  "MyrtleGreen",
  "NavajoWhite",
  "NavyBlue",
  "NeonGreen",
  "Ochre",
  "OldGold",
  "OldLace",
  "Olive",
  "OliveDrab",
  "Orange",
  "OrangeRed",
  "Orchid",
  "PaleAqua",
  "PaleBlue",
  "PaleBrown",
  "PaleCyan",
  "PaleGoldenrod",
  "PaleGray",
  "PaleGreen",
  "PalePink",
  "PalePlum",
  "PaleTurquoise",
  "PaleViolet",
  "PapayaWhip",
  "PastelBlue",
  "PastelGreen",
  "PastelPink",
  "Peach",
  "PearGreen",
  "Periwinkle",
  "PersianBlue",
  "PineGreen",
  "Pink",
  "PinkLavender",
  "Plum",
  "PowderBlue",
  "PumpkinOrange",
  "Purple",
  "Red",
  "RichBlack",
  "RobinEggBlue",
  "Rose",
  "RoseGold",
  "RosePink",
  "RoyalBlue",
  "RubyRed",
  "Russet",
  "RustOrange",
  "Saffron",
  "Salmon",
  "SandyBrown",
  "SapGreen",
  "SeaBlue",
  "SeaGreen",
  "Seashell",
  "Sepia",
  "ShadowBlue",
  "ShamrockGreen",
  "ShockingPink",
  "Sienna",
  "Silver",
  "SkyBlue",
  "SlateBlue",
  "SlateGray",
  "SmokyBlack",
  "SnowWhite",
  "SpringGreen",
  "SteelBlue",
  "SunflowerYellow",
  "Tan",
  "Tangerine",
  "Taupe",
  "Teal",
  "Thistle",
  "TomatoRed",
  "Topaz",
  "Turquoise",
  "UltramarineBlue",
  "Umber",
  "Vanilla",
  "Vermilion",
  "Violet",
  "ViridianGreen",
  "WarmGray",
  "Wheat",
  "White",
  "WhiteSmoke",
  "WildStrawberry",
  "WillowGreen",
  "WisteriaPurple",
  "XanaduGreen",
  "Yellow",
  "YellowGreen",
  "YellowOrange",
  "ZaffreBlue",
];

const ANIMALS = [
  "Alligator",
  "Ant",
  "Anteater",
  "Antelope",
  "Armadillo",
  "Baboon",
  "Badger",
  "Barracuda",
  "Bat",
  "Beaver",
  "Bluejay",
  "Bob",
  "Bobbus",
  "Bub",
  "Buffalo",
  "Butterfly",
  "Camel",
  "Capybara",
  "Caterpillar",
  "Cheetah",
  "Chimpanzee",
  "Cobra",
  "Cockroach",
  "Crab",
  "Crocodile",
  "Dinosaur",
  "Dolphin",
  "Donkey",
  "Dragonfly",
  "Eagle",
  "Elephant",
  "Falcon",
  "Ferret",
  "Flamingo",
  "Frog",
  "Gazelle",
  "Giraffe",
  "Gorilla",
  "Grasshopper",
  "Hamster",
  "Hedgehog",
  "Hippopotamus",
  "Hummingbird",
  "Hyena",
  "Iguana",
  "Impala",
  "Jackal",
  "Jellyfish",
  "Kangaroo",
  "Koala",
  "Komodo",
  "Leopard",
  "Lion",
  "Lizard",
  "Llama",
  "Lobster",
  "Magpie",
  "Mantis",
  "Mongoose",
  "Monkey",
  "Moose",
  "Mosquito",
  "Narwhal",
  "Octopus",
  "Opossum",
  "Ostrich",
  "Otter",
  "Owl",
  "Panther",
  "Pelican",
  "Penguin",
  "Porcupine",
  "Puma",
  "Quail",
  "Rabbit",
  "Raccoon",
  "Rat",
  "Rhinoceros",
  "Salamander",
  "Scorpion",
  "Seahorse",
  "Seal",
  "Shark",
  "Sheep",
  "Skunk",
  "Sloth",
  "Snake",
  "Sparrow",
  "Squirrel",
  "Starfish",
  "Stingray",
  "Tiger",
  "Toucan",
  "Turkey",
  "Turtle",
  "Vulture",
  "Walrus",
  "Warthog",
  "Whale",
  "Wolf",
  "Wolverine",
  "Wombat",
  "Woodpecker",
  "Yak",
  "Zebra",
];

const CITY_DESCRIPTORS = [
  "Abode",
  "Abode",
  "Acreage",
  "Area",
  "Avenue",
  "Borough",
  "Boulevard",
  "Building",
  "Bungalow",
  "Capital City",
  "Capital",
  "Capital",
  "Capital",
  "Castle",
  "Chateau",
  "Citadel",
  "Citadel",
  "Citadel",
  "City",
  "City",
  "Cityscape",
  "Cityscape",
  "Close",
  "Colony",
  "Commonwealth",
  "Community",
  "Conurbation",
  "Cosmopolis",
  "Cottage",
  "Country",
  "Countryside",
  "Countrywide",
  "County",
  "Court",
  "Crescent",
  "District",
  "Domain",
  "Domain",
  "Domain",
  "Domain",
  "Domain",
  "Domicile",
  "Dominion",
  "Downtown",
  "Duchy",
  "Dwelling",
  "Earth",
  "Empire",
  "Empire",
  "Enclave",
  "Estate",
  "Estate",
  "Farm",
  "Farm",
  "Farmhouse",
  "Farmland",
  "Field",
  "Field",
  "Green",
  "Ground",
  "Ground",
  "Grounds",
  "Habitat",
  "Hall",
  "Hamlet",
  "Hamlet",
  "Holding",
  "Home",
  "Homestead",
  "Homestead",
  "Kingdom",
  "Land",
  "Landmark",
  "Landmass",
  "Landscape",
  "Lane",
  "Locale",
  "Locale",
  "Locality",
  "Lot",
  "Manor",
  "Manor",
  "Mansion",
  "Mansion",
  "Meadow",
  "Meadowland",
  "Megacity",
  "Megacity",
  "Megalopol",
  "Megalopolis",
  "Megalopolis",
  "Megatropolis",
  "Metropolis",
  "Metropolis",
  "Metropolis",
  "Monarchy",
  "Municipality",
  "Municipality",
  "Municipality",
  "Nation",
  "Nature",
  "Neighborhood",
  "Outback",
  "Palace",
  "Palace",
  "Parcel",
  "Park",
  "Parkland",
  "Pasture",
  "Plantation",
  "Plot",
  "Preserve",
  "Principality",
  "Principality",
  "Property",
  "Province",
  "Province",
  "Quarter",
  "Ranch",
  "Realm",
  "Realm",
  "Region",
  "Republic",
  "Reserve",
  "Residence",
  "Residence",
  "Road",
  "Sector",
  "Settlement",
  "Settlement",
  "Shire",
  "Site",
  "Site",
  "Soil",
  "Soil",
  "Sovereignty",
  "Sovereignty",
  "Square",
  "State",
  "Street",
  "Subdivision",
  "Suburb",
  "Suburb",
  "Suburbia",
  "Terrain",
  "Terrain",
  "Territory",
  "Territory",
  "Tower",
  "Town",
  "Townlet",
  "Township",
  "Tract",
  "Villa",
  "Village",
  "Village",
  "Wild",
  "Wilderness",
  "Zone",
];

const NOUNS = [
  "AlarmClocks",
  "Apples",
  "Apricots",
  "Aprons",
  "Asparagus",
  "Avocados",
  "Backpacks",
  "Bacons",
  "BakingTrays",
  "BalletShoes",
  "Bananas",
  "Bandages",
  "BaseballBats",
  "Basketballs",
  "BeachTowels",
  "Beds",
  "Beef",
  "BellPeppers",
  "Bicycles",
  "Binoculars",
  "Birds",
  "Blackberries",
  "Blankets",
  "Blenders",
  "Blueberries",
  "Boats",
  "Books",
  "Bowls",
  "Breads",
  "Broccoli",
  "Brooms",
  "Buckets",
  "Burgers",
  "Burgers",
  "Burritos",
  "Butters",
  "Cabbages",
  "Cakes",
  "Cakes",
  "Calculators",
  "Calendars",
  "Cameras",
  "CampingChairs",
  "Candles",
  "Carrots",
  "Cars",
  "Cars",
  "Cats",
  "Cauliflowers",
  "Celeries",
  "Cereals",
  "Chairs",
  "Cheeses",
  "Cherries",
  "ChessPieces",
  "Chessboards",
  "Chicken",
  "ChiliPeppers",
  "Chocolates",
  "Coconuts",
  "CoffeeMachines",
  "CoffeeMugs",
  "Compasses",
  "Compost",
  "Conditioners",
  "Cookies",
  "Coolers",
  "Corn",
  "Cucumbers",
  "Cups",
  "Curries",
  "CuttingBoards",
  "CyclingHelmets",
  "Desks",
  "Dishwashers",
  "Dogs",
  "Dolphins",
  "Drumsticks",
  "Dumbbells",
  "Dustpans",
  "Eagles",
  "Eggplants",
  "Eggs",
  "Elephants",
  "ExerciseMats",
  "Figs",
  "Firewood",
  "FirstAidKits",
  "Fish",
  "Fish",
  "FishingRods",
  "Flowers",
  "FlowerVases",
  "FootballCleats",
  "FootballHelmets",
  "Forks",
  "FriedChicken",
  "Garlic",
  "Giraffes",
  "Glasses",
  "Goggles",
  "GolfClubs",
  "Grapes",
  "GreenBeans",
  "Guacamole",
  "GuitarPicks",
  "Guitars",
  "Guitars",
  "Hairbrushes",
  "Hairdryers",
  "Hammers",
  "Hammocks",
  "Hams",
  "Harmonicas",
  "Headphones",
  "Honeys",
  "Houses",
  "Hummus",
  "Ice",
  "IceCream",
  "InsectRepellents",
  "IroningBoards",
  "Irons",
  "Islands",
  "Jackets",
  "Jackets",
  "Jams",
  "Jeans",
  "JumpRopes",
  "Jungles",
  "Kales",
  "Kangaroos",
  "Keychains",
  "Keys",
  "Kiwis",
  "Knives",
  "Lambs",
  "Lamps",
  "Lamps",
  "LaptopBags",
  "Laptops",
  "Lasagnas",
  "LaundryDetergents",
  "Lemons",
  "Lettuces",
  "LifeJackets",
  "Limes",
  "Lions",
  "Makeup",
  "Mangos",
  "Maps",
  "Marshmallows",
  "Meatballs",
  "Medicines",
  "Microphones",
  "Microwaves",
  "Milk",
  "Mirrors",
  "Mixers",
  "Moons",
  "Mops",
  "Motorbikes",
  "Mountains",
  "Mushrooms",
  "NailPolishes",
  "Nests",
  "Ninjas",
  "Noodles",
  "Notebooks",
  "Oats",
  "Oceans",
  "Onions",
  "Oranges",
  "OvenMitts",
  "Ovens",
  "Owls",
  "Paintings",
  "Pancakes",
  "Pans",
  "Papayas",
  "Passports",
  "Pastas",
  "Pastas",
  "Peaches",
  "PeanutButter",
  "Pears",
  "Peas",
  "Pencils",
  "Penguins",
  "Pens",
  "Perfumes",
  "Pestos",
  "Phones",
  "Pianos",
  "Pianos",
  "PicnicBaskets",
  "PictureFrames",
  "Pillows",
  "Pineapples",
  "Pizzas",
  "Pizzas",
  "Planes",
  "Plants",
  "Plates",
  "Plums",
  "Pomegranates",
  "Pork",
  "Potatoes",
  "Pots",
  "Printers",
  "Projectors",
  "Pumpkins",
  "Queens",
  "Quills",
  "Quinoa",
  "Radishes",
  "Raspberries",
  "Razors",
  "Refrigerators",
  "RemoteControls",
  "Rice",
  "Rivers",
  "Robots",
  "RollerSkates",
  "RunningShoes",
  "Sails",
  "Salads",
  "Salmon",
  "Salsas",
  "Sandwiches",
  "Sausages",
  "Saxophones",
  "Scales",
  "Scanners",
  "Sculptures",
  "Shampoos",
  "SheetMusic",
  "Shoes",
  "Shrimp",
  "Skateboards",
  "SleepingBags",
  "Snacks",
  "SoapDispensers",
  "Soaps",
  "SoccerBalls",
  "Socks",
  "Soups",
  "Speakers",
  "Spinaches",
  "Spoons",
  "Squashes",
  "Staplers",
  "StirFries",
  "Strawberries",
  "Suitcases",
  "Sunglasses",
  "Suns",
  "Sunscreens",
  "Sushi",
  "Sushi",
  "SweetPotatoes",
  "SwimCaps",
  "Swimsuits",
  "Tables",
  "Tacos",
  "TapeDispensers",
  "Telescopes",
  "TennisRackets",
  "Tents",
  "Thermometers",
  "Tigers",
  "TissueBoxes",
  "Tomatoes",
  "Toothbrushes",
  "Toothpastes",
  "Towels",
  "Trains",
  "Trash",
  "TrashCans",
  "Trees",
  "Trumpets",
  "TShirts",
  "Tuna",
  "Turkeys",
  "TVs",
  "Umbrellas",
  "Umbrellas",
  "Unicorns",
  "USBDrives",
  "VacuumCleaners",
  "VideoGames",
  "Violins",
  "Violins",
  "Volcanoes",
  "Volleyballs",
  "Waffles",
  "Wallets",
  "Watches",
  "Water bottles",
  "Water",
  "WaterFilters",
  "Watermelons",
  "Whales",
  "Whiteboards",
  "WineGlasses",
  "X-rays",
  "Xylophones",
  "Yachts",
  "YogaBlocks",
  "YogaMats",
  "Yogurts",
  "Yogurts",
  "Zebras",
  "Zoos",
  "Zucchinis",
];

const randomNumber = Math.floor(Math.random() * 2);
export function generateGameId() {
  return (
    ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)] +
    COLORS[Math.floor(Math.random() * COLORS.length)] +
    (randomNumber == 0
      ? ANIMALS[Math.floor(Math.random() * ANIMALS.length)]
      : NOUNS[Math.floor(Math.random() * NOUNS.length)])
  );
}

export function generateCityName() {
  return (
    ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)] +
    " " +
    CITY_DESCRIPTORS[Math.floor(Math.random() * CITY_DESCRIPTORS.length)] +
    " of " +
    (randomNumber == 0
      ? NOUNS[Math.floor(Math.random() * NOUNS.length)]
      : "the " + ANIMALS[Math.floor(Math.random() * ANIMALS.length)])
  );
}
