import { Substitute } from "./Substitute";

export const ALL_RECIPE_TYPES = [
  "cake",
  "cookie",
  "quick bread",
  "yeast bread",
  "pancake",
  "other",
];

export type RecipeType = typeof ALL_RECIPE_TYPES[number];

export function isRecipeType(value: string): value is RecipeType {
  return (ALL_RECIPE_TYPES as readonly string[]).includes(value);
}

export class Ingredient {
  name: string;
  substitutes: Substitute[];

  constructor(name: string, substitutes: Substitute[]) {
    this.name = name.toLowerCase().trim();
    this.substitutes = substitutes;
  }

  // Check if any substitute supports the given recipe type
  supportsRecipe(recipeType: RecipeType): boolean {
    return this.substitutes.some(sub => sub.recipeTypes.includes(recipeType));
  }

  // Get all substitutes for a given recipe type
  getSubstitutesForRecipe(recipeType: RecipeType): Substitute[] {
    return this.substitutes.filter(sub => sub.recipeTypes.includes(recipeType));
  }
}
