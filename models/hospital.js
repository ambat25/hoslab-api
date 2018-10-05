const PouchDB = require('pouchdb')
const config = require('config')
const Hospital = new PouchDB(`http://admin:admin@localhost:5984/${config.get('hospital_db')}`)


module.exports = Hospital