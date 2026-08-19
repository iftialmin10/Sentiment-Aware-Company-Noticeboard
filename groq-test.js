// Minimal Groq API test: calls Groq's recommended successor model with a fixed prompt.
// Set GROQ_API_KEY in .env (see .env.example). Get a key at https://console.groq.com/keys.

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const DEFAULT_MODEL = "openai/gpt-oss-120b";

if (!GROQ_API_KEY) {
  console.error("Missing GROQ_API_KEY. Copy .env.example to .env and add your key.");
  process.exit(1);
}

async function main() {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      messages: [{ role: "user", content: "how are you?" }],
    }),
  });

  if (!res.ok) {
    throw new Error(`Groq API error ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  console.log(data.choices[0].message.content);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
