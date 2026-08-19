# Company's Sentimental Noticeboard

An AI-assisted company noticeboard that classifies each message by mood and urgency. Notices are stored in PostgreSQL and displayed with accessible color cues, labels, and urgency animations.

## How it works

```text
Browser form
    -> Next.js Server Action validates the notice
    -> Groq classifies mood and urgency
    -> Server validates the classification (or applies safe defaults)
    -> PostgreSQL stores the notice
    -> Material UI renders its mood and urgency
```

The application uses Next.js 14 with the App Router and Server Actions, React 18, Material UI, PostgreSQL 16, and the Groq Chat Completions API. Classification and database access remain server-side; the Groq key is never sent to the browser.

## Prerequisites

- Docker with Docker Compose
- A [Groq API key](https://console.groq.com/keys) for AI classification (optional; the app has a safe fallback)
- Node.js 20+ and npm if running tests or the web app outside Docker

## Environment variables

Copy the example file:

```sh
cp .env.example .env
```

Then configure:

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string used by the server. For the included Docker database, use `postgresql://notes:notes@db:5432/notes`. |
| `GROQ_API_KEY` | No | Server-side Groq credential. If absent or blank, notices use the fallback classification. |

Example local Docker configuration:

```dotenv
DATABASE_URL=postgresql://notes:notes@db:5432/notes
GROQ_API_KEY=your_groq_api_key
```

Never prefix the Groq key with `NEXT_PUBLIC_`, expose it in client components or logs, or commit `.env`.

## Start with Docker

Build and start the web application and PostgreSQL:

```sh
docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000). To run in the background, add `-d`.

After changing environment variables, recreate the web service:

```sh
docker compose up -d --build --force-recreate web
```

Verify that the Groq key reached the container without printing it:

```sh
docker compose exec web node -e "console.log(process.env.GROQ_API_KEY ? 'GROQ_API_KEY is configured' : 'GROQ_API_KEY is missing')"
```

Stop the services without deleting database data:

```sh
docker compose down
```

## Database setup and migrations

For a new `pgdata` volume, PostgreSQL automatically runs `init.sql` and creates the final `notices` schema.

Docker initialization scripts do not run again for an existing volume. If the database predates the mood and urgency columns, start the database and apply the migration once:

```sh
docker compose exec -T db psql -U notes -d notes < migrations/002_add_notice_classification.sql
```

The migration preserves existing notices, assigns `normal` and `no rush` defaults, and adds database constraints for supported values. Do not rerun it after it succeeds because it is not idempotent.

To intentionally erase all local notices and initialize a clean database:

```sh
docker compose down -v
docker compose up --build
```

This deletes the Docker database volume and cannot be undone.

## Classification contract

Mood and urgency are evaluated independently. A positive notice may still be urgent, while a negative notice is not automatically an emergency.

### Mood

| Value | Meaning | Appearance |
| --- | --- | --- |
| `bad` | Negative, unhappy, concerning, angry, disappointing, or critical | Pale red background (`#fff7f7`) and red accent (`#ef9a9a`) |
| `normal` | Neutral, factual, routine, or emotionally unclear | White background (`#ffffff`) and neutral accent (`#d7dce3`) |
| `good` | Positive, thankful, encouraging, or celebratory | Pale green background (`#f3fbf5`) and green accent (`#81c995`) |

Each card also displays a text mood chip, so meaning does not depend on color alone.

### Urgency

| Value | Meaning | Presentation |
| --- | --- | --- |
| `no rush` | No immediate action is required | Static chip |
| `urgent` | Action is required soon or by a near-term deadline | Heartbeat animation with a 1-second duration |
| `emergency` | Immediate action is required to prevent serious harm, loss, outage, or disruption | Heartbeat animation with a 0.5-second duration |

Animations apply only to the urgency chip. They are disabled when the operating system requests reduced motion; the text label remains visible.

## Groq behavior and fallback

The server uses Groq's `openai/gpt-oss-120b` model with JSON output and a five-second timeout. Model output is treated as untrusted and accepted only when both fields exactly match the allowed values.

The safe fallback is:

```json
{
  "mood": "normal",
  "urgency": "no rush"
}
```

The fallback is used when the API key is missing, the request fails or times out, the response is malformed, or it contains unsupported values. Groq requests are not retried, and classification failure does not prevent a valid notice from being saved. Operational warnings exclude the API key and notice text.

Notice text is trimmed, must not be empty, and is limited to 1,000 characters before Groq is called.

## Tests

Install dependencies if needed, then run the automated Node test suite:

```sh
npm install
npm test
```

The suite covers the classification contract, Groq success and fallback paths, input validation, notice posting, database failures, and presentation mappings.

For responsive layout, accessibility, contrast, keyboard, screen-reader, and reduced-motion checks, follow [docs/testing-checklist.md](docs/testing-checklist.md).

To verify a production build:

```sh
npm run build
```

## Project structure

```text
app/          Next.js pages, Server Actions, and Material UI components
lib/          Database, validation, classification, posting, and presentation logic
migrations/   SQL migrations for existing databases
docs/         Classification and manual testing documentation
init.sql      Schema for new PostgreSQL volumes
```
