const express = require('express');
const connectdb = require('./config/connectdb');
const userRoutes = require('./Routes/userRoutes');
const bookRoutes = require('./Routes/bookRoutes');
const genreRoutes = require('./Routes/genreRoutes');
const cartRoutes = require('./Routes/cartRoutes');
const app = express();
const swaggerDocs = require("./config/swaggerConfig")
const cors = require('cors');
const path = require("path");
const crypto = require('crypto');
const cookieParser = require('cookie-parser');

require('dotenv').config();
const allowedOrigins = ['http://localhost:3001', 'http://localhost:3000', 'http://localhost:3002']; // Add your frontend URL here
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'PATCH', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((req, res, next) => {
  if (!req.cookies.guestId) {
    const uuid = crypto.randomUUID();
    res.cookie('guestId', uuid, {httpOnly: false, maxAge: 7 * 24 * 60 * 60 * 1000});
  }
  next();
});

connectdb();

app.use('/api', userRoutes);

app.use('/api', bookRoutes);

app.use('/api', genreRoutes);

app.use('/api', cartRoutes);

// Initialize Swagger
swaggerDocs(app);
const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`Listening on Port ${port}`)
})

