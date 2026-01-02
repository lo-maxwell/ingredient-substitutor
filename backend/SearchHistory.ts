import { SearchHistoryItem } from "./SearchHistoryItem";

const KEY = "substitution-search-history";
const MAX_ITEMS = 10;

export function getSearchHistory(): SearchHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveSearch(item: SearchHistoryItem): SearchHistoryItem[] {
  console.log('saved item ');
  console.log(item);
  if (typeof window === "undefined") return [];

  const history = getSearchHistory();

  // Remove duplicates
  const filtered = history.filter(
    h =>
      h.ingredient !== item.ingredient ||
      h.recipeTypes.join(",") !== item.recipeTypes.join(",") ||
      h.tags.join(",") !== item.tags.join(",")
  );

  const updated = [item, ...filtered].slice(0, MAX_ITEMS);

  localStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
}
