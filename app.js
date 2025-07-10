require("dotenv").config();
const express = require('express');
const app = express();
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");
const connectDB = require('./config/dbConnection');
const morgan = require('morgan');
const PORT = process.env.PORT || 9800;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

app.use(morgan('dev'));


app.get('/', (req, res) => {
  res.redirect('/signup'); 
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/pdfscanner', (req, res) => {
  res.render('pdfscanner');
});


app.use('/', authRoutes);
app.use('/api/documents', documentRoutes); 

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`SERVER IS RUNNING ON PORT http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
  });