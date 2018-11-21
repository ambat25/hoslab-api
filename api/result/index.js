const router = require('express').Router();
const Joi = require('joi');
const db = require('../../models/db');

async function validateInsert(req, res, next) {
	try {
		const schema = {
			id: Joi.date().iso().required(),
			tests: Joi.array().required()
		};
		await Joi.validate(req.body, schema);
		next();
	} catch (err) {
		res.status(400).send(err.details[0].message);
	}
}
async function checkTest(req, res, next) {
	try {
		const lab_test = await db.get(req.body.id);
		if (lab_test.doctype != 'lab_tests') {
			throw new Error('Incorrect Id');
		}

		if (lab_test.tests.length !== req.body.tests.length) {
			throw new Error('Tests not complete');
		}
		const lab_test_registered = lab_test.tests.map((test) => test.name);
		const lab_test_result_sent = req.body.tests.map((test) => test.name);
		const compare_tests = lab_test_registered.every((test) => lab_test_result_sent.indexOf(test) !== -1);
		if (!compare_tests) {
			throw new Error(`invalid test result sent, only ${lab_test_registered.join(', ')} are registered`);
		}
		req.lab_test = lab_test;
		next();
	} catch (ex) {
		res.status(400).send(ex.message);
	}
}
// async function confirmTest(req, res, next) {
//     try {
//         const lab_test = await db.get(req.body.id)
//         if (lab_test.doctype != 'lab_tests') {
//             throw new Error()
//         }
//         let acceptableFields;
//         // le
//         await db.get(req.body.id).then(test => {
//             acceptableFields = test.tests.map(test => test.name)
//         })
//         req.update_list = []
//         // req.lab_test = lab_test
//         Object.keys(req.body.tests).forEach(key => {
//             if (acceptableFields.indexOf(req.body.tests[key].name) === -1) {
//                 throw new Error(`${req.body.tests[key].name} is not among the tests lists`)
//             }
//             // req.lab_test.tests
//         })
//         req.lab_test = lab_test
//         next()
//     } catch (ex) {
//         res.status(404).send(ex.message);
//     }
// }
router.param('id', checkTest);
router
	.route('/')
	.get(async (req, res) => {
		const results = await db.query('views/results');
		res.send(results.rows.map((result) => result.value));
	})
	.post(validateInsert, checkTest, async (req, res) => {
		req.lab_test.tests = req.body.tests;
		req.lab_test.processed = true;
		const result = await db.put(req.lab_test);
		res.status(200).send({ ...req.lab_test, ...result });
		// req.lab_test.processed = true;
	});
router.route('/:id').get(async (req, res) => {
	if (!req.lab_test.processed) {
		res.status(204).end('result not yet ready');
	} else {
		res.send(req.lab_test);
	}
});

module.exports = router;
