# Sentiment-Aware Company Noticeboard

A workplace noticeboard that does more than display messages: it understands their tone. Each notice is classified by mood and urgency, then presented with accessible labels, color cues, and motion so important updates stand out without losing context.

## Live Link https://company-s-sentimental-noticeboard.onrender.com/

## Video Link https://www.youtube.com/watch?v=_2vUJDH207c
[![Watch the project demo](https://img.youtube.com/vi/_2vUJDH207c/maxresdefault.jpg)](https://www.youtube.com/watch?v=_2vUJDH207c)

## Features of this App

- Separates **mood** from **urgency**, so a positive announcement can still demand immediate action.
- Keeps AI and database operations server-side, protecting credentials and application data.
- Validates AI output and falls back safely when classification is unavailable.
- Communicates meaning with text as well as color and respects reduced-motion preferences.

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

## Built with

Next.js 14 | React 18 | Material UI | PostgreSQL 16 | Groq API | Docker

## Run locally

```sh
cp .env.example .env
```

Set these values in `.env`:

```dotenv
DATABASE_URL=postgresql://notes:notes@db:5432/notes
GROQ_API_KEY=your_groq_api_key
```

Then start the project:

```sh
docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000). The application still works with a safe default classification when `GROQ_API_KEY` is left blank.



