# IcyTales Backend

Spring Boot REST API + MySQL for the IcyTales React frontend.

## Requirements

- Java 17+
- Maven 3.9+
- MySQL 8+

## Database

The application uses:

- Database: `icytales`
- Username: `root`
- Password: `root`
- API: `http://localhost:8080`

If your MySQL password is different, edit:

`src/main/resources/application.properties`

The application creates the database when the MySQL user has permission to do so, and JPA creates/updates the tables.

## Run

```bash
mvn clean spring-boot:run
```

Or build a jar:

```bash
mvn clean package
java -jar target/icytales-backend-1.0.0.jar
```

## Main APIs

### Products

- `GET /api/products`
- `GET /api/products/{id}`
- `GET /api/products?category=sundaes`
- `POST /api/products`
- `PUT /api/products/{id}`
- `DELETE /api/products/{id}`

### Orders

- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/{orderNumber}`
- `PUT /api/orders/{orderNumber}/status`

### Newsletter

- `POST /api/newsletter/subscribe`

The backend recalculates order totals from database product prices. Card number, expiry and CVV are intentionally not stored by this demo backend.
