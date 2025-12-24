import { GptExplanationResponse } from "@/components/ResultsCard";
import { rateLimit } from "@/lib/rateLimit";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

import crypto from "crypto";
import { Redis } from "@upstash/redis";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY!,
});

function isValidExplanation(obj: any): obj is GptExplanationResponse {
	if (!obj || typeof obj !== "object") return false;

	const validVerdicts = ["VALID", "RISKY", "INVALID"];

	return (
		validVerdicts.includes(obj.verdict) &&
		Array.isArray(obj.reasons) &&
		obj.reasons.every((r: any) => typeof r === "string") &&
		Array.isArray(obj.practicalNotes) &&
		obj.practicalNotes.every((n: any) => typeof n === "string")
	);
}

function createCacheKey(payload: any) {
	const normalized = {
		ingredient: payload.ingredient.toLowerCase(),
		substitute: payload.substitute.toLowerCase(),
		baseAmount: payload.baseAmount,
		substitution: payload.substitution,
		recipeTypes: [...payload.recipeTypes].sort(),
		instructions: payload.instructions ?? null,
		effects: payload.effects
			? Object.entries(payload.effects).sort()
			: null,
	};

	return crypto
		.createHash("sha256")
		.update(JSON.stringify(normalized))
		.digest("hex");
}

export async function POST(req: NextRequest) {
	const ip =
		req.headers.get("x-forwarded-for")?.split(",")[0] ??
		"unknown";

	const { success } = await rateLimit(
		ip,
		5,    // requests
		60    // per 60 seconds
	);

	if (!success) {
		return NextResponse.json(
			{ error: "Too many requests. Please slow down." },
			{ status: 429 }
		);
	}

	const redis = Redis.fromEnv();

	const body = await req.json();
	const cacheKey = `gpt:explanation:${createCacheKey(body)}`;
	const cached = await redis.get<GptExplanationResponse>(cacheKey);
	if (cached) {
		return NextResponse.json({
			...cached,
			cached: true,
		});
	}
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
	console.log(response.usage); // { prompt_tokens, completion_tokens, total_tokens }
	const raw = response.choices[0].message.content;
	let parsed;
	try {
		const candidate = JSON.parse(raw!);

		if (!isValidExplanation(candidate)) {
			throw new Error("Invalid GPT response shape");
		}

		parsed = candidate;
	} catch {
		parsed = {
			verdict: "INVALID",
			reasons: ["The AI response could not be parsed reliably."],
			practicalNotes: ["Please use general baking judgment."],
		};
	}

	// Save to cache
	const ttlMap: Record<GptExplanationResponse["verdict"], number> = {
		VALID: 60 * 60 * 24 * 7,
		RISKY: 60 * 60 * 24 * 3,
		INVALID: 60 * 60 * 24,
	};

	let expirationTime = ttlMap.INVALID; // default
	if (parsed.verdict in ttlMap) {
		expirationTime = ttlMap[parsed.verdict as keyof typeof ttlMap];
	}

	await redis.set(cacheKey, parsed, {
		ex: expirationTime,
	});
	return NextResponse.json({
		...parsed,
		cached: false,
	});
}
