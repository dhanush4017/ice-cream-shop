# IcyTales

IcyTales is organized into separate frontend and backend folders.

## Folder structure

- `frontend` - React + Vite website
- `backend` - Spring Boot + MySQL REST API

## Run frontend

Open a terminal inside `frontend`:

```bash
npm install
npm run dev
```

Frontend: http://localhost:5173

## Run backend

Open the `backend` folder in Spring Tool Suite / Eclipse / IntelliJ and run:

`IcyTalesBackendApplication.java`

Backend: http://localhost:8080

Make sure MySQL is running and the `icytales` database/user settings in
`backend/src/main/resources/application.properties` match your local MySQL setup.

## Authentication flow

- New browser: Register first
- After registration: Login
- Returning browser: Login
- Login accepts Email or User ID
- Logout is available from the website header

## Prices

Product prices are displayed in Indian Rupees and use different values between ₹50 and ₹60.
