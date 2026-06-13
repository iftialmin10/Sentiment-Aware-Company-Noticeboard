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
import CircularProgress from "@mui/material/CircularProgress";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";

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

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        border: "1px solid",
        borderColor: "divider",
        transition: "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 12px 28px -12px rgba(99,102,241,0.45)",
          borderColor: "primary.main",
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
            spacing={0.5}
            alignItems="center"
            sx={{ mt: 1.25, color: "text.secondary" }}
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
