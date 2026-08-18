# Company's Sentimental Noticeboard

A simple noticeboard where anyone can post and delete short notices.

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
