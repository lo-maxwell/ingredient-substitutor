import { Effects } from "./Effects";

export type IngredientAmount = {
  ingredient: string;
  quantity: number;
  unit: string;
};

export class Substitute {
  name: string;

  baseAmount: IngredientAmount;
  substitution: IngredientAmount[];

  recipeTypes: string[]; // Added to match new JSON structure

  instructions?: string;
  tags: string[];
  effects: Effects;
  confidence: number;

  constructor(
    name: string,
    baseAmount: IngredientAmount,
    substitution: IngredientAmount[],
    tags: string[],
    effects: Effects,
    confidence: number,
    recipeTypes: string[], // Added parameter
    instructions?: string
  ) {
    this.name = name;
    this.baseAmount = baseAmount;
    this.substitution = substitution;
    this.tags = tags;
    this.effects = effects;
    this.confidence = confidence;
    this.recipeTypes = recipeTypes;
    this.instructions = instructions;
  }
}
