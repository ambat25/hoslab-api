const config = require('config');
const PouchDB = require('pouchdb');
const _ = require('lodash');
const db = require('./db');

const views = {
	_id: '_design/views',
	views: {
		all_patients: {
			map: "function (doc) {\n  if(doc.doctype === 'patient'){\n    emit(doc._id, doc);\n  }\n}"
		},
		all_doctors: {
			map: "function (doc) {\n  if(doc.doctype === 'doctor'){\n    emit(doc._id, doc);\n  }\n}"
		},
		male_doctors: {
			map:
				"function (doc) {\n  if(doc.doctype === 'doctor' && doc.gender === 'male'){\n    emit(doc._id, doc);\n  }\n}"
		},
		female_doctors: {
			map:
				"function (doc) {\n  if(doc.doctype === 'doctor' && doc.gender === 'female'){\n    emit(doc._id, doc);\n  }\n}"
		},
		all_tests: {
			map: "function (doc) {\n  if(doc.doctype === 'lab_tests'){\n    emit(doc._id, doc);\n  }\n}"
		},
		pending_tests: {
			map:
				"function (doc) {\n  if(doc.doctype === 'lab_tests' && doc.processed == false){\n    emit(doc._id, doc);\n  }\n}"
		},
		results: {
			map:
				"function (doc) {\n  if(doc.doctype === 'lab_tests' && doc.processed == true){\n    emit(doc._id, doc);\n  }\n}"
		}
	},
	language: 'javascript'
};
async function setupViews() {
	// try {
	//     const dbDesign = await db.get('_design/views')
	//     if (!_.isEqual(dbDesign.views, views.views)) {
	//         dbDesign.views = views.views
	//         await db.put(dbDesign)
	//     }
	// } catch (error) {
	//     try {
	//         await db.put(views)
	//     } catch (error) {
	//         console.log(error.message)
	//         process.exit(1)
	//     }

	// }
	db
		.get('_design/views')
		.then(async (dbDesign) => {
			if (!_.isEqual(dbDesign.views, views.views)) {
				dbDesign.views = views.views;
				await db.put(dbDesign);
			}
		})
		.catch((err) => {
			db.put(views);
		})
		.catch((err) => {
			console.log(err.message);
			process.exit(0);
		});
}

module.exports = setupViews;
