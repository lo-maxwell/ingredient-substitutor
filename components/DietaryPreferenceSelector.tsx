"use client";

import { Autocomplete, Checkbox, TextField } from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { engine } from "@/backend/SubstitutionEngine";
import React from "react";

type DietaryPreferenceSelectorProps = {
  value: string[];
  onChange: (value: string[]) => void;
};

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export function DietaryPreferenceSelector({
  value,
  onChange,
}: DietaryPreferenceSelectorProps) {
	const [options, setOptions] = React.useState<string[]>([]);

  React.useEffect(() => {
    engine.init();
    setOptions(engine.getAllDietaryPreferences());
  }, []);

  return (
    <Autocomplete
      multiple
      options={options}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      disableCloseOnSelect
      getOptionLabel={(option) => option}
      renderOption={(props, option, { selected }) => {
        const { key, ...rest } = props; // remove key from spread
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
          label="Dietary Preferences"
          placeholder="Select dietary preferences"
          variant="outlined"
          fullWidth
        />
      )}
      filterSelectedOptions
      freeSolo={false}
    />
  );
}
