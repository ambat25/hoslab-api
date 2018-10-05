const PouchDB = require('pouchdb')
const config = require('config')
const Patient = new PouchDB(`http://admin:admin@localhost:5984/${config.get('patient_db')}`)


exports.Patient = Patient