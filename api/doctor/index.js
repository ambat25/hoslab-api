const router = require('express').Router();
const Joi = require('joi');
const db = require('../../models/db');
const _ = require('lodash');
async function validateInsert(req, res, next) {
	try {
		const schema = {
			name: Joi.string().min(5).max(255).required(),
			age: Joi.number().min(20).max(255).required(),
			phone: Joi.string().min(7).max(255).required(),
			speciality: Joi.string().min(2).max(255).required(),
			gender: Joi.string().lowercase().valid([ 'male', 'female' ]).required()
		};
		await Joi.validate(req.body, schema);
		console.log('here');
		next();
	} catch (err) {
		res.status(400).send(err.details[0].message);
	}
}
async function validateUpdate(req, res, next) {
	try {
		const acceptableFields = [ 'name', 'age', 'address', 'phone', 'gender', '_id', '_rev', 'speciality' ];
		Object.keys(req.body).forEach((key) => {
			if (acceptableFields.indexOf(key) === -1) {
				// throw new Error(`${key} is not acceptable`);
				delete req.body[key];
			}
		});
		next();
	} catch (error) {
		console.error(error.message);
		res.status(400).send(error.message);
	}
}
router.param('id', async (req, res, next) => {
	try {
		const doctor = await db.get(req.params.id);
		if (doctor.doctype != 'doctor') {
			throw new Error('this user is not a doctor');
		}
		req.doctor = doctor;
		next();
	} catch (ex) {
		res.status(404).send('Incorrect ID');
	}
});

router
	.route('/')
	.get(async (req, res) => {
		const doctors = await db.query('views/all_doctors');
		res.send(
			doctors.rows.map((doctor) => {
				delete doctor.value.doctype;
				return doctor.value;
			})
		);
	})
	.post(validateInsert, async (req, res) => {
		const newDoctor = {
			_id: new Date().toISOString(),
			name: req.body.name.toLowerCase(),
			gender: req.body.gender.toLowerCase(),
			phone: req.body.phone,
			age: req.body.age,
			speciality: req.body.speciality.toLowerCase(),
			doctype: 'doctor'
		};
		const doctor = await db.put(newDoctor);
		delete newDoctor.doctype;
		res.send({
			...doctor,
			...newDoctor
		});
	});
router
	.route('/:id')
	.get(async (req, res) => {
		delete req.doctor.doctype;
		res.send(req.doctor);
	})
	.put(validateUpdate, async (req, res) => {
		Object.keys(req.body).forEach((parameter) => {
			req.doctor[parameter] = req.body[parameter];
		});
		const doctor = await db.put(req.doctor);
		delete req.doctor.doctype;
		res.send({
			...req.doctor,
			_id: doctor.id,
			_rev: doctor.rev
		});
	})
	.delete(async (req, res) => {
		await db.remove(req.doctor);
		res.send(req.doctor);
	});

module.exports = router;
