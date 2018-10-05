const router = require('express').Router();
const Joi = require('joi')
const db = require('../../models/db')
async function validateInsert(req, res, next) {
    try {
        const schema = {
            name: Joi.string().min(3).max(255).required(),
            age: Joi.number().min(0).max(255).required(),
            address: Joi.string().min(5).max(1024).required(),
            phone: Joi.string().min(7).max(255).required(),
            gender: Joi.string().lowercase().valid(['male', 'female']).required()
        }
        await Joi.validate(req.body, schema)
        next()
    } catch (err) {
        res.status(400).send(err.details[0].message);
    }
}
async function validateUpdate(req, res, next) {
    try {
        const acceptableFields = ['name', 'age', 'address', 'phone', 'gender']
        Object.keys(req.body).forEach(key => {
            if (acceptableFields.indexOf(key) === -1) {
                throw new Error(`${key} is not acceptable`)
            }
        })
        next()
    } catch (error) {
        console.error(error.message)
        res.status(400).send(error.message);
    }
}
router.param('id', async (req, res, next) => {
    try {
        const patient = await db.get(req.params.id)
        if (patient.doctype != 'patient') {
            throw new Error('this user is not a doctor')
        }
        req.patient = patient
        next()
    } catch (ex) {
        res.status(404).send('Incorrect ID');
    }
})

router.route('/')
    .get(async (req, res) => {
        const patients = await db.query('views/all_patients')
        res.send(patients.rows.map(patient => patient.value));
    })
    .post(validateInsert, async (req, res) => {
        const newPatient = {
            "_id": new Date().toISOString(),
            "name": req.body.name.toLowerCase(),
            "gender": req.body.gender.toLowerCase(),
            "address": req.body.address.toLowerCase(),
            "phone": req.body.phone.toLowerCase(),
            "age": req.body.age,
            "doctype": 'patient'
        }
        const patient = await db.put(newPatient)
        res.send({ ...patient,
            ...newPatient
        });
    })
router.route('/:id')
    .get(async (req, res) => {
        res.send(req.patient);
    })
    .put(validateUpdate, async (req, res) => {
        Object.keys(req.body).forEach(parameter => {
            req.patient[parameter] = req.body[parameter]
        });
        const patientUpdates = await db.put(req.patient)
        res.send({ ...req.patient,
            ...patientUpdates
        });
    })
    .delete(async (req, res) => {
        await db.remove(req.patient)
        res.send(req.patient);
    })

module.exports = router