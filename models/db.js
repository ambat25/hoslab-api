const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-erase'));
PouchDB.plugin(require('pouchdb-find'));
const config = require('config');

const db = new PouchDB(`${config.get('db-url')}/${config.get('db')}`);

module.exports = db;
