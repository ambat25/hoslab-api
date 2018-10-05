const PouchDB = require('pouchdb')
const config = require('config')
const LabTest = new PouchDB(`http://admin:admin@localhost:5984/${config.get('test_db')}`)
console.log(config.get('test_db'))

module.exports = LabTest