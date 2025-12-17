import { Effects } from "./Effects"

export type IngredientAmount = {
	ingredient: string;
	quantity: number;
	unit: string;
};


export class Substitute {
	name: string;

	baseAmount: IngredientAmount;
	substitution: IngredientAmount[];

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
		instructions?: string
	) {
		this.name = name;
		this.baseAmount = baseAmount;
		this.substitution = substitution;
		this.instructions = instructions;
		this.tags = tags;
		this.effects = effects;
		this.confidence = confidence;
	}
}