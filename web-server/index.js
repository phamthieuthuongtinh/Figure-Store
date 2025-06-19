require('dotenv').config();
const express = require('express');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());

const webRoutes = require('./routes/web');
app.use('/', webRoutes);

app.listen(5000, () => {
    console.log('Server chạy tại http://localhost:5000');
});
