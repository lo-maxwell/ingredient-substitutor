import { Substitute } from "./Substitute";

export type RecipeType =
  | "cake"
  | "cookie"
  | "quick bread"
  | "yeast bread"
  | "pancake"
  | "other";

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

  // Optionally, get all substitutes for a given recipe type
  getSubstitutesForRecipe(recipeType: RecipeType): Substitute[] {
    return this.substitutes.filter(sub => sub.recipeTypes.includes(recipeType));
  }
}
