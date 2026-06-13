# Company's Sentimental Noticeboard

A simple noticeboard where anyone can post and delete short notices.

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
