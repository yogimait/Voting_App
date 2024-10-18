const express = require('express')
const app = express()
require('dotenv').config();
const db= require('./db')
const port = 3000

const bodyParse= require('body-parser');
app.use(bodyParse.json());
const PORT = process.env.PORT || 3000;
const {jwtAuthMiddleware} = require('./jwt');

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const userroutes = require('./routes/userroutes');
const candidateroutes = require('./routes/candidateroutes');
app.use('/user',userroutes);
app.use('/candidate',candidateroutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})