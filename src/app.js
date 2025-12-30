const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const connectDB = require('./db/database');
connectDB();

app.use(express.json());

const routes = require('./routes');

app.use('/', routes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
