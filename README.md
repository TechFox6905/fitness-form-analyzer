# Fitness Form Analyzer

A full-stack web application to analyze fitness form using video uploads. Built with React (frontend) and Node.js/Express (backend).

## Project Structure

```
fitness-form-analyzer/
├── client/                  # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── App.js
│       └── index.js
├── server/                  # Node/Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── app.js
│   └── server.js
├── .env
├── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Setup

#### 1. Install dependencies
```
cd client
npm install
cd ../server
npm install
```

#### 2. Environment Variables
Create a `.env` file in the root and in `/server` for backend secrets (see `.env.example`).

#### 3. Run the app
- Start backend: `cd server && npm start`
- Start frontend: `cd client && npm start`

---

## Features
- Upload fitness videos
- Analyze form using backend logic (placeholder)
- View results in a user-friendly dashboard 