"use client";

import { SearchHistoryItem } from "@/backend/SearchHistoryItem";
import {
  Box,
  Typography,
  Stack,
  Chip,
  Paper,
} from "@mui/material";

type Props = {
  history: SearchHistoryItem[];
  onSelect: (item: SearchHistoryItem) => void;
};

export function SearchHistoryPanel({ history, onSelect }: Props) {
  if (history.length === 0) return null;

  return (
    <Paper
      variant="outlined"
      sx={{ p: 2, mb: 3, borderRadius: 2 }}
    >
      <Typography variant="subtitle2" mb={1}>
        Recent searches
      </Typography>

      <Stack spacing={1}>
        {history.map(item => (
          <Box
            key={item.id}
            onClick={() => onSelect(item)}
            sx={{
              cursor: "pointer",
              p: 1,
              borderRadius: 1,
              "&:hover": { backgroundColor: "action.hover" },
            }}
          >
            <Typography variant="body2" fontWeight={500}>
              {item.ingredient}
            </Typography>

            <Stack direction="row" spacing={0.5} mt={0.5}>
              {item.recipeTypes.map(r => (
                <Chip key={r} label={r} size="small" />
              ))}
              {item.tags.map(t => (
                <Chip key={t} label={t} size="small" variant="outlined" />
              ))}
            </Stack>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
