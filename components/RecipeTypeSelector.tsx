"use client";

import { Autocomplete, Checkbox, TextField } from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { RecipeType } from "@/backend/Ingredient";

type RecipeTypeSelectorProps = {
  value: RecipeType[];
  onChange: (value: RecipeType[]) => void;
};

export const ALL_RECIPE_TYPES: RecipeType[] = [
  "cake",
  "cookie",
  "quick bread",
  "yeast bread",
  "pancake",
  "other",
];

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export function RecipeTypeSelector({ value, onChange }: RecipeTypeSelectorProps) {
  return (
    <Autocomplete
      multiple
      options={ALL_RECIPE_TYPES}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      disableCloseOnSelect
      getOptionLabel={(option) => option}
      renderOption={(props, option, { selected }) => {
        const { key, ...rest } = props;
        return (
          <li key={key} {...rest} className={`${selected ? "bg-blue-100" : ""}`}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option}
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Recipe Types"
          placeholder="Select recipe types"
          variant="outlined"
          fullWidth
        />
      )}
      filterSelectedOptions
      freeSolo={false}
    />
  );
}
