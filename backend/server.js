const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security Middleware
app.use(helmet());

// Rate Limiting (limit each IP to 100 requests per 15 minutes)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
});
app.use('/api/', limiter);

// Middleware
app.use(express.json());
app.use(cors());

// Route files
const authRoutes = require('./routes/authRoutes');
const scanRoutes = require('./routes/scanRoutes');

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/scan', scanRoutes);

app.get('/', (req, res) => {
    res.send('CampusEats API is running');
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
