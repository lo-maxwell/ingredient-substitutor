"use client";

import {
	Drawer,
	Box,
	Typography,
	Stack,
	Chip,
	IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import HistoryIcon from "@mui/icons-material/History";
import { SearchHistoryItem } from "@/backend/SearchHistoryItem";

type Props = {
	open: boolean;
	onClose: () => void;
	history: SearchHistoryItem[];
	onSelect: (item: SearchHistoryItem) => void;
	onClear: () => void;
};

export function SearchHistoryDrawer({
	open,
	onClose,
	history,
	onSelect,
	onClear,
}: Props) {
	return (
		<Drawer
			anchor="right"
			open={open}
			onClose={onClose}
			PaperProps={{
				sx: {
					width: 320,
					p: 2,
				},
			}}
		>
			{/* Header */}
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				mb={2}
			>
				<Box display="flex" alignItems="center" gap={1}>
					<HistoryIcon fontSize="small" />
					<Typography variant="h6">Search history</Typography>
				</Box>

				<Box display="flex" alignItems="center" gap={0.5}>
					{history.length > 0 && (
						<Typography
							variant="body2"
							color="primary"
							sx={{
								cursor: "pointer",
								fontWeight: 500,
								"&:hover": { textDecoration: "underline" },
							}}
							onClick={onClear}
						>
							Clear
						</Typography>
					)}

					<IconButton onClick={onClose} size="small">
						<CloseIcon />
					</IconButton>
				</Box>
			</Box>

			{history.length === 0 ? (
				<Typography variant="body2" color="text.secondary">
					No searches yet
				</Typography>
			) : (
				<Stack spacing={2}>
					{history.map(item => (
						<Box
							key={item.id}
							onClick={() => {
								onSelect(item);
								onClose();
							}}
							sx={{
								cursor: "pointer",
								p: 1.5,
								borderRadius: 1,
								border: "1px solid",
								borderColor: "divider",
								"&:hover": {
									backgroundColor: "action.hover",
								},
							}}
						>
							<Typography fontWeight={500}>
								{item.ingredient}
							</Typography>

							<Stack
								direction="row"
								spacing={0.5}
								flexWrap="wrap"
								mt={0.5}
							>
								{item.recipeTypes.map(r => (
									<Chip key={r} label={r} size="small" />
								))}
								{item.tags.map(t => (
									<Chip
										key={t}
										label={t}
										size="small"
										variant="outlined"
									/>
								))}
							</Stack>
						</Box>
					))}
				</Stack>
			)}
		</Drawer>
	);
}
