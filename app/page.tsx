"use client";

import { useTheme } from "@mui/material/styles";
import { RecipeType } from "@/backend/Ingredient";
import { DietaryPreferenceSelector } from "@/components/DietaryPreferenceSelector";
import { IngredientSelector } from "@/components/IngredientSelector";
import { ALL_RECIPE_TYPES, RecipeTypeSelector } from "@/components/RecipeTypeSelector";
import { ResultsCard } from "@/components/ResultsCard";
import { useState } from "react";
import { Button, Tooltip, Paper, Typography, Box } from "@mui/material";
import { engine } from "@/backend/SubstitutionEngine";
import { Substitute } from "@/backend/Substitute";

// Import your substitution engine

export default function Home() {
  const theme = useTheme();
  const [ingredient, setIngredient] = useState<string | null>(null);
  const [pref, setPref] = useState<string[]>([]);
  const [recipeType, setRecipeType] = useState<RecipeType[]>([...ALL_RECIPE_TYPES]);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<Substitute[] | null>(null);

  const handleSubmit = () => {
    if (!ingredient) return;

    // Query your substitution engine
    const substitutes = engine.getSubstitutes(
      ingredient,
      recipeType,
      pref,
    );

    setResults(substitutes);
    setShowResults(true);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        py: 6,
        px: 6,
      }}
    >
      <Box display="flex" justifyContent="center">
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            maxWidth: 720,
            borderRadius: 3,
            p: 4,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }}
        >
          {!showResults ? (
            <>
              {/* Header */}
              <Box textAlign="center" mb={6}>
                <Typography variant="h2" fontWeight={600}>
                  Baking Ingredient Substitutor
                </Typography>
                <Typography variant="body1" color="text.secondary" mt={1}>
                  Instantly find reliable ingredient substitutions and understand how they’ll affect your recipe.
                </Typography>
              </Box>

              {/* Form */}
              <Box display="flex" flexDirection="column" gap={3}>
                <Box>
                  <Typography variant="body2" fontWeight={500} mb={1}>
                    Recipe Type
                  </Typography>
                  <RecipeTypeSelector value={recipeType} onChange={setRecipeType} />
                </Box>

                <Box>
                  <Typography variant="body2" fontWeight={500} mb={1}>
                    Ingredient to Substitute
                  </Typography>
                  <IngredientSelector value={ingredient} onChange={setIngredient} />
                </Box>

                <Box>
                  <Typography variant="body2" fontWeight={500} mb={1}>
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
                <Button variant="text" size="small" onClick={() => setShowResults(false)}>
                  ← Back
                </Button>
              </Box>

              {/* Results */}
              <Box display="flex" flexDirection="column" gap={2}>
                {results?.length ? (
                  results.map((sub) => <ResultsCard key={sub.name} substitute={sub} />)
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
    </Box>
  );
}
