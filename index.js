const express = require('express');
const config = require('config')
require('express-async-errors')

require('../models/couch_view')()
const app = express()

require('../startup/middlewares')(app)
require('../startup/routes')(app)




const port = process.env.PORT || 3123
const server = app.listen(port, () => console.log(`Server started on ${port} ${config.get('db')}`));

module.exports = server