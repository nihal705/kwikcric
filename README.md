
# KwikCric

## 🚀 Live Demo
[View Live Demo](https://kwikcric.vercel.app)

### Complete Cricket Stats Platform with Interactive Games

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-Proprietary-red)
![React](https://img.shields.io/badge/React-18.2.0-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-3178c6)
![Node](https://img.shields.io/badge/Node-18.x-339933)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-4169e1)

---

## Overview

**KwikCric** is a comprehensive cricket platform that combines **extensive cricket statistics**, **interactive games**, **tournament history**, and **player rankings** in one unified web application. Built with modern technologies, KwikCric delivers a seamless experience for cricket enthusiasts to explore data, play games, and track their progress.

### Key Capabilities

| Category | Description |
|----------|-------------|
| **Player Statistics** | Complete profiles with batting/bowling stats across Test, ODI, T20I, and IPL formats |
| **Team Rankings** | All-time rankings for international teams across all formats |
| **Tournament Hub** | Complete history of ODI World Cup, T20 World Cup, Champions Trophy, WTC, and IPL |
| **Interactive Games** | Kwik Cricket, Cricket Mastermind Quiz, Imposter Game, Cricket Cards Collection |
| **User System** | JWT authentication with guest mode support |
| **Dark/Light Mode** | Full theme support with system preference detection |

---

## Features

### Player Section
- **Players Page** - Browse all players with infinite scroll, search, filters (country, role), and sorting (runs, wickets, name)
- **Player Detail Page** - Complete player profile with bio, career stats, performance metrics, and peak rankings
- **Player Rankings** - All-time rankings by format (ODI/Test/T20I/Overall) and category (Batting/Bowling/All-rounder) with GOAT scoring methodology
- **Team Rankings** - Team rankings across all formats

### Tournament Hub
- **ODI World Cup** - Complete history from 1975 to 2026 with team rankings, points tables, matches, and all-time records
- **T20 World Cup** - Full tournament data from 2007 to 2026 with Super 8/10/12 stages and abandoned match handling
- **Champions Trophy** - History of cricket's "Mini World Cup" from 1998 to 2025
- **World Test Championship** - WTC cycles from 2019-present with detailed statistics
- **Team Detail Pages** - Title victories, winning squads, final matches, and top performers for each champion team

### Indian Premier League (IPL)
- **IPL Hub** - Complete IPL coverage with team rankings, player database, all-time records, and cap winners
- **Season Details** - Points table, playoffs bracket, and full match list for each IPL season (2008-2024)
- **IPL Players** - Searchable database of IPL players with career stats

### Interactive Games

| Game | Status | Description |
|------|--------|-------------|
| **Kwik Cricket** | Live | Fast-paced cricket simulation with overs, AI opponent, two-player mode, and stats tracking |
| **Cricket Mastermind** | Live | Quiz game with 1000+ questions across multiple categories and difficulty levels |
| **Imposter** | Live | Social deduction game where players describe cards and identify the imposter |
| **Cricket Cards** | Live | Collectible card game with pack opening, daily rewards, achievements, and currency system |

### History Section
- Interactive timeline covering cricket history from 1550 to present day
- Six eras: Origins → Rules → Global → Golden → Modern → T20

### User System
- JWT-based authentication with secure password hashing
- Guest mode support for non-registered users
- Protected routes for games requiring authentication
- Game history and stats persistence

---

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 + TypeScript | UI framework with type safety |
| Tailwind CSS | Utility-first styling with dark mode |
| Framer Motion | Smooth animations and transitions |
| React Router v6 | Client-side routing |
| Axios | HTTP client for API calls |
| React Hot Toast | Toast notifications |
| Recharts | Data visualization charts |
| React Intersection Observer | Infinite scroll implementation |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express | REST API server |
| PostgreSQL | Relational database |
| JWT | Authentication tokens |
| bcrypt | Password hashing |

### Development Tools
| Tool | Purpose |
|------|---------|
| Vite | Fast build tool and dev server |
| TypeScript | Type safety across the codebase |
| ESLint | Code linting |
| Postman | API testing |

---

## Architecture
```text
KwikCric
├── Frontend (Port 5173 - Vite/React)
│ ├── Pages (Home, Players, Games, Tournaments, IPL, History, Auth)
│ ├── Components (Navbar, Footer, Cards, Scorecards, Filters)
│ ├── Contexts (AuthContext for user state management)
│ ├── Services (API service layer)
│ └── Utils (Helper functions, image utilities)
│
└── Backend (Port 3000 - Express)
├── REST APIs (Players, Rankings, World Cup, IPL, Auth, Games)
├── Controllers (Request handlers)
├── Routes (API endpoints)
├── Middleware (Auth, CORS, logging)
└── PostgreSQL Database
```

### Data Flow
User Action → React Component → Service Layer → API Call → Express Route →
PostgreSQL Query → Response → Component State → UI Update

---

## Installation & Setup

### Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | 18.x or higher |
| npm | 9.x or higher |
| PostgreSQL | 15.x or higher |
| Git | Latest |

### Clone Repository

```bash
git clone https://github.com/nihalmohammad705-debug/kwikcric.git
cd kwikcric
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend
# Install dependencies
npm install
# Create .env file (see Environment Variables section)
cp .env.example .env
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend
# Install dependencies
npm install
```

### Start Backend Server

```bash
cd backend
npm run dev
# Server runs on http://localhost:3000
```

### Start Frontend Development Server

```bash
cd frontend
npm run dev
# Application runs on http://localhost:5173
```

### Production Build

```bash
# Frontend build
cd frontend
npm run build
```

### API Endpoints
```text
Players
Method	Endpoint	Description
GET	/api/players	Get paginated list of players with filters
GET	/api/players/:id/complete	Get complete player details with stats
GET	/api/players/search	Search players by name
Rankings
Method	Endpoint	Description
GET	/api/rankings/:format/:category	Get player rankings (format: odi/test/t20i/overall, category: batting/bowling/allrounder)
GET	/api/rankings/goat	Get GOAT rankings across all formats
Team Rankings
Method	Endpoint	Description
GET	/api/team-rankings/:format	Get team rankings (format: overall/odi/t20/test)
GET	/api/team-rankings/all	Get combined team rankings
GET	/api/teams/list	Get list of all teams

World Cup
Method	Endpoint	Description
GET	/api/world-cup/tournaments	Get all tournaments by type
GET	/api/world-cup/tournaments/year/:year	Get tournament by year
GET	/api/world-cup/:year/full-details	Get complete tournament details
GET	/api/world-cup/team-rankings	Get team rankings by tournament type
GET	/api/world-cup/team/:teamName	Get team details with victories
GET	/api/world-cup/all-time-records	Get all-time records

IPL
Method	Endpoint	Description
GET	/api/ipl/seasons	Get all IPL seasons
GET	/api/ipl/seasons/:year	Get IPL season by year
GET	/api/ipl/team-rankings	Get IPL team rankings
GET	/api/ipl/players	Get IPL players list
GET	/api/ipl/players/:id	Get IPL player details
GET	/api/ipl/cap-winners	Get Orange Cap and Purple Cap winners
GET	/api/ipl/all-time-records	Get IPL all-time records

Authentication
Method	Endpoint	Description
POST	/api/auth/register	Register new user
POST	/api/auth/login	Login user
GET	/api/auth/me	Get current user info
POST	/api/auth/logout	Logout user

Games
Method	Endpoint	Description
POST	/api/kwik-cricket/save	Save match result
GET	/api/kwik-cricket/history	Get match history
GET	/api/kwik-cricket/stats	Get user statistics

Health Check
Method	Endpoint	Description
GET	/health	Check server and database status
```

📁 Project Structure
```text
kwikcric/
├── frontend/
│   ├── src/
│   │   ├── App.tsx                 # Main application with routing
│   │   ├── index.css               # Global styles and dark mode
│   │   ├── main.tsx                # Application entry point
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx      # Navigation bar with theme toggle
│   │   │   │   └── Footer.tsx      # Footer component
│   │   │   ├── common/
│   │   │   │   └── ProtectedRoute.tsx # Route protection wrapper
│   │   │   └── games/
│   │   │       ├── Common/
│   │   │       │   └── LeaderboardTable.tsx
│   │   │       └── KwikCricket/
│   │   │           ├── components/
│   │   │           └── data/
│   │   ├── pages/
│   │   │   ├── Home/
│   │   │   │   ├── HomePage.tsx
│   │   │   │   └── components/
│   │   │   ├── Players/
│   │   │   │   ├── PlayersPage.tsx
│   │   │   │   ├── PlayerDetailPage.tsx
│   │   │   │   ├── PlayerRankingsPage.tsx
│   │   │   │   ├── PlayerCard.tsx
│   │   │   │   ├── PlayerStats.tsx
│   │   │   │   └── Teams/
│   │   │   │       └── TeamRankingsPage.tsx
│   │   │   ├── Games/
│   │   │   │   ├── GamesPage.tsx
│   │   │   │   ├── GamesHistoryHubPage.tsx
│   │   │   │   ├── KwikCricket/
│   │   │   │   │   ├── KwikCricketPage.tsx
│   │   │   │   │   └── KwikCricketHistoryPage.tsx
│   │   │   │   ├── CricketMastermind/
│   │   │   │   │   └── CricketMastermindPage.tsx
│   │   │   │   ├── Imposter/
│   │   │   │   │   └── ImposterPage.tsx
│   │   │   │   └── CricketCards/
│   │   │   │       └── CricketCardsPage.tsx
│   │   │   ├── Tournaments/
│   │   │   │   ├── WorldCupHub.tsx
│   │   │   │   ├── WorldCupDetailPage.tsx
│   │   │   │   ├── TeamDetailPage.tsx
│   │   │   │   ├── T20WorldCupHub.tsx
│   │   │   │   ├── T20WorldCupDetailPage.tsx
│   │   │   │   ├── T20TeamDetailPage.tsx
│   │   │   │   ├── ChampionsTrophyHub.tsx
│   │   │   │   ├── ChampionsTrophyDetailPage.tsx
│   │   │   │   ├── ChampionsTrophyTeamDetailPage.tsx
│   │   │   │   ├── WTCHub.tsx
│   │   │   │   ├── WTCDetailPage.tsx
│   │   │   │   ├── WTCTeamDetailPage.tsx
│   │   │   │   └── components/
│   │   │   │       ├── AllTimeRecords.tsx
│   │   │   │       ├── GreatestMatches.tsx
│   │   │   │       ├── TournamentStats.tsx
│   │   │   │       └── TournamentAchievements.tsx
│   │   │   ├── IPL/
│   │   │   │   ├── IPLHub.tsx
│   │   │   │   ├── IPLSeasonDetailPage.tsx
│   │   │   │   ├── IPLPlayersPage.tsx
│   │   │   │   ├── IPLPlayerDetailPage.tsx
│   │   │   │   └── components/
│   │   │   │       ├── IPLPlayerCard.tsx
│   │   │   │       └── IPLCapWinners.tsx
│   │   │   ├── TournamentHub/
│   │   │   │   └── TournamentHubPage.tsx
│   │   │   ├── History/
│   │   │   │   └── HistoryPage.tsx
│   │   │   └── Auth/
│   │   │       ├── LoginPage.tsx
│   │   │       └── RegisterPage.tsx
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx     # Authentication state management
│   │   ├── services/
│   │   │   ├── api/
│   │   │   │   ├── playerAPI.ts
│   │   │   │   ├── rankingsAPI.ts
│   │   │   │   ├── worldCupAPI.ts
│   │   │   │   ├── iplAPI.ts
│   │   │   │   └── gameAPI.ts
│   │   │   ├── authAPI.ts
│   │   │   ├── kwikCricketAPI.ts
│   │   │   └── gamePersistence.ts
│   │   └── utils/
│   │       └── playerImage.ts      # Player image URL helper
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── postcss.config.js
│
├── backend/
│   ├── server.js                   # Main Express server
│   ├── package.json
│   ├── .env
│   ├── router/
│   │   └── v1/
│   │       ├── authRoutes.js
│   │       ├── pollRoutes.js
│   │       └── kwikCricketRoutes.js
│   ├── middleware/
│   │   └── auth.js
│   ├── controllers/
│   │   └── authController.js
│   └── database/
│       └── schema.sql
│
├── database/
│   ├── migrations
│   └── seeds
│
└── README.md
```

### Games Overview

1. Kwik Cricket 

Fast-paced cricket simulation game with full match experience.

Features:

Multiple overs (1, 2, 4, 6, 10 overs)

AI opponent with difficulty levels (Easy, Medium, Hard)

Two-player mode

Squad selection from real players

Batting order customization

Live commentary

Full scorecard with batting/bowling stats

Match history and statistics tracking

Game Modes:

Full Match - Complete innings with target chasing

Kwik Play - Quick 1/2-over challenge

Storage:

Authenticated users: Saved to database

Guest users: Saved to localStorage

2. Cricket Mastermind 

Test your cricket knowledge with thousands of questions.

Game Modes:

Quick Quiz - Random questions with time limit

Challenge Mode - Progressive difficulty with lives

Fill the Table - Complete missing data in cricket tables

Categories:

All-Mode (mix of all categories)

Players & Records

World Cups

IPL

Cricket History

Difficulty Levels:

Easy - Basic cricket knowledge

Medium - Intermediate questions

Hard - Expert-level trivia

Features:

Score tracking

Streak bonuses

Best streak records

Accuracy percentage

Local storage for guest stats

3. Imposter 

Social deduction game where players must identify the imposter among them.

How to Play:

Choose game mode (Local Multiplayer or VS Bots)

Select theme (Cricket Players, IPL Teams, World Cups)

Players receive cards - one player gets a different hint (imposter)

Each player describes their card without revealing it

Players vote on who they think is the imposter

Game Modes:

Local Multiplayer - Pass-and-play with friends

VS Bots - Play against AI opponents

Themes:

Cricket Players

IPL Teams

World Cups

4. Cricket Cards 

Collectible card game featuring cricket players.

Features:

Card Packs - Open standard, premium, and legendary packs

Daily Rewards - Claim rewards for consecutive logins

Achievements - Unlock achievements for collecting cards

Currency System - Earn KwikCric Coins and Gems

Card Rarities - Common, Rare, Epic, Legendary, Mythic

Collection Sets - Complete themed sets for bonus rewards

Favorites - Mark your favorite cards

Card Types:

Batsmen cards

Bowler cards

All-rounder cards

Wicket-keeper cards

Shop Items:

Standard Pack (100 Coins)

Premium Pack (50 Gems)

Legendary Pack (200 Gems)

### Tournament Hub

ODI World Cup:

Complete history from 1975 to 2023

Team rankings with titles and runner-up counts

All-time records (most runs, wickets, sixes, hundreds)

Greatest matches (highest scoring, closest finishes)

Tournament stats for each edition

Achievements and memorable moments

T20 World Cup:

Complete history from 2007 to 2024

Support for multiple formats (Super 8s, Super 10s, Super 12s)

Abandoned match handling (rain-affected matches)

Group stage and knockout filters

Champions Trophy:

History from 1998 to 2025

Known as cricket's "Mini World Cup"

Complete edition details

World Test Championship:

WTC cycles from 2019-present

Team rankings

All-time records

Additional stats (wicket-keepers, most catches, highest scores, best bowling)

IPL:

Team rankings

Player database with IPL-specific stats

Orange Cap and Purple Cap winners

### Player Rankings System

GOAT (Greatest of All Time) Scoring Methodology

#### Batsmen Ranking Formula
GOAT Score = (Average × 6) + (Runs/2000) + (Centuries × 2) + (Fifties × 0.5) + (Formats × 8) + Peak Bonus
Weightage Distribution:

Component	Weight
Batting Average	35%
Total Runs	20%
Centuries	15%
Fifties	10%
Formats Played	10%
Peak ICC Rank	10%


### Bowlers Ranking Formula
GOAT Score = (10000/Average) + (Wickets/5) + (5W × 15)
Weightage Distribution:

Component	Weight
Bowling Average	35%
Total Wickets	25%
5-Wicket Hauls	20%
Economy Rate	10%
Formats Played	5%
Peak ICC Rank	5%

#### All-Rounders Ranking Formula
GOAT Score = (Batting GOAT Score + Bowling GOAT Score) / 2
Minimum Requirements:

2000 runs AND 50 wickets in international cricket

### Performance Metrics (Player Detail Page)

Batting Metrics:

Metric	Description

Consistency	Based on big scores (50s + 100s×2) per match

Power Hitting	Based on sixes per match

Acceleration	Based on strike rate

Pressure Rating	Based on batting average

Longevity	Based on matches played


Bowling Metrics:

Metric	Description

Accuracy	Based on bowling average (lower is better)

Wicket Taking	Based on wickets per match

Economy	Based on economy rate

Strike Rate	Based on balls per wicket

Match Winning	Based on 5-wicket hauls

### Authentication & Authorization
User Types
Type	Description	Capabilities
Guest	Non-registered user	Play games (stats saved to localStorage), browse content
Registered User	Authenticated user	Full access, game stats saved to database, leaderboards
Admin	Admin user	Content management (not exposed in frontend)

### Auth Flow

1. User registers → Password hashed with bcrypt → JWT generated
2. User logs in → Credentials verified → JWT returned
3. Client stores JWT in localStorage
4. Subsequent requests include JWT in Authorization header
5. Protected routes verify JWT before rendering

### Protected Routes
The following routes require authentication:

/games/kwik-cricket - Full game experience (guest mode available separately)

/dashboard (if implemented)

/profile (if implemented)

##Dark Mode Support
KwikCric features full dark mode support with:

System preference detection - Automatically matches OS preference

Manual toggle - User can switch via navbar button

Persistent storage - Preference saved to localStorage

All components styled - Cards, tables, modals, and all UI elements

---

## Troubleshooting & Common Issues
| Issue | Solution |
|-------|----------|
| **Database connection failed** | Check PostgreSQL service is running (`sudo systemctl start postgresql` on Linux, `brew services start postgresql` on Mac). Verify credentials in `.env` file. |
| **Port 3000 already in use** | Kill process using port 3000: `lsof -i :3000` then `kill -9 <PID>` OR change PORT in `.env` |
| **Port 5173 already in use** | Change port in `vite.config.ts` or kill existing process |
| **CORS errors** | Ensure `CORS_ORIGIN=http://localhost:5173` in backend `.env` matches your frontend URL |
| **Player images not loading** | Check network tab for 404 errors. Images are fetched from external URLs - some may be outdated. Fallback initials will appear. |
| **Dark mode not persisting** | Clear localStorage and refresh. Check browser doesn't block localStorage. |
| **Game stats not saving (Guest)** | Check browser localStorage isn't full or blocked. Guest data saves locally only. |
| **Login fails** | Verify backend is running on port 3000. Check console for JWT errors. |
| **Infinite scroll not working** | Ensure `react-intersection-observer` is installed. Check console for errors. |
| **Tailwind styles not applying** | Run `npm run build:css` or restart dev server. |

### Quick Diagnostic Commands
```bash
# Check if backend is running
curl http://localhost:3000/health

# Check PostgreSQL connection
psql -U postgres -d kwikcric -c "SELECT 1"

# Check Node version
node --version  # Should be 18.x or higher

# Clear node_modules and reinstall (if issues persist)
rm -rf node_modules package-lock.json
npm install
```

## Browser Support

| Browser | Minimum Version | Status |
|---------|-----------------|--------|
| Chrome | 90+ | Fully Supported |
| Firefox | 88+ | Fully Supported |
| Safari | 14+ | Fully Supported |
| Edge | 90+ | Fully Supported |
| Opera | 76+ | Supported |
| Mobile Chrome | 90+ | Supported |
| Mobile Safari | 14+ | Supported |

**Note:** Internet Explorer is NOT supported.

### Performance Optimization

Frontend Optimizations Implemented

Technique	Implementation

Code Splitting	Lazy loading for pages using React.lazy()

Image Optimization	Player images with fallback SVGs

Infinite Scroll	Reduces initial load time for player lists (24 items per batch)

Debounced Search	500ms delay reduces API calls during typing

Memoization	React.memo for frequently rendered components

Tailwind JIT	Just-in-time compilation for minimal CSS

Backend Optimizations Implemented

Technique	Implementation

Database Indexes	Indexed columns: player_name, format, tournament_id

Query Optimization	Using appropriate JOINs and WHERE clauses

Connection Pooling	PostgreSQL connection reuse via pg.Pool

Pagination	Limit/offset for all list endpoints

Caching Ready	Structure supports Redis caching (optional)

Lighthouse Scores (Expected)

Metric	Score

Performance	85-95

Accessibility	90-95

Best Practices	90-100

SEO	85-95

### Security Features

Feature	Implementation

JWT Authentication	Stateless authentication with 7-day expiration

Password Hashing	bcrypt with 10 salt rounds

SQL Injection Prevention	Parameterized queries throughout

CORS Configuration	Restricted to allowed origins only

Environment Variables	Sensitive data never hardcoded

Guest Mode Isolation	Guest data only in localStorage, never sent to backend

Input Validation	All API inputs validated before processing

⚠️ Note
KwikCric is a personal project created and maintained by Nihal. While every effort is made to respond to inquiries, response times may vary based on availability.

### Acknowledgments

Data Sources

ICC - Tournament structures and official records

ESPNcricinfo - Historical cricket statistics and player data

Wikipedia - Tournament history and results

Open Source Libraries

Library	Purpose

React	UI Framework

Tailwind CSS	Styling

Framer Motion	Animations

Recharts	Data visualization

React Hot Toast	Notifications

Express	Backend framework

PostgreSQL	Database

Special Thanks

Cricket community for inspiration and feedback

Open source contributors of all dependencies used in this project

### Proprietary License
```text
License Summary
License Type	Proprietary / All Rights Reserved
Copyright Holder	Mohammad Nihal
Commercial Use	❌ Not permitted without written consent
Modification	❌ Not permitted
Distribution	❌ Not permitted
Source Code Access	🔒 Restricted
Attribution	✅ Required if permitted in writing
```

### Disclaimer
```text
KwikCric is an independent project and is not affiliated, associated, authorized, endorsed by, or in any way officially connected with:

International Cricket Council (ICC)

Board of Control for Cricket in India (BCCI)

Indian Premier League (IPL)

Any cricket board or official cricket organization

All data displayed is for informational and entertainment purposes only. Player images and team logos are property of their respective owners. If you are a copyright holder and believe any content on this platform infringes upon your rights, please contact the developer for prompt resolution.
```

### Final Notes
KwikCric is the result of countless hours of development, database design, and a deep passion for cricket. Every feature, from the GOAT ranking algorithm to the interactive games, was built with cricket fans in mind.

If you enjoy using KwikCric, consider:

Starring the repository on GitHub

Reporting bugs you encounter

Suggesting features you'd like to see

Sharing feedback via email

### Contact & Support
KwikCric is a solo-developed project by Nihal, here are the ways to get in touch:

GitHub: github.com/nihalmohammad705-debug

📧 Email

nihalmohammad705@gmail.com

(For bugs, feature requests, licensing inquiries, or collaborations)

Bug Reports

For reporting bugs or issues, please include:

Detailed description of the issue

Steps to reproduce

Screenshot or screen recording (if applicable)

Browser and OS version

Console errors (if any)
