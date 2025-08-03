# E-commerce Backend

This is the backend service for the E-commerce application, built with Go, Gin, and GORM.

## Features

- User authentication (JWT)
- Product management
- Shopping cart functionality
- Order processing
- RESTful API endpoints

## Prerequisites

- Go 1.21 or higher
- SQLite3 (for development)

## Project Structure

```
backend/
├── database/       # Database connection and migrations
├── handlers/       # Request handlers
│   ├── carts.go    # Cart related endpoints
│   ├── items.go    # Item related endpoints
│   ├── orders.go   # Order related endpoints
│   └── users.go    # User authentication endpoints
├── middleware/     # Custom middleware
├── models/         # Database models
└── utils/          # Utility functions
```

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ecommerce/backend
   ```

2. Install dependencies:
   ```bash
   go mod download
   ```

3. Set up environment variables:
   ```bash
   # Copy .env.example to .env
   cp .env.example .env
   
   # Edit .env with your configuration
   JWT_SECRET_KEY=your-secret-key-here
   ```

4. Run the application:
   ```bash
   go run main.go
   ```

   The server will start on `http://localhost:8080`

## API Documentation

### Authentication

- `POST /api/users` - Register a new user
- `POST /api/users/login` - Login and get JWT token

### Items

- `GET /api/items` - Get all items (public)
- `POST /api/items` - Create a new item (admin only)

### Cart

- `GET /api/carts/user` - Get current user's cart
- `POST /api/carts` - Add item to cart

### Orders

- `GET /api/orders` - Get all orders (admin only)
- `GET /api/orders/user` - Get current user's orders
- `POST /api/orders` - Create a new order from cart

## Testing

To run tests:

```bash
go test -v ./...
```

## Environment Variables

- `JWT_SECRET_KEY`: Secret key for JWT token signing
- `DB_DSN`: Database connection string (default: `ecommerce.db` for SQLite)

## License

MIT
