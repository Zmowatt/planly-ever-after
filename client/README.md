# Planly Ever After

Planly Ever After is a full-stack wedding planning and budget management dashboard built with Flask, SQLAlchemy, and React.

The app helps newly engaged couples organize important wedding planning details in one place, including their wedding profile, budget items, and vendors.

## Features

* User signup, login, and logout
* Session-based authentication
* Protected frontend routes
* Wedding profile view and update
* Budget item CRUD
* Vendor CRUD
* Dashboard summaries
* Flask API backend
* React frontend
* SQLAlchemy database models and relationships
* Seed data for local testing

## Tech Stack

### Frontend

* React
* React Router
* Vite
* CSS

### Backend

* Python
* Flask
* Flask-SQLAlchemy
* Flask-Migrate
* Flask-Bcrypt
* Flask-CORS
* SQLite

## Models

### User

A user can create an account, log in, and manage their wedding planning data.

### Wedding

A wedding belongs to a user and stores details such as partner names, wedding date, venue, estimated guest count, total budget, and theme.

### BudgetItem

Budget items belong to a wedding and track category, description, estimated cost, actual cost, paid status, and notes.

### Vendor

Vendors belong to a wedding and track vendor name, category, contact information, quoted price, status, rating, and notes.

## User Flow

1. User signs up or logs in.
2. User is redirected to the dashboard.
3. User can view wedding summary information.
4. User can update their wedding profile.
5. User can add, view, update, and delete budget items.
6. User can add, view, update, and delete vendors.
7. User can log out.
8. Protected pages redirect unauthenticated users back to login.

## API Routes

### Auth

* `POST /api/signup`
* `POST /api/login`
* `GET /api/check_session`
* `DELETE /api/logout`

### Wedding

* `GET /api/wedding`
* `PATCH /api/wedding/<id>`

### Budget Items

* `GET /api/budget-items`
* `POST /api/budget-items`
* `PATCH /api/budget-items/<id>`
* `DELETE /api/budget-items/<id>`

### Vendors

* `GET /api/vendors`
* `POST /api/vendors`
* `PATCH /api/vendors/<id>`
* `DELETE /api/vendors/<id>`

## Local Setup

Clone the repository:

```bash
git clone git@github.com:Zmowatt/planly-ever-after.git
cd planly-ever-after
```

## Backend Setup

From the project root:

```bash
cd server
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
flask db upgrade
python seed.py
python app.py
```

The backend runs on:

```txt
http://localhost:5555
```

## Frontend Setup

In a second terminal, from the project root:

```bash
cd client
npm install
npm run dev
```

The frontend runs on:

```txt
http://localhost:5173
```

## Demo Login

```txt
Username: zach
Password: password123
```

## Current Status

This project includes a complete MVP/final submission version with authentication, multiple related resources, CRUD functionality, a connected React frontend, and basic elegant styling.

## Future Improvements

* Guest list management
* Wedding task checklist
* Payment and deposit tracking
* Vendor comparison view
* Improved dashboard visualizations
* Better mobile responsiveness
* Hosted deployment for frontend and backend
* More advanced form validation
