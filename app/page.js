import { revalidatePath } from "next/cache";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import PushPinRoundedIcon from "@mui/icons-material/PushPinRounded";
import InboxRoundedIcon from "@mui/icons-material/InboxRounded";
import { pool } from "../lib/db";
import { classifyNotice } from "../lib/classifyNotice";
import { classificationWithDefaults } from "../lib/classificationContract";
import { createPostNotice } from "../lib/postNotice";
import NoticeForm from "./NoticeForm";
import NoticeCard from "./NoticeCard";

export const dynamic = "force-dynamic";

async function postNotice(previousState, formData) {
  "use server";
  const action = createPostNotice({
    classify: classifyNotice,
    query: pool.query.bind(pool),
    revalidate: revalidatePath,
  });
  return action(previousState, formData);
}

async function deleteNotice(formData) {
  "use server";
  await pool.query("DELETE FROM notices WHERE id = $1", [formData.get("id")]);
  revalidatePath("/");
}

export default async function Home() {
  const { rows } = await pool.query(
    "SELECT id, text, mood, urgency, created_at FROM notices ORDER BY created_at DESC"
  );
  const notices = rows.map((notice) => ({
    ...notice,
    ...classificationWithDefaults(notice),
  }));

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(1200px 600px at 100% -10%, rgba(236,72,153,0.10), transparent 60%), radial-gradient(1000px 500px at -10% 0%, rgba(99,102,241,0.12), transparent 55%)",
        py: { xs: 4, sm: 8 },
      }}
    >
      <Container maxWidth="sm">
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }}>
          <Box
            sx={{
              display: "grid",
              placeItems: "center",
              width: 48,
              height: 48,
              borderRadius: 3,
              color: "#fff",
              background: "linear-gradient(135deg, #6366f1, #ec4899)",
              boxShadow: "0 10px 24px -8px rgba(99,102,241,0.6)",
            }}
          >
            <PushPinRoundedIcon />
          </Box>
          <Box>
            <Typography variant="h1" sx={{ fontSize: { xs: "1.6rem", sm: "2rem" } }}>
              Company&apos;s Sentimental Noticeboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Post a quick message for everyone to see.
            </Typography>
          </Box>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          sx={{ mt: 2, mb: 1.5 }}
        >
          <Chip
            size="small"
            color="primary"
            variant="outlined"
            label={`${notices.length} ${notices.length === 1 ? "notice" : "notices"}`}
          />
        </Stack>

        <NoticeForm action={postNotice} />

        {notices.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: "center",
              border: "1px dashed",
              borderColor: "divider",
              color: "text.secondary",
            }}
          >
            <InboxRoundedIcon sx={{ fontSize: 48, opacity: 0.5, mb: 1 }} />
            <Typography variant="h6" color="text.primary">
              No notices yet
            </Typography>
            <Typography variant="body2">
              Be the first to post something above.
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={1.75}>
            {notices.map((n) => (
              <NoticeCard key={n.id} notice={n} deleteAction={deleteNotice} />
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
}
