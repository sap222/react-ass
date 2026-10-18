# EventHub – Event Management System

A React + Redux Toolkit application for discovering live events through the **Ticketmaster Discovery API**, registering for them and managing your registrations.

Built for *Web Programming – Assignment 2*.

## Features

**Authentication (frontend simulation)**
- Register with name, email and password, then log in and log out
- Form validation (required fields, email format, password strength, password confirmation)
- Passwords are hashed (SHA-256) before being stored, and duplicate emails are rejected
- Session is persisted in `localStorage`, so you stay logged in after a refresh

**Event exploration**
- Upcoming events and category shortcuts on the home page
- Keyword search for events, artists, teams and venues
- Filters: category, genre, country, city, date range and sort order
- Categories and genres loaded from the Ticketmaster classifications endpoint
- Pagination, with all filters kept in the URL (shareable links, back button works)
- Loading skeletons, empty states and error messages with retry

**Event details**
- Name, date and time, venue, address (with a Google Maps link), category and image
- Price range, public sale dates, event status, lineup, seat map and notes
- Link to buy tickets on Ticketmaster and a share button

**Registration and My Events**
- Logged-in users can register for an event or cancel a registration
- Duplicate, past and cancelled-event registrations are prevented
- Toast notifications for feedback and a confirmation dialog before cancelling
- My Events page with **Upcoming** and **Completed** tabs and registration stats
- Registrations are stored per user, so each account only sees its own events

## Tech stack

| Area | Library |
| --- | --- |
| UI | React 19 + Vite |
| State | Redux Toolkit (`configureStore`, `createSlice`, `createAsyncThunk`) + React Redux |
| Routing | React Router v6 |
| Data | Ticketmaster Discovery API v2 |
| Styling | Plain CSS with CSS variables (no UI framework) |

## Getting started

### Prerequisites
- Node.js 18 or newer
- A free Ticketmaster API key: create an account at [developer.ticketmaster.com](https://developer.ticketmaster.com/), open **My Apps** and copy the **Consumer Key**

### Setup

```bash
git clone https://github.com/sap222/react-ass.git
cd react-ass
npm install
```

Create a `.env` file in the project root (use `.env.example` as a template):

```
VITE_TM_API_KEY=your_ticketmaster_consumer_key
```

> `.env` is listed in `.gitignore`, so the key is never committed.

### Run

```bash
npm run dev       # start the dev server at http://localhost:5173
npm run build     # production build in dist/
npm run preview   # preview the production build
npm run lint      # run ESLint
```

## Project structure

```
src/
├── app/store.js              # configureStore + localStorage persistence
├── features/
│   ├── auth/                 # authSlice: users, session, register/login thunks
│   ├── events/               # eventsSlice: list, upcoming, categories, details
│   ├── registrations/        # registrationsSlice: per-user registrations
│   └── ui/                   # uiSlice: toast notifications
├── services/ticketmaster.js  # Discovery API client and response normalisation
├── components/               # Reusable UI (EventCard, FilterPanel, Pagination, …)
├── pages/                    # Route views (Home, Events, EventDetails, MyEvents, …)
└── utils/                    # Formatting, validation, filters and storage helpers
```

## Routes

| Path | Page | Access |
| --- | --- | --- |
| `/` | Home: hero, categories, upcoming events | Public |
| `/events` | Search, filter and browse events | Public |
| `/events/:id` | Event details and registration | Public (registering requires login) |
| `/login`, `/register` | Authentication | Guests only |
| `/my-events` | Registered events (Upcoming / Completed) | Logged-in users |
| `*` | 404 page | Public |

## Redux store

| Slice | State | Key actions |
| --- | --- | --- |
| `auth` | `users`, `currentUser`, `status`, `error` | `registerUser`, `loginUser` (thunks), `logout` |
| `events` | `list`, `upcoming`, `categories`, `details` | `fetchEvents`, `fetchUpcomingEvents`, `fetchCategories`, `fetchEventDetails` |
| `registrations` | `byUser: { [userId]: Registration[] }` | `registerForEvent`, `cancelRegistration` |
| `ui` | `toasts` | `showToast`, `dismissToast` |

## Notes

- Authentication is a frontend-only simulation, as allowed by the assignment. There is no backend, and all data lives in the browser's `localStorage`.
- The Ticketmaster API allows 5000 requests per day and 2 requests per second. Some data, such as categories and upcoming events, is cached in Redux so it isn't fetched repeatedly.
- The Discovery API only allows paging through the first 1000 results of a search, so pagination is capped accordingly.
