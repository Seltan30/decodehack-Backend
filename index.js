const cookieParser = require('cookie-parser');
const express = require('express');
const env = require('dotenv');
require('dotenv').config();
const cors = require('cors');
const {mongoose} = require('mongoose');
const cron = require('node-cron');
const resetData = require('./cron/resetData'); 

mongoose.connect(process.env.MONGO_URI)
.then(() => {console.log('MongoDB connected')})
.catch((err) => {console.error(err)});

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/', require('./routes/authroutes'));
app.use('/maps', require('./routes/maproutes'));

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

