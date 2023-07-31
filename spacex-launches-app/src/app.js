
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const launchRoutes = require('./routes/launchRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

app.use('/auth', authRoutes); //authRoute
app.use('/launches', launchRoutes);//launchRoute

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
