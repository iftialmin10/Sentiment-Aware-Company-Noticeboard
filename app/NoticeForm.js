"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { MAX_NOTICE_LENGTH } from "../lib/noticeContract";

const INITIAL_STATE = { status: "idle", message: "" };

function FormFields() {
  const { pending } = useFormStatus();
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
      <TextField
        name="text"
        placeholder="Write a notice…"
        required
        fullWidth
        autoComplete="off"
        size="medium"
        disabled={pending}
        inputProps={{ maxLength: MAX_NOTICE_LENGTH }}
      />
      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={pending}
        startIcon={pending ? <CircularProgress size={18} color="inherit" /> : <SendRoundedIcon />}
        sx={{ whiteSpace: "nowrap", alignSelf: { xs: "stretch", sm: "stretch" } }}
      >
        {pending ? "Analyzing and posting…" : "Post notice"}
      </Button>
    </Stack>
  );
}

export default function NoticeForm({ action }) {
  const formRef = useRef(null);
  const [state, formAction] = useFormState(action, INITIAL_STATE);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

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
      <form ref={formRef} action={formAction}>
        <FormFields />
        {state.status === "error" && (
          <Typography role="alert" color="error" variant="body2" sx={{ mt: 1.5 }}>
            {state.message}
          </Typography>
        )}
      </form>
    </Paper>
  );
}
