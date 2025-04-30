const express = require('express');
const app = express();
const path = require('path');
const homeRoutes = require('./routes/home/homeRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/cashManage', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB Connected');
   
  })
  .catch(err => console.error('Connection error', err));


app.set('view engine', 'ejs');



app.use('/', homeRoutes);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
