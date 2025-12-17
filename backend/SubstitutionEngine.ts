// import data from '@/data/substitutions.json';
import { Effects } from './Effects';
import { Ingredient, RecipeType } from './Ingredient';
import { IngredientAmount, Substitute } from './Substitute';
import dataJson from '@/data/substitutions.json';
const data = dataJson as SubstitutionJson[];
export type SubstitutionJson = {
	ingredient: string;
	recipeTypes: RecipeType[];
	substitutes: {
		name: string;
		baseAmount: IngredientAmount;
		substitution: IngredientAmount[];
		instructions?: string;
		tags: string[];
		effects: Effects;
		confidence: number;
	}[];
};

export type SubstitutionResult = {
	ingredient: string;
	substitute: Substitute;
	effectsSummary: string;
};



class SubstitutionEngine {
	private ingredientMap = new Map<string, Ingredient>();
	private initialized = false;

	constructor() { }

	init() {
		if (this.initialized) return;
		this.loadJson();
		this.initialized = true;
	}


	private loadJson() {
		data.forEach((elem) => {
			const substitutes = elem.substitutes.map(
				(s) =>
					new Substitute(
						s.name,
						s.baseAmount,
						s.substitution,
						s.tags,
						s.effects,
						s.confidence,
						s.instructions
					)
			);
			function isRecipeType(value: string): value is RecipeType {
				return ["cake", "cookie", "bread", "other", "pancakes", "waffles"].includes(value);
			  }
			  
			  const recipeTypes = elem.recipeTypes.filter(isRecipeType) as RecipeType[];
			const ingredient = new Ingredient(elem.ingredient, recipeTypes, substitutes);
			this.ingredientMap.set(elem.ingredient.toLowerCase(), ingredient);
		});
	}

	getAllIngredientNames(): string[] {
		return Array.from(this.ingredientMap.keys());
	}

	getIngredient(name: string): Ingredient | undefined {
		return this.ingredientMap.get(name.toLowerCase().trim());
	}

	getAllDietaryPreferences(): string[] {
		const tagsSet = new Set<string>();
	
		this.ingredientMap.forEach((ingredient) => {
		  ingredient.substitutes.forEach((sub) => {
			sub.tags.forEach((tag) => tagsSet.add(tag));
		  });
		});
	
		return Array.from(tagsSet).sort();
	  }
	

	getSubstitutes(
		ingredientName: string,
		recipeType: RecipeType,
		tags: string[] = []
	): Substitute[] {
		const ingredient = this.getIngredient(ingredientName);
		if (!ingredient) return [];

		if (!ingredient.recipeTypes.includes(recipeType)) return [];

		return ingredient.substitutes
			.filter((s) => tags.every((t) => s.tags.includes(t)))
			.filter((s) => s.confidence >= 0.6)
			.sort((a, b) => {
				if (b.confidence !== a.confidence) {
					return b.confidence - a.confidence;
				}
				// Prefer substitutes with more known effects
				return (
					Object.keys(b.effects).length -
					Object.keys(a.effects).length
				);
			});
	}

	summarizeEffects(effects: Effects): string {
		if (!effects || Object.keys(effects).length === 0) {
			return "No significant changes expected";
		}

		return Object.entries(effects)
			.map(([k, v]) => `${k}: ${v}`)
			.join(", ");
	}

}

export const engine = new SubstitutionEngine();