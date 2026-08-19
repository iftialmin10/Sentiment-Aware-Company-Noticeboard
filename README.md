# Company's Sentimental Noticeboard

A simple noticeboard where anyone can post and delete short notices.

## Groq setup

Copy the example environment file before starting the application:

```sh
cp .env.example .env
```

Set `GROQ_API_KEY` in `.env` to a real key from the
[Groq console](https://console.groq.com/keys). Docker Compose passes this
variable only to the server-side `web` service. Never prefix it with
`NEXT_PUBLIC_`, expose it to client components, print it in logs, or commit
the `.env` file.

After adding or changing the key, rebuild and recreate the web container:

```sh
docker compose up -d --build --force-recreate web
```

Confirm that the container received the variable without displaying its
value:

```sh
docker compose exec web node -e "console.log(process.env.GROQ_API_KEY ? 'GROQ_API_KEY is configured' : 'GROQ_API_KEY is missing')"
```

If `GROQ_API_KEY` is missing or contains only whitespace, the server must skip
the Groq request and classify the notice with the safe defaults `normal` and
`no rush`. It may write a generic server warning such as `Groq classification
unavailable`, but must never log the key. The same fallback applies when Groq
times out, fails, or returns an invalid classification, so a classification
failure does not prevent a valid notice from being saved.

Groq requests are limited to five seconds and are not retried. Classification
failures are logged only as generic operational events, without the API key or
notice text. The posting UI does not announce fallback classification because
the notice is still saved successfully; database failures are shown as errors
and leave the user's text in place for another attempt.

## Testing

Run the repeatable classifier, posting, validation, and presentation tests:

```sh
npm test
```

Use `docs/testing-checklist.md` for browser checks that require visual,
responsive, reduced-motion, keyboard, or screen-reader inspection.

## Local database setup

Start the application and PostgreSQL with:

```sh
docker compose up --build
```

On a fresh PostgreSQL volume, Docker runs `init.sql` automatically. The
`notices` table includes non-null `mood` and `urgency` columns, defaults them
to `normal` and `no rush`, and rejects values outside the classification
contract.

To upgrade an existing database without deleting its notices, run the Phase 2
migration once while the database service is running:

```sh
docker compose exec -T db psql -U notes -d notes < migrations/002_add_notice_classification.sql
```

The migration gives existing rows the safe defaults before enforcing the same
non-null and check constraints as a fresh installation. Do not rerun this
one-time migration after it succeeds.

To deliberately reset the local database and discard all notices instead:

```sh
docker compose down -v
docker compose up --build
```

## Future Specifications

The following describes planned behavior. It is a specification only — no implementation is prescribed here.

### Infrastructure

- **Database** — Neon (hosted Postgres).
- **LLM** — Groq, for free Llama access.

### LLM-derived attributes

Every posted note gains two attributes, each inferred by an LLM at posting time:

- **Mood** — one of: `bad`, `normal`, `good`
- **Urgency** — one of: `no rush`, `urgent`, `emergency`

### Mood → note color

The note's color reflects its mood:

| Mood     | Color |
| -------- | ----- |
| `bad`    | red   |
| `normal` | white |
| `good`   | green |

### Urgency → note animation

The note's motion reflects its urgency:

| Urgency     | Animation                            |
| ----------- | ------------------------------------ |
| `no rush`   | none                                 |
| `urgent`    | heartbeat vibration, 1 second delay  |
| `emergency` | heartbeat vibration, 0.5 second delay |
