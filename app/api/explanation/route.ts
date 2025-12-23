import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY!,
});
export async function POST(req: NextRequest) {
	const body = await req.json();

	const {
		ingredient,
		substitute,       // string (name)
		baseAmount,       // IngredientAmount
		substitution,     // IngredientAmount[]
		instructions, 	  // string | undefined
		recipeTypes,      // string[]
		effects,          // Record<string, string>
	} = body;

	const prompt = `
	You are a professional baking scientist.

	Your task is to evaluate whether the following ingredient substitution is
	appropriate for baking. Base your judgment on common baking practice and
	basic food chemistry. Do NOT over-punish minor differences that are widely
	accepted in baking.


	Ingredient being replaced:
	- ${baseAmount.quantity} ${baseAmount.unit} ${baseAmount.ingredient}

	Proposed substitute:
	${substitution.map((s: any) => `- ${s.quantity} ${s.unit} ${s.ingredient}`).join("\n")}

	Additional substitute instructions:
	${instructions ? instructions : `None`}

	Recipe types:
	- ${recipeTypes.join(", ")}

	Claimed effects:
	${effects && Object.keys(effects).length > 0
	? Object.entries(effects).map(([k, v]) => `- ${k}: ${v}`).join("\n")
	: "- No major changes"}

	Respond ONLY with valid JSON in the following format.
	Do NOT include markdown, comments, or extra text.

	{
	"verdict": "VALID | RISKY | INVALID",
	"reasons": [
		"Short, factual baking-science reason",
		"Explain chemical or structural mismatch if any"
	],
	"practicalNotes": [
		"Optional usage warnings or tips"
	]
	}

	Guidelines:
	- Mark VALID if the substitution is commonly acceptable in baking.
	- Mark RISKY if it only works in limited situations or requires adjustment.
	- Mark INVALID if it is fundamentally unsuitable.
	- Keep explanations concise and practical.
	`;

	const response = await openai.chat.completions.create({
		model: "gpt-4o-mini",
		messages: [
			{ role: "system", content: "You are a strict food science evaluator." },
			{ role: "user", content: prompt },
		],
		temperature: 0.2,
	});
	const raw = response.choices[0].message.content;
	try {
		const parsed = JSON.parse(raw!);
		return NextResponse.json(parsed);
	  } catch (err) {
		return NextResponse.json(
		  {
			verdict: "RISKY",
			reasons: ["The AI response could not be parsed reliably."],
			practicalNotes: ["Please use general baking judgment."],
		  },
		  { status: 200 }
		);
	  }
}
