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

function formatRelativeTime(timestamp: number): string {
	const now = Date.now();
	const diffMs = now - timestamp;

	const seconds = Math.floor(diffMs / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (seconds < 60) return "just now";
	if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
	if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
	if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`;

	return new Date(timestamp).toLocaleDateString();
}

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
							<Box display="flex" justifyContent="space-between" alignItems="baseline">
								<Typography fontWeight={500}>
									{item.ingredient}
								</Typography>

								<Typography
									variant="caption"
									color="text.secondary"
									whiteSpace="nowrap"
								>
									{formatRelativeTime(item.timestamp)}
								</Typography>
							</Box>

							<Stack spacing={0.25} mt={0.5}>
								{item.recipeTypes.length > 0 && (
									<Typography variant="caption" color="text.secondary">
										<strong>Types:</strong> {item.recipeTypes.join(" · ")}
									</Typography>
								)}

								{item.tags.length > 0 && (
									<Typography variant="caption" color="text.secondary">
										<strong>Tags:</strong> {item.tags.join(" · ")}
									</Typography>
								)}
							</Stack>
						</Box>
					))}
				</Stack>
			)}
		</Drawer>
	);
}
