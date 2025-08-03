# E-commerce Application

A full-stack e-commerce application built with React, Node.js, Express, and MongoDB. This application allows users to browse products, add them to cart, and place orders.

## Features

- User authentication (login/register)
- Product listing with search and filter functionality
- Shopping cart management
- Order processing
- Order history
- Admin dashboard for product management
- Responsive design for all devices

## Tech Stack

- **Frontend**: React, Redux, React Router, Axios
- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: CSS3, Flexbox, Grid

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account or local MongoDB installation

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd ecommerce-app
```

### 2. Set Up Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   ```

4. Seed the database with sample products (optional):
   ```bash
   node seedProducts.js
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

### 3. Set Up Frontend

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory:
   ```
   REACT_APP_API_URL=http://localhost:5000/api/v1
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Project Structure

```
ecommerce-app/
├── backend/               # Backend server
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── .env              # Environment variables
│   ├── server.js         # Main server file
│   └── package.json
│
└── frontend/             # Frontend React app
    ├── public/           # Static files
    └── src/
        ├── components/   # Reusable components
        ├── pages/        # Page components
        ├── services/     # API services
        ├── store/        # Redux store
        ├── utils/        # Utility functions
        ├── App.js        # Main App component
        └── index.js      # Entry point
```

## Available Scripts

### Backend

- `npm run dev` - Start the development server
- `npm test` - Run tests
- `npm run lint` - Run ESLint

### Frontend

- `npm start` - Start the development server
- `npm test` - Run tests
- `npm run build` - Build for production

## Environment Variables

### Backend

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | - |
| JWT_SECRET | Secret for JWT | - |
| JWT_EXPIRE | JWT expiration time | 30d |

### Frontend

| Variable | Description | Default |
|----------|-------------|---------|
| REACT_APP_API_URL | Backend API URL | http://localhost:5000/api/v1 |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
