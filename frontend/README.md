# IntelliStock AI frontend

React + TypeScript chat UI served at `/dashboard`, behind the existing login flow.

## Run locally

Set `VITE_API_URL` in `frontend/.env` to the API base URL, including `/api`:

```dotenv
VITE_API_URL=http://localhost:5000/api
```

Install dependencies and start Vite from `frontend`:

```sh
npm install
npm run dev
```

The API, intelligence service, prediction service, and PostgreSQL must also be running for live forecasts. Apply database migrations from `api-service` before starting the updated API:

```sh
npm run migration:up
```

Migration `20260918190000-add-message-forecast-data.js` stores response type and structured data alongside assistant text. Existing messages remain readable as text; old forecast payloads cannot be reconstructed by the migration. The first message names a new conversation, and sending updates its activity timestamp.

## Chat behavior

- `ChatLayout` provides the account header, responsive conversation sidebar, message history, and composer.
- Create and select conversations using the existing `/conversations` endpoints. The most recently updated chat opens on initial load.
- Drafts and pending requests are tracked per conversation, so switching chats does not mix responses.
- Enter sends; Shift + Enter adds a newline. Blank and duplicate in-flight sends are blocked.
- User messages appear immediately while the assistant response is pending.
- After a failed send, history is fetched to check whether the API saved the user message before the assistant failed. Unsaved drafts are restored; uncertain requests are never retried automatically.
- Forecast responses display monthly demand, total demand, monthly average, horizon, model details, and the complete returned payload. Unknown payload shapes have a safe fallback.

## Checks

```sh
npm run build
npm run lint
npx playwright install chromium
npm run test:e2e
```

Browser tests mock the API to cover creation, history loading, conversation switching, drafts, optimistic sending, forecast reloads, failure recovery, keyboard input, and mobile layout. They do not require a running backend. Real model accuracy and service integration are outside these mocked tests.
