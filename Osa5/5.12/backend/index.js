//const express = require('express')
//const mongoose = require('mongoose')
const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')


//const mongoUrl = 'mongodb://localhost/bloglist'

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})