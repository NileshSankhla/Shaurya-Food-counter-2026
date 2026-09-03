# Shaurya Food Counter 2026

A modern, full-stack web application designed for campus dining and food counter management.

## Project Structure

This is a monorepo containing both the frontend and backend applications:

- `/backend` - Node.js & Express API server with MongoDB database integration.
- `/frontend` - Vanilla JavaScript, HTML, and CSS web interface.

## Prerequisites

- Node.js (v16 or higher recommended)
- MongoDB account and connection URI (or local MongoDB server)
- Bun (optional, project contains `bun.lock` files)

## Setup & Installation

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file by copying the example: `cp .env.example .env`
4. Update the variables in `.env` with your actual MongoDB URI and a secure JWT Secret.
5. Start the server: `npm start` (or `node server.js`)

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. If you want to change the API endpoint, edit `frontend/js/config.js`.
3. Open the `.html` files directly in a browser or serve them using a tool like Live Server or a simple HTTP server (e.g., `npx serve`).

## Security Notice

Sensitive files such as `.env` are explicitly excluded from version control via `.gitignore`. Never commit your actual `.env` file.
