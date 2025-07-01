require("dotenv").config();
const express = require('express');
const app = express();

const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes")
const connectDB= require('./config/dbConnection');
const morgan = require('morgan');
const upload= require("./middleware/uploadMiddleware");
const PORT = process.env.PORT || 9800;
app.use(express.json());
app.use(morgan('dev'));
app.use('/', authRoutes);
app.use('/', documentRoutes);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`SERVER IS RUNNING ON PORT http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
  });
