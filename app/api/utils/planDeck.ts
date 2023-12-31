import { PlanCard } from "../../util/cardTypes";

const PLAN_DECK_1: PlanCard[] = [
  {
    firstValue: 10,
    secondValue: 6,
    difficulty: 1,
    requirements: [{ size: 6, quantity: 2 }],
    completed: false,
    turnCompleted: -1,
  },
  {
    firstValue: 8,
    secondValue: 4,
    difficulty: 1,
    requirements: [{ size: 1, quantity: 6 }],
    completed: false,
    turnCompleted: -1,
  },
  {
    firstValue: 6,
    secondValue: 3,
    difficulty: 1,
    requirements: [{ size: 4, quantity: 2 }],
    completed: false,
    turnCompleted: -1,
  },
  {
    firstValue: 8,
    secondValue: 4,
    difficulty: 1,
    requirements: [{ size: 3, quantity: 3 }],
    completed: false,
    turnCompleted: -1,
  },
  {
    firstValue: 8,
    secondValue: 4,
    difficulty: 1,
    requirements: [{ size: 2, quantity: 4 }],
    completed: false,
    turnCompleted: -1,
  },
  {
    firstValue: 8,
    secondValue: 4,
    difficulty: 1,
    requirements: [{ size: 5, quantity: 2 }],
    completed: false,
    turnCompleted: -1,
  },
];

const PLAN_DECK_2: PlanCard[] = [
  {
    firstValue: 9,
    secondValue: 5,
    difficulty: 2,
    requirements: [
      { size: 4, quantity: 1 },
      { size: 1, quantity: 3 },
    ],
    completed: false,
    turnCompleted: -1,
  },
  {
    firstValue: 12,
    secondValue: 7,
    difficulty: 2,
    requirements: [
      { size: 3, quantity: 2 },
      { size: 4, quantity: 1 },
    ],
    completed: false,
    turnCompleted: -1,
  },
  {
    firstValue: 8,
    secondValue: 4,
    difficulty: 2,
    requirements: [
      { size: 3, quantity: 1 },
      { size: 6, quantity: 1 },
    ],
    completed: false,
    turnCompleted: -1,
  },
  {
    firstValue: 10,
    secondValue: 6,
    difficulty: 2,
    requirements: [
      { size: 5, quantity: 1 },
      { size: 2, quantity: 2 },
    ],
    completed: false,
    turnCompleted: -1,
  },
  {
    firstValue: 11,
    secondValue: 6,
    difficulty: 2,
    requirements: [
      { size: 1, quantity: 3 },
      { size: 6, quantity: 1 },
    ],
    completed: false,
    turnCompleted: -1,
  },
  {
    firstValue: 9,
    secondValue: 5,
    difficulty: 2,
    requirements: [
      { size: 4, quantity: 1 },
      { size: 5, quantity: 1 },
    ],
    completed: false,
    turnCompleted: -1,
  },
];

const PLAN_DECK_3: PlanCard[] = [
  {
    firstValue: 13,
    secondValue: 7,
    difficulty: 3,
    requirements: [
      { size: 2, quantity: 1 },
      { size: 3, quantity: 1 },
      { size: 5, quantity: 1 },
    ],
    completed: false,
    turnCompleted: -1,
  },
  {
    firstValue: 7,
    secondValue: 3,
    difficulty: 3,
    requirements: [
      { size: 3, quantity: 1 },
      { size: 4, quantity: 1 },
    ],
    completed: false,
    turnCompleted: -1,
  },
  {
    firstValue: 13,
    secondValue: 7,
    difficulty: 3,
    requirements: [
      { size: 1, quantity: 1 },
      { size: 4, quantity: 1 },
      { size: 5, quantity: 1 },
    ],
    completed: false,
    turnCompleted: -1,
  },
  {
    firstValue: 11,
    secondValue: 6,
    difficulty: 3,
    requirements: [
      { size: 1, quantity: 1 },
      { size: 2, quantity: 2 },
      { size: 3, quantity: 1 },
    ],
    completed: false,
    turnCompleted: -1,
  },
  {
    firstValue: 7,
    secondValue: 3,
    difficulty: 3,
    requirements: [
      { size: 2, quantity: 1 },
      { size: 5, quantity: 1 },
    ],
    completed: false,
    turnCompleted: -1,
  },
  {
    firstValue: 12,
    secondValue: 7,
    difficulty: 3,
    requirements: [
      { size: 1, quantity: 1 },
      { size: 2, quantity: 1 },
      { size: 5, quantity: 1 },
    ],
    completed: false,
    turnCompleted: -1,
  },
];

export function drawPlans() {
  return [
    PLAN_DECK_1[Math.floor(Math.random() * PLAN_DECK_1.length)],
    PLAN_DECK_2[Math.floor(Math.random() * PLAN_DECK_2.length)],
    PLAN_DECK_3[Math.floor(Math.random() * PLAN_DECK_3.length)],
  ];
}
