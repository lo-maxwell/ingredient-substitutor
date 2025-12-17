"use client";
import { RecipeType } from "@/backend/Ingredient";
import { DietaryPreferenceSelector } from "@/components/DietaryPreferenceSelector";
import { IngredientSelector } from "@/components/IngredientSelector";
import { ALL_RECIPE_TYPES, RecipeTypeSelector } from "@/components/RecipeTypeSelector";
import { useState } from "react";

export default function Home() {
  const [ingredient, setIngredient] = useState<string | null>(null);
  const [pref, setPref] = useState<string[]>([]);
  const [recipeType, setRecipeType] = useState<RecipeType[]>([...ALL_RECIPE_TYPES]);
    
  return (
    <div className="min-h-screen bg-zinc-600 text-zinc-900">
      {/* Top Bar */}
      <div className="flex justify-end p-4">
        {/* Could add other buttons here if needed */}
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center px-6">
        <main className="w-full max-w-3xl rounded-2xl bg-white p-10 shadow-sm">
          {/* Header */}
          <header className="mb-10 text-center">
            <h1 className="text-4xl !text-zinc-800 font-semibold tracking-tight">
              Baking Ingredient Substitutor
            </h1>
            <p className="mt-4 text-lg text-zinc-600">
              Instantly find reliable ingredient substitutions and understand how
              they’ll affect your recipe.
            </p>
          </header>

          {/* Form */}
          <section className="flex flex-col gap-6">
            {/* Recipe Type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Recipe Type
              </label>
              <RecipeTypeSelector value={recipeType} onChange={setRecipeType}/>
            </div>

            {/* Ingredient */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Ingredient to Substitute
              </label>
              <IngredientSelector value={ingredient} onChange={setIngredient} />
            </div>

            {/* Dietary Constraints */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Dietary Preferences
              </label>
              <DietaryPreferenceSelector value={pref} onChange={setPref} />
            </div>

            {/* CTA */}
            <button
              disabled
              className="mt-4 h-12 w-full rounded-md bg-zinc-900 text-white opacity-50"
            >
              Find Substitutes
            </button>
          </section>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-zinc-500">
            Substitutions are based on baking science and common kitchen practices.
          </p>
        </main>
      </div>
    </div>
  );
}
