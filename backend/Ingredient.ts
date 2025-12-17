import { Substitute } from "./Substitute";

export type RecipeType =
  | "cake"
  | "cookie"
  | "bread"
  | "pancakes"
  | "waffles"
  | "dessert"
  | "other";

export class Ingredient {
	name: string
	recipeTypes: RecipeType[];
	substitutes: Substitute[]
	constructor (name: string, recipeTypes: RecipeType[], substitutes: Substitute[]) {
		this.name = name.toLowerCase().trim();
		this.recipeTypes = recipeTypes;
		this.substitutes = substitutes;
	}

	supportsRecipe(recipeType: RecipeType): boolean {
		return this.recipeTypes.includes(recipeType);
	  }
}

