# Sentiment-Aware Company Noticeboard

A workplace noticeboard that does more than display messages: it understands their tone. Each notice is classified by mood and urgency, then presented with accessible labels, color cues, and motion so important updates stand out without losing context.

[![Watch the project demo](https://img.youtube.com/vi/_2vUJDH207c/maxresdefault.jpg)](https://www.youtube.com/watch?v=_2vUJDH207c)

## Why it stands out

- Separates **mood** from **urgency**, so a positive announcement can still demand immediate action.
- Keeps AI and database operations server-side, protecting credentials and application data.
- Validates AI output and falls back safely when classification is unavailable.
- Communicates meaning with text as well as color and respects reduced-motion preferences.

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



