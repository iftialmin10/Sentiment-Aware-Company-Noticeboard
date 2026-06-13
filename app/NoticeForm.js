"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="contained"
      size="large"
      disabled={pending}
      startIcon={
        pending ? (
          <CircularProgress size={18} color="inherit" />
        ) : (
          <SendRoundedIcon />
        )
      }
      sx={{ whiteSpace: "nowrap", alignSelf: { xs: "stretch", sm: "stretch" } }}
    >
      {pending ? "Posting…" : "Post notice"}
    </Button>
  );
}

export default function NoticeForm({ action }) {
  const formRef = useRef(null);

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 2.5 },
        mb: 4,
        border: "1px solid",
        borderColor: "divider",
        background:
          "linear-gradient(135deg, rgba(99,102,241,0.06), rgba(236,72,153,0.06))",
      }}
    >
      <form
        ref={formRef}
        action={async (formData) => {
          await action(formData);
          formRef.current?.reset();
        }}
      >
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <TextField
            name="text"
            placeholder="Write a notice…"
            required
            fullWidth
            autoComplete="off"
            size="medium"
          />
          <SubmitButton />
        </Stack>
      </form>
    </Paper>
  );
}
