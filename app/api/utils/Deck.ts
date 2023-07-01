import { GAME_DECK } from "@/app/util/GameDeck";
import { GameCard } from "@/app/util/CardTypes";
import Srand from "seeded-rand";

export interface ActiveCards {
  revealedNumbers: GameCard[];
  revealedModifiers: GameCard[];
}

// Create random seed at game start time, store it + number cards drawn, and re-shuffle deck whenever we draw new cards.
// Deterministically shuffle and then use the offset to determine how many draws have occurred
// Offset will be multiples of 3 -- will start at because the first turn of the game has 3 cards drawn
export function shuffleWithSeedAndDrawOffset(seed: number, offset: number): GameCard[] {
  const deck = GAME_DECK;
  const srandSeeded = new Srand(seed);
  const res: GameCard[] = srandSeeded.shuffle(deck);

  // now that we have the full shuffled deck, draw the number of times as indicated by the offset.
  // the offset represents the number of times we've drawn, not the number of cards
  // there are 81 cards in the base version, so a maximum of 27 draws per deck state.
  // once we've exhausted all 27 draws (or a player chooses to reshuffle via completing an objective),
  // we'll generate a new seed and start all over again.
  // stop at offset-1 because we will draw the final three cards of the offset in the draw function
  // ex: turn 1 (first turn of the game) means we need to flip over (offset 1) set of cards
  const remainingDeck: GameCard[] = res.slice(0, res.length - (offset - 1) * 3);

  return remainingDeck;
}

// The deck has numbers facing up, with a peek at what their backing type is (FENCE, GARDEN, etc.)
// WHen you draw cards, you flip the numbers down so that their backing type is revealed, also
// revealing a new set of numbers.
// the index lines up the modifiers with the numbers in play
export function drawCards(deck: GameCard[]): ActiveCards {
  const revealedModifiers: GameCard[] = deck.slice(deck.length - 3);
  const remainingDeck: GameCard[] = deck.slice(0, deck.length - 3);
  const revealedNumbers: GameCard[] = remainingDeck.slice(remainingDeck.length - 3);
  const res: ActiveCards = {
    revealedNumbers: revealedNumbers,
    revealedModifiers: revealedModifiers,
  };
  return res;
}
