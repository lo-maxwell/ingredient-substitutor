import { RecipeType } from "@/backend/Ingredient";

export type SearchHistoryItem = {
  id: string;                 // stable key
  ingredient: string;
  recipeTypes: RecipeType[];
  tags: string[];
  timestamp: number;
};