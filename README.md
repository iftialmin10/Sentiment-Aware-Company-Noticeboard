# Company's Sentimental Noticeboard

An AI-assisted company noticeboard that classifies each message by mood and urgency. Notices are stored in PostgreSQL and displayed with accessible color cues, labels, and urgency animations.

[![Watch the video](https://img.youtube.com/vi/_2vUJDH207c/maxresdefault.jpg)](https://www.youtube.com/watch?v=_2vUJDH207c)

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



