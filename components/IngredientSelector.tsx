"use client";

import * as React from "react";
import { Autocomplete, TextField } from "@mui/material";
import { engine } from "@/backend/SubstitutionEngine";

type IngredientSelectorProps = {
  value: string | null;
  onChange: (ingredient: string | null) => void;
  label?: string;
};

export function IngredientSelector({
  value,
  onChange,
  label = "Ingredient",
}: IngredientSelectorProps) {
  const [options, setOptions] = React.useState<string[]>([]);

  React.useEffect(() => {
    engine.init();
    setOptions(engine.getAllIngredientNames());
  }, []);

  return (
    <Autocomplete
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      options={options}
      freeSolo={false}
      filterOptions={(options, { inputValue }) => {
        if (!inputValue) return options;

        try {
          const regex = new RegExp(inputValue, "i");
          return options.filter((opt) => regex.test(opt));
        } catch {
          // Invalid regex → fallback to substring match
          return options.filter((opt) =>
            opt.toLowerCase().includes(inputValue.toLowerCase())
          );
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder="Start typing (e.g. butter, egg, milk)"
          variant="outlined"
          fullWidth
        />
      )}
    />
  );
}
