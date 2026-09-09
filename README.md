# IcyTales — React + Spring Boot + MySQL

IcyTales is an ice-cream shop full-stack project based on the existing React frontend. The original UI, cart, wishlist, product pages and responsive styling are kept, and a Spring Boot + MySQL backend has been added.

## Tech Stack

### Frontend
- React 18
- Vite
- React Router
- HTML/CSS
- Bootstrap-compatible styling already used by the project

### Backend
- Java 17+
- Spring Boot 4.1.1
- Spring MVC REST API
- Spring Data JPA / Hibernate
- MySQL

Spring Boot 4.1.1 is a current stable Spring Boot release as of this project build.

## Project Structure

```text
ice-cream-shop/
├── backend/
│   ├── pom.xml
│   ├── database.sql
│   └── src/main/java/com/icytales/backend/
│       ├── config/
│       ├── controller/
│       ├── dto/
│       ├── entity/
│       ├── repository/
│       └── service/
├── public/product-images/
├── src/
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── pages/
│   ├── services/api.js
│   └── styles/
└── package.json
```

## 1. Start MySQL

Make sure MySQL Server is running.

Default configuration used by the backend:

```text
Database: icytales
Username: root
Password: root
Port: 3306
```

If your MySQL password is different, edit:

```text
backend/src/main/resources/application.properties
```

You can also run `backend/database.sql` manually. The application is configured with `createDatabaseIfNotExist=true`.

## 2. Start Spring Boot Backend

Open a terminal in:

```text
ice-cream-shop/backend
```

Run:

```bash
mvn clean spring-boot:run
```

Backend URL:

```text
http://localhost:8080
```

The backend automatically seeds the existing IcyTales catalog into MySQL the first time the product table is empty.

## 3. Start React Frontend

Open another terminal in:

```text
ice-cream-shop
```

Run:

```bash
npm install
npm start
```

The Vite frontend normally opens at:

```text
http://localhost:5173
```

`npm run dev` also works.

## Frontend ↔ Backend Integration

The checkout page now sends the cart to:

```text
POST /api/orders
```

The backend:

1. Reads product prices from MySQL.
2. Calculates subtotal on the server.
3. Applies `SUMMER50` or `SWEET10` as a 10% discount.
4. Adds the $20 demo shipping charge.
5. Saves the customer order and order items.
6. Returns the generated order number and final total to React.
7. React opens the existing Order Success page using the real backend order.

The newsletter form now sends subscriptions to:

```text
POST /api/newsletter/subscribe
```

The product CRUD API is also ready for future admin pages:

```text
GET    /api/products
GET    /api/products/{id}
GET    /api/products?category=sundaes
POST   /api/products
PUT    /api/products/{id}
DELETE /api/products/{id}
```

Order APIs:

```text
POST /api/orders
GET  /api/orders
GET  /api/orders/{orderNumber}
PUT  /api/orders/{orderNumber}/status
```

## Payment Note

The checkout UI still validates the card fields for the demo, but the backend intentionally does **not** store card number, expiry or CVV. A real payment gateway such as Stripe/Razorpay should be used for production payments.

## Important

If you only run the React frontend without the Spring Boot backend, the UI will still load, but **Place Order** and **Newsletter Subscribe** require the backend to be running on port 8080.
