"use client";

import { useState } from "react";
import { Paper, Box, Typography, Chip, Stack, useTheme, TextField } from "@mui/material";

type ResultsCardProps = {
	substitute: {
		name: string;
		baseAmount: {
			ingredient: string;
			quantity: number;
			unit: string;
		};
		substitution: {
			ingredient: string;
			quantity: number;
			unit: string;
		}[];
		tags?: string[];
		instructions?: string;
		effects?: Record<string, string>;
		confidence: number;
		recipeTypes?: string[]; // Add recipeTypes here
		gptExplanation?: string;
		gptExplanationLoading?: boolean;
	};
};

// Helper to convert a decimal to a simplified fraction string
function toFraction(num: number): string {
	const tolerance = 1e-6;

	const rounded = Math.round(num * 10000) / 10000;
	const whole = Math.floor(rounded);
	const frac = rounded - whole;

	if (frac < tolerance) return `${whole}`;

	const denominator = 16;
	let numerator = Math.round(frac * denominator);

	if (numerator === 0) return `${whole}`;

	const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
	const divisor = gcd(numerator, denominator);
	numerator /= divisor;
	const simplifiedDenominator = denominator / divisor;

	if (whole === 0) return `${numerator}/${simplifiedDenominator}`;
	return `${whole} ${numerator}/${simplifiedDenominator}`;
}

export function ResultsCard({ substitute }: ResultsCardProps) {
	const theme = useTheme();
	const confidencePercent = Math.round(substitute.confidence * 100);

	let confidenceColor: "success" | "warning" | "error" = "error";
	if (confidencePercent >= 80) confidenceColor = "success";
	else if (confidencePercent >= 60) confidenceColor = "warning";

	const [desiredQty, setDesiredQty] = useState(substitute.baseAmount.quantity);
	const scaleFactor = desiredQty / substitute.baseAmount.quantity;
	const step = Math.min(1, substitute.baseAmount.quantity);

	return (
		<Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
			{/* Header */}
			<Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
				<Typography variant="h6" color="text.primary">
					{substitute.name}
				</Typography>
				<Chip
					label={`${confidencePercent}% confidence`}
					color={confidenceColor}
					size="small"
				/>
			</Box>

			{/* Supported Recipe Types */}
			{substitute.recipeTypes && substitute.recipeTypes.length > 0 && (
				<Box mb={2}>
					<Typography variant="subtitle2" color="text.secondary" mb={1}>
						Supports recipe types:
					</Typography>
					<Stack direction="row" spacing={1} flexWrap="wrap">
						{substitute.recipeTypes.map((type) => (
							<Chip key={type} label={type} size="small" />
						))}
					</Stack>
				</Box>
			)}

			{/* Dietary Preference Tags */}
			{substitute.tags && substitute.tags.length > 0 && (
				<Box mb={2}>
					<Typography variant="subtitle2" color="text.secondary" mb={1}>
						Dietary preferences:
					</Typography>
					<Stack direction="row" spacing={1} flexWrap="wrap">
						{substitute.tags.map((tag) => (
							<Chip
								key={tag}
								label={tag}
								size="small"
								color="primary"
							/>
						))}
					</Stack>
				</Box>
			)}

			{/* Base Amount Input */}
			<Box mb={2} display="flex" alignItems="center" gap={1}>
				<Typography variant="subtitle2" color="text.secondary">
					To substitute:
				</Typography>
				<TextField
					type="number"
					value={desiredQty}
					onChange={(e) => setDesiredQty(Number(e.target.value))}
					inputProps={{ min: 0, step: step }}
					size="small"
					sx={{ width: 80 }}
				/>
				<Typography variant="body2" color="text.primary">
					{substitute.baseAmount.unit} {substitute.baseAmount.ingredient}
				</Typography>
			</Box>

			{/* Substitution amounts */}
			<Box mb={2}>
				<Typography variant="subtitle2" color="text.secondary" mb={1}>
					Use instead:
				</Typography>
				<Stack spacing={0.5}>
					{substitute.substitution.map((item) => {
						const qty = item.quantity * scaleFactor;
						return (
							<Typography key={item.ingredient} variant="body2" color="text.primary">
								• {toFraction(qty)} {item.unit} {item.ingredient}
							</Typography>
						);
					})}
				</Stack>
			</Box>

			{/* Effects */}
			{substitute.effects && (
				<Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
					{Object.entries(substitute.effects).map(([key, value]) => (
						<Chip
							key={key}
							label={`${key}: ${value}`}
							size="small"
							sx={{
								backgroundColor: theme.palette.grey[100],
								color: theme.palette.text.secondary,
							}}
						/>
					))}
				</Stack>
			)}

			{/* Instructions */}
			{substitute.instructions && (
				<Box
					sx={{
						p: 2,
						borderRadius: 1,
						backgroundColor: theme.palette.grey[50],
						color: theme.palette.text.secondary,
					}}
				>
					<Typography variant="body2">
						<strong>Note:</strong> {substitute.instructions}
					</Typography>
				</Box>
			)}

			{/* GPT Explanation */}
			<Box
			sx={{
				mt: 2,
				p: 2,
				borderRadius: 1,
				backgroundColor: theme.palette.grey[50],
				color: theme.palette.text.secondary,
				fontStyle: 'italic',
			}}
			>
			<Typography variant="body2">
				{/* Replace this with actual GPT explanation when available */}
				{substitute.gptExplanationLoading
				? "Generating explanation..."
				: substitute.gptExplanation || "Explanation will appear here."}
			</Typography>
			</Box>

		</Paper>
	);
}
