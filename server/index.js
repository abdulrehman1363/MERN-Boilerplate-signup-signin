const express = require('express');
const connectDB = require('./config/db')
const bodyParser = require('body-parser')
const cors = require('cors')
const keys = require('./config/keys')
const routes = require('./routes')

const app = express();


app.use(express.json())
app.use(cors())
app.use(bodyParser.json({limit: '30mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '30mb', extended: true}))
app.use(routes)

connectDB();

app.listen(keys.port, ()=> {
    console.log(`server is listening on port ${keys.port}`)
})