"use client";

import { useTheme } from "@mui/material/styles";
import { RecipeType } from "@/backend/Ingredient";
import { DietaryPreferenceSelector } from "@/components/DietaryPreferenceSelector";
import { IngredientSelector } from "@/components/IngredientSelector";
import { ALL_RECIPE_TYPES, RecipeTypeSelector } from "@/components/RecipeTypeSelector";
import { GptExplanationResponse, ResultsCard } from "@/components/ResultsCard";
import { useEffect, useRef, useState } from "react";
import { Snackbar, Alert, Button, Tooltip, Paper, Typography, Box, IconButton } from "@mui/material";
import { engine } from "@/backend/SubstitutionEngine";
import { Substitute } from "@/backend/Substitute";
import { useRouter, useSearchParams } from "next/navigation";
import { getSearchHistory, saveSearch } from "@/backend/SearchHistory";
import { SearchHistoryItem } from "@/backend/SearchHistoryItem";
import HistoryIcon from "@mui/icons-material/History";
import { SearchHistoryDrawer } from "@/components/SearchHistoryDrawer";
import Footer from "./Footer";

export default function Home() {
	const theme = useTheme();
	const [ingredient, setIngredient] = useState<string | null>(null);
	const [pref, setPref] = useState<string[]>([]);
	const [recipeType, setRecipeType] = useState<RecipeType[]>([...ALL_RECIPE_TYPES]);
	const [showResults, setShowResults] = useState(false);
	const [results, setResults] = useState<Substitute[] | null>(null);
	const [gptExplanations, setGptExplanations] = useState<Record<string, GptExplanationResponse>>({});
	const [gptLoading, setGptLoading] = useState<Record<string, boolean>>({});
	const [rateLimitOpen, setRateLimitOpen] = useState(false);
	const [gptCooldownUntil, setGptCooldownUntil] = useState<number | null>(null);
	const [history, setHistory] = useState<SearchHistoryItem[]>([]);
	const [historyOpen, setHistoryOpen] = useState(false);

	const isInCooldown = gptCooldownUntil !== null && Date.now() < gptCooldownUntil;
	const router = useRouter();
	const searchParams = useSearchParams();
	const hasHydratedFromUrl = useRef(false);

	useEffect(() => {
		if (hasHydratedFromUrl.current) return;

		const ingredientParam = searchParams.get("ingredient");
		const recipesParam = searchParams.get("recipes");

		if (!ingredientParam || !recipesParam) return;

		hasHydratedFromUrl.current = true;

		const tagsParam = searchParams.get("tags");

		const ingredient = decodeURIComponent(ingredientParam);

		const recipes = recipesParam
			.split(",")
			.map(decodeURIComponent) as RecipeType[];

		const tags = tagsParam
			? tagsParam.split(",").map(decodeURIComponent)
			: [];

		setIngredient(ingredient);
		setRecipeType(recipes);
		setPref(tags);
		const substitutes = engine.getSubstitutes(
			ingredientParam,
			recipes,
			tags
		);

		setResults(substitutes);
		setShowResults(true);
	}, [searchParams]);

	useEffect(() => {
		if (!gptCooldownUntil) return;

		const remaining = gptCooldownUntil - Date.now();
		if (remaining <= 0) {
			setGptCooldownUntil(null);
			return;
		}

		const timer = setTimeout(() => {
			setGptCooldownUntil(null);
		}, remaining);

		return () => clearTimeout(timer);
	}, [gptCooldownUntil]);


	useEffect(() => {
		const stored = localStorage.getItem("substitution-search-history");
		if (stored) {
			setHistory(JSON.parse(stored));
		}
	}, []);


	const handleSubmit = () => {
		if (!ingredient) return;
		const newEntry: SearchHistoryItem = {
			id: crypto.randomUUID(),
			ingredient,
			recipeTypes: recipeType,
			tags: pref,
			timestamp: Date.now(),
		  };
		setHistory(prev => {
			const updated = saveSearch(newEntry);
			return updated;
		})

		const params = new URLSearchParams();

		params.set("ingredient", ingredient);
		params.set("recipes", recipeType.join(","));

		if (pref.length > 0) {
			params.set("tags", pref.join(","));
		}

		router.replace(`?${params.toString()}`, {
			scroll: false,
		});

		const substitutes = engine.getSubstitutes(
			ingredient,
			recipeType,
			pref,
		);

		setResults(substitutes);
		setShowResults(true);
	};

	const handleHistorySelect = (item: SearchHistoryItem) => {
		setIngredient(item.ingredient);
		setRecipeType(item.recipeTypes);
		setPref(item.tags);

		const params = new URLSearchParams();
		params.set("ingredient", item.ingredient);
		params.set("recipes", item.recipeTypes.join(","));
		if (item.tags.length) {
			params.set("tags", item.tags.join(","));
		}

		router.replace(`?${params.toString()}`, { scroll: false });

		const substitutes = engine.getSubstitutes(
			item.ingredient,
			item.recipeTypes,
			item.tags
		);

		setResults(substitutes);
		setShowResults(true);
	};


	const fetchExplanation = async (sub: Substitute) => {
		if (gptLoading[sub.name] || gptExplanations[sub.name]) return;

		setGptLoading((prev) => ({ ...prev, [sub.name]: true }));

		try {
			const res = await fetch("/api/explanation", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					ingredient,
					substitute: sub.name,
					baseAmount: sub.baseAmount,
					substitution: sub.substitution,
					instructions: sub.instructions,
					recipeTypes: recipeType,
					effects: sub.effects,
				}),
			});

			if (res.status === 429) {
				setRateLimitOpen(true);

				const cooldownMs = 10_000;
				setGptCooldownUntil(Date.now() + cooldownMs);

				return;
			}

			if (!res.ok) {
				throw new Error("Failed to fetch explanation");
			}

			const data = await res.json();
			console.log(data);
			setGptExplanations((prev) => ({
				...prev,
				[sub.name]: data,
			}));
		} catch (err) {
			console.error(err);
		} finally {
			setGptLoading((prev) => ({ ...prev, [sub.name]: false }));
		}
	};

	return (
		<Box
			sx={{
				minHeight: "100vh",
				backgroundColor: theme.palette.background.default,
				color: theme.palette.text.primary,
				py: { xs: 3, sm: 4, md: 6 },
				px: { xs: 2, sm: 4, md: 6 },
			}}
		>
			<Box display="flex" justifyContent="center">
				<Paper
					elevation={3}
					sx={{
						width: "100%",
						maxWidth: 720,
						borderRadius: 3,
						p: { xs: 2, sm: 3, md: 4 },
						backgroundColor: theme.palette.background.paper,
						color: theme.palette.text.primary,
					}}
				>
					{!showResults ? (
						<>
							{/* Header */}
							<Box textAlign="center" mb={6}>
								<Typography component="h1" variant="h2" fontWeight={600}>
									Baking Ingredient Substituter
								</Typography>
								<Typography component="h2" variant="body1" color="text.secondary" mt={1}>
									Instantly find reliable ingredient substitutions and understand how they’ll affect your recipe.
								</Typography>
							</Box>

							{/* Form */}
							<Box display="flex" flexDirection="column" gap={3}>
								<Box>
									<Typography component="h3" variant="body2" fontWeight={500} mb={1}>
										Recipe Type
									</Typography>
									<RecipeTypeSelector value={recipeType} onChange={setRecipeType} />
								</Box>

								<Box>
									<Typography component="h3" variant="body2" fontWeight={500} mb={1}>
										Ingredient to Substitute
									</Typography>
									<IngredientSelector value={ingredient} onChange={setIngredient} />
								</Box>

								<Box>
									<Typography component="h3" variant="body2" fontWeight={500} mb={1}>
										Dietary Preferences
									</Typography>
									<DietaryPreferenceSelector value={pref} onChange={setPref} />
								</Box>

								<Tooltip
									title={
										!ingredient
											? "Please select an ingredient first"
											: recipeType.length === 0
												? "Please select at least one recipe type"
												: ""
									}
									arrow
								>
									<span>
										<Button
											variant="contained"
											size="large"
											fullWidth
											disabled={!ingredient || recipeType.length === 0}
											onClick={handleSubmit}
											sx={{ mt: 2 }}
										>
											Find Substitutes
										</Button>
									</span>
								</Tooltip>
							</Box>
						</>
					) : (
						<>
							{/* Results Header */}
							<Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
								<Typography variant="h5" fontWeight={600}>
									Substitutes for {ingredient}
								</Typography>
								<Button
									variant="text"
									size="small"
									onClick={() => {
										router.replace("?", { scroll: false });
										setShowResults(false);
									}}
								>
									← Back
								</Button>
							</Box>

							{/* Results */}
							<Box display="flex" flexDirection="column" gap={2}>
								{results?.length ? (
									results.map((sub) => (
										<ResultsCard
											key={sub.name}
											substitute={{
												...sub,
												gptExplanation: gptExplanations[sub.name] || undefined,
												gptExplanationLoading: gptLoading[sub.name],
											}}
											onFetchExplanation={() => fetchExplanation(sub)}
											gptDisabled={isInCooldown}
										/>
									))
								) : (
									<Typography variant="body2" color="text.secondary">
										No substitutions found for this ingredient. Try expanding the recipe types.
									</Typography>
								)}
							</Box>
						</>
					)}

					{/* Footer */}
					<Typography variant="caption" display="block" textAlign="center" mt={4} color="text.secondary">
						Substitutions are based on baking science and common kitchen practices.
					</Typography>
				</Paper>
			</Box>
			<SearchHistoryDrawer
				open={historyOpen}
				onClose={() => setHistoryOpen(false)}
				history={history}
				onSelect={handleHistorySelect}
				onClear={() => {
					localStorage.removeItem("substitution-search-history");
					setHistory([]);
				}}
			/>
			<Snackbar
				open={rateLimitOpen}
				autoHideDuration={4000}
				onClose={() => setRateLimitOpen(false)}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			>
				<Alert
					onClose={() => setRateLimitOpen(false)}
					severity="info"
					sx={{
						width: "100%",
						backgroundColor: "#F0F7FF",
						color: "#0B3C5D",
						border: "1px solid #90CAF9",
						borderRadius: 2,
						"& .MuiAlert-icon": {
							color: "#2196F3",
						},
					}}
				>
					You’re making requests too quickly. Please slow down and try again.
				</Alert>
			</Snackbar>
			<Box
				sx={{
					position: "fixed",
					right: 24,
					bottom: 24,
					zIndex: 1200,
				}}
			>
				<IconButton
					color="primary"
					size="large"
					onClick={() => setHistoryOpen(true)}
					sx={{
						backgroundColor: "background.paper",
						boxShadow: 3,
						"&:hover": {
							backgroundColor: "background.default",
						},
					}}
				>
					<HistoryIcon />
				</IconButton>
			</Box>
			<Footer />
		</Box>

	);
}
