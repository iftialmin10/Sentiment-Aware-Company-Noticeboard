"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import { keyframes } from "@mui/material/styles";
import { MOODS, URGENCIES } from "../lib/classificationContract";

const heartbeat = keyframes`
  0%, 100% { transform: scale(1); }
  20% { transform: scale(1.1); }
  40% { transform: scale(1); }
  60% { transform: scale(1.05); }
  80% { transform: scale(1); }
`;

const MOOD_STYLES = Object.freeze({
  [MOODS.BAD]: Object.freeze({
    label: "bad",
    backgroundColor: "#fff7f7",
    borderColor: "#ef9a9a",
    chipBackgroundColor: "#fee4e2",
    chipColor: "#7a271a",
  }),
  [MOODS.NORMAL]: Object.freeze({
    label: "normal",
    backgroundColor: "#ffffff",
    borderColor: "#d7dce3",
    chipBackgroundColor: "#eef2f6",
    chipColor: "#344054",
  }),
  [MOODS.GOOD]: Object.freeze({
    label: "good",
    backgroundColor: "#f3fbf5",
    borderColor: "#81c995",
    chipBackgroundColor: "#dcfce7",
    chipColor: "#166534",
  }),
});

const URGENCY_STYLES = Object.freeze({
  [URGENCIES.NO_RUSH]: Object.freeze({
    label: "No rush",
    animationDuration: null,
    backgroundColor: "#eef2f6",
    color: "#344054",
  }),
  [URGENCIES.URGENT]: Object.freeze({
    label: "Urgent",
    animationDuration: "1s",
    backgroundColor: "#fef0c7",
    color: "#7a2e0e",
  }),
  [URGENCIES.EMERGENCY]: Object.freeze({
    label: "Emergency",
    animationDuration: "0.5s",
    backgroundColor: "#fee4e2",
    color: "#912018",
  }),
});

function ConfirmDeleteButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      color="error"
      variant="contained"
      disabled={pending}
      startIcon={pending ? <CircularProgress size={16} color="inherit" /> : null}
    >
      Delete
    </Button>
  );
}

export default function NoticeCard({ notice, deleteAction }) {
  const [open, setOpen] = useState(false);
  const created = new Date(notice.created_at);
  const moodStyle = MOOD_STYLES[notice.mood] ?? MOOD_STYLES[MOODS.NORMAL];
  const urgencyStyle =
    URGENCY_STYLES[notice.urgency] ?? URGENCY_STYLES[URGENCIES.NO_RUSH];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        border: "1px solid",
        borderLeftWidth: 4,
        borderColor: moodStyle.borderColor,
        backgroundColor: moodStyle.backgroundColor,
        transition: "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 12px 28px -12px rgba(99,102,241,0.45)",
          borderColor: moodStyle.borderColor,
        },
      }}
    >
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              fontSize: "1.05rem",
              lineHeight: 1.5,
            }}
          >
            {notice.text}
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            flexWrap="wrap"
            sx={{ mt: 1.25 }}
          >
            <Chip
              size="small"
              label={`Mood: ${moodStyle.label}`}
              sx={{
                fontWeight: 700,
                backgroundColor: moodStyle.chipBackgroundColor,
                color: moodStyle.chipColor,
              }}
            />
            <Chip
              size="small"
              label={`Urgency: ${urgencyStyle.label}`}
              sx={{
                fontWeight: 700,
                backgroundColor: urgencyStyle.backgroundColor,
                color: urgencyStyle.color,
                animation: urgencyStyle.animationDuration
                  ? `${heartbeat} ${urgencyStyle.animationDuration} ease-in-out infinite`
                  : "none",
                "@media (prefers-reduced-motion: reduce)": {
                  animation: "none",
                },
              }}
            />
          </Stack>
          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            sx={{ mt: 1, color: "text.secondary" }}
          >
            <AccessTimeRoundedIcon sx={{ fontSize: 16 }} />
            <Typography variant="caption">
              {created.toLocaleString()}
            </Typography>
          </Stack>
        </Box>

        <Tooltip title="Delete notice">
          <IconButton
            aria-label="delete"
            color="error"
            onClick={() => setOpen(true)}
            sx={{ flexShrink: 0 }}
          >
            <DeleteOutlineRoundedIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete this notice?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action can’t be undone. The notice will be permanently removed.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)} color="inherit">
            Cancel
          </Button>
          <form action={deleteAction}>
            <input type="hidden" name="id" value={notice.id} />
            <ConfirmDeleteButton />
          </form>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
