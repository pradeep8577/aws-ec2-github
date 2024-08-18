// create simple server which retunr hello 

const express = require('express')
const app = express()
const dotenv = require("dotenv");
dotenv.config();


const PORT = process.env.PORT;


app.get('/', (req, res) => {
    res.send('Hello')
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})