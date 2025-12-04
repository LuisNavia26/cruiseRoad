# cruiseRoad
# CruiseRoad 🚗🗺️  
_A comprehensive road trip planner built with the MERN stack and Google Maps APIs._

CruiseRoad is a web application that helps users plan and manage road trips by generating optimized routes, estimating distance and fuel costs, and allowing users to save and revisit their trips later. It combines a React front end, a Node.js/Express back end, MongoDB for persistence, and the Google Maps platform for routing and mapping.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Design Notes & Assumptions](#design-notes--assumptions)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## Features

- **Account System**
  - User registration and login.
  - Authenticated access to personal trips.

- **Interactive Trip Planning**
  - Start + destination input via an interactive Google Map.
  - Support for waypoints/stops along the route.
  - Route visualization on the map using Google Directions.

- **Route Metrics**
  - **Distance estimation** (in miles).
  - **Basic fuel cost estimation** based on selected car type and total distance.

- **Saved Trips**
  - Save planned trips to a database.
  - View and manage saved trips in a dedicated dashboard.

- **Quality & Safety Considerations**
  - Backend validation of trip requests.
  - Separation of client and server API keys.
  - Room for filters to **avoid private / closed roads** and reduce bad-routing scenarios.

---

## Tech Stack

**Frontend**
- React (with Vite)
- `@react-google-maps/api` (Google Maps JavaScript integration)
- HTML5 / CSS / JavaScript (ES6+)

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB + Mongoose

**External APIs**
- Google Maps JavaScript API  
- Google Directions API  
- (Optionally) Google Places API for stops/POIs

---

## Architecture Overview

CruiseRoad uses a classic **MERN** separation of concerns:

- **Client (`client/`)**
  - Vite + React app.
  - Renders the dashboard, map, forms, and saved trips UI.
  - Talks to the backend via `/api/...` endpoints (proxied in development).

- **Server (`server/`)**
  - Express REST API.
  - Handles authentication, trip planning logic, and communication with Google Maps APIs (when needed).
  - Stores and retrieves trips and user data from MongoDB.

- **Database**
  - MongoDB collections for:
    - `users` (credentials, profile data)
    - `trips` (start, destination, waypoints, distance, fuel cost, timestamps, user reference)

---

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm or yarn
- MongoDB instance (local or Atlas)
- Google Cloud project with:
  - Maps JavaScript API enabled
  - Directions API enabled
  - (Optional) Places API enabled

---

### Installation
  Backend
      cd backend
      npm run dev    # or npm start
  Frontend
      cd cruiseroad
      npm run dev


1. **Clone the repository**

```bash
git clone https://github.com/<your-username>/CruiseRoad.git
cd CruiseRoad
