const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const blogRoutes = require('./routes/blogRoutes');
const authRoutes = require('./routes/authRoutes');
const {checkUser} = require('./middleware/authMiddleware');

// express app
const app = express();

//connect to mongodb
const dbURI = 'mongodb+srv://carter:test1234@cluster0.mnoqs.mongodb.net/node-crash-course?retryWrites=true&w=majority';
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then((result) => app.listen(process.env.PORT || 3000))
  .catch((err) => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

app.get('*', checkUser);

app.get('/', (req, res) => {
  res.redirect('/blogs');
});

// blog routes
app.use('/blogs', blogRoutes);

// auth routes
app.use(authRoutes);

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});
