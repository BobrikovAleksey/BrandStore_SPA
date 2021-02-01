const express = require('express');
const cartRouter = require('./scripts/cartRouter');
const apiRouter = require('./scripts/apiRouter');

const app = express();

app.use(express.json());
app.use('/avatars', express.static('./database/avatars/'));
app.use('/api/cart', cartRouter);
app.use('/api', apiRouter);


const port = process.env.PORT || 3030;

app.listen(port, () => console.log(`Server for online clothing store "Brand" is running on port ${port}`));
