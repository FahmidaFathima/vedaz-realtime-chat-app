# ConnectChat – Real-Time Chat Application

## Overview

ConnectChat is a real-time chat application built using React, Node.js, Express, Socket.IO, and SQLite. It enables users to communicate instantly while maintaining chat history across page refreshes.

## Features

* Real-time messaging using Socket.IO
* Username-based chat
* View previous messages after refreshing the application
* Message timestamps
* Persistent chat history using SQLite
* Responsive and user-friendly interface
* Graceful handling of connection status

## Tech Stack

### Frontend

* React
* Vite
* CSS

### Backend

* Node.js
* Express.js
* Socket.IO
* SQLite

## Project Structure

```text
vedaz-realtime-chat-app/
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── package.json
└── README.md
```

## Installation

### Clone the repository

```bash
git clone https://github.com/FahmidaFathima/vedaz-realtime-chat-app.git
```

### Navigate to the project

```bash
cd vedaz-realtime-chat-app
```

### Install dependencies

Root:

```bash
npm install
```

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd ../frontend
npm install
```

## Running the Project

Start the backend:

```bash
cd backend
npm start
```

Start the frontend:

```bash
cd frontend
npm run dev
```

Open your browser and visit:

```text
http://localhost:3000
```

## Environment Variables

The project includes `.env.example` files.

Backend example:

```text
PORT=8080
```

Frontend example:

```text
VITE_API_URL=http://localhost:8080
```

Update the values if deploying to a cloud platform.

## Design Decisions

* Socket.IO is used for low-latency real-time communication.
* SQLite is used as a lightweight database for storing chat history.
* React components are organized for reusability and maintainability.
* Express provides REST APIs for fetching and storing messages.
* The UI is designed to be clean, responsive, and easy to use.

## Assumptions

* Users enter a username before joining the chat.
* Authentication is not implemented.
* Messages are stored locally using SQLite.
* Internet connectivity is required for real-time communication.

## Future Improvements

* User authentication
* Typing indicators
* Online/offline presence
* Read receipts
* Image and file sharing
* Group chat functionality
* Cloud database integration
* Live deployment

## Author

**Fahmida Fathima**
