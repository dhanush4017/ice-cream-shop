# IcyTales Final Checklist

## Frontend
1. `cd frontend`
2. `npm install`
3. `npm run build`

## Backend
1. `cd backend`
2. Configure MySQL and application properties/environment variables.
3. Run `mvn spring-boot:run` (or use the project's existing Maven wrapper/configuration).

## Responsive QA
Check these viewport widths in browser DevTools:
- 320px
- 360px
- 375px
- 390px
- 768px
- 1024px
- 1440px

Verify:
- no horizontal page overflow
- mobile drawer opens from the left
- footer has safe side padding
- buttons/forms/cards remain inside the viewport
- existing scroll-to-top behavior remains intact
- only one logout action is rendered by the existing header logic

## Admin demo
- Admin is seeded on first backend start: `admin@icytales.com` / user ID `admin` / password `Admin@12345`.
- Log in, then open `/admin` or use Admin Panel in the navigation.
- Customer orders are available at `/orders` and `/orders/:orderNumber`.
