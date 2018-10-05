const PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-erase'));
PouchDB.plugin(require('pouchdb-find'));
const config = require('config')
const db = new PouchDB(`http://admin:admin@localhost:5984/${config.get('db')}`)

module.exports = db