const ADJECTIVES = [
    "Beautiful",
    "Charming",
    "Dazzling",
    "Elegant",
    "Fascinating",
    "Gorgeous",
    "Handsome",
    "Intelligent",
    "Joyful",
    "Kind",
    "Lovely",
    "Magnificent",
    "Noble",
    "Outstanding",
    "Passionate",
    "Quirky",
    "Radiant",
    "Sensible",
    "Thoughtful",
    "Unique",
    "Vibrant",
    "Wise",
    "Youthful",
    "Zealous",
    "Adorable",
    "Brave",
    "Caring",
    "Delightful",
    "Enchanting",
    "Friendly",
    "Gracious",
    "Humble",
    "Inspiring",
    "Jovial",
    "Loyal",
    "Modest",
    "Optimistic",
    "Patient",
    "Reliable",
    "Sincere",
    "Trustworthy",
    "Vivacious",
    "Ambitious",
    "Calm",
    "Determined",
    "Energetic",
    "Fearless",
    "Generous",
    "Honest",
    "Imaginative",
    "Jubilant",
    "Knowledgeable",
    "Lively",
    "Mysterious",
    "Nurturing",
    "OpenMinded",
    "Playful",
    "Quizzical",
    "Resourceful",
    "Serene",
    "Tenacious",
    "Understanding",
    "Versatile",
    "Whimsical",
    "Xtraordinary",
    "Youthful",
    "Zestful",
    "Attentive",
    "Bold",
    "Compassionate",
    "Dynamic",
    "Empathetic",
    "Grateful",
    "Harmonious",
    "Insightful",
    "Jubilant",
    "Kindhearted",
    "Loving",
    "Motivated",
    "Optimistic",
    "Passionate",
    "QuickWitted",
    "Resilient",
    "Selfless",
    "Talented",
    "Unassuming",
    "Vibrant",
    "Warmhearted",
    "Xtraordinary",
    "Yielding",
    "Zany",
    "Adventurous",
    "Bright",
    "Courageous",
    "Dependable",
    "Eloquent",
    "Fearless",
    "Gentle",
    "Honest",
    "Imaginative"
  ];

  const COLORS = [
    "Aqua",
    "Azure",
    "Beige",
    "Black",
    "Blue",
    "Brown",
    "Coral",
    "Crimson",
    "Cyan",
    "Gold",
    "Gray",
    "Green",
    "Indigo",
    "Ivory",
    "Lavender",
    "Lime",
    "Magenta",
    "Maroon",
    "Navy",
    "Olive",
    "Orange",
    "Orchid",
    "Peach",
    "Pink",
    "Plum",
    "Purple",
    "Red",
    "Rose",
    "Salmon",
    "Silver",
    "SkyBlue",
    "SlateGray",
    "Teal",
    "Turquoise",
    "Violet",
    "White",
    "Yellow",
    "Amber",
    "Apricot",
    "Aquamarine",
    "Chartreuse",
    "Coral",
    "Cyan",
    "Emerald",
    "Fuchsia",
    "Goldenrod",
    "Lilac",
    "Mauve",
    "Periwinkle",
    "Sapphire",
    "Tangerine",
    "TerraCotta"
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
    "Bub",
    "Bob",
    "Bobbus",
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
    "Zebra"
  ];

export function generateGameId(){
    return ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)] + COLORS[Math.floor(Math.random() * COLORS.length)] + ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
}