const router = require('express').Router();
const Joi = require('joi')
const db = require('../../models/db')
async function validateInsert(req, res, next) {
    try {
        const schema = {
            patient: Joi.object().keys({
                id: Joi.date().iso().required(),
                name: Joi.string().required()
            }).required(),
            doctor: Joi.object().keys({
                id: Joi.date().iso().required(),
                name: Joi.string().required()
            }).required(),
            tests: Joi.array().required(),
        }
        await Joi.validate(req.body, schema)
        next()
    } catch (err) {
        res.status(400).send(err.details[0].message);
    }
}
// async function validateUpdate(req, res, next) {
//     try {
//         const acceptableFields = ['patient', 'doctor', 'processed']
//         Object.keys(req.body).forEach(key => {
//             if (acceptableFields.indexOf(key) === -1) {
//                 throw new Error(`${key} is not acceptable`)
//             }
//         })
//         next()
//     } catch (error) {
//         console.error(error.message)
//         res.status(400).send(error.message);
//     }
// }

router.param('id', async (req, res, next) => {
    try {
        const lab_test = await db.get(req.params.id)
        if (lab_test.doctype != 'lab_tests') {
            throw new Error('this user is not a doctor')
        }
        req.lab_test = lab_test
        next()
    } catch (ex) {
        res.status(404).send('Incorrect ID');
    }
})

router.route('/')
    .get(async (req, res) => {
        const lab_tests = await db.query('views/all_tests')
        res.send(lab_tests.rows.map(lab_test => lab_test.value));
    })

    .post(validateInsert, async (req, res) => {
        const tests = [];
        // res.send(req.body);
        req.body.tests.forEach(test => {
            tests.push({
                "name": test,
                "result": null
            })
        });
        const lab_test = {
            "_id": new Date().toISOString(),
            "patient": {
                "id": req.body.patient.id,
                "name": req.body.patient.name
            },
            "doctor": {
                "id": req.body.doctor.id,
                "name": req.body.doctor.name
            },
            "tests": tests,
            "processed": false,
            "doctype": 'lab_tests'
        }
        const test = await db.put(lab_test)
        res.status(201).send({ ...lab_test,
            ...test
        });

    })

router.route('/:id')
    .get(async (req, res) => {
        res.send(req.lab_test);
    })
    // .put(validateUpdate, async (req, res) => {
    //     Object.keys(req.body).forEach(parameter => {
    //         req.lab_test[parameter] = req.body[parameter]
    //     });
    //     const lab_test = await db.put(req.lab_test)
    //     res.send({ ...lab_test,
    //         ...req.lab_test
    //     });
    // })
    .delete(async (req, res) => {
        await db.remove(req.lab_test)
        res.send(req.lab_test);
    })

module.exports = router