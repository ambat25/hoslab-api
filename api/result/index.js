const router = require('express').Router();
const Joi = require('joi')
const db = require('../../models/db')

// async function validateInsert(req, res, next) {
//     try {
//         const schema = {
//             id: Joi.date().iso().required(),
//             tests: Joi.array().required(),
//         }
//         await Joi.validate(req.body, schema)
//         next()
//     } catch (err) {
//         res.status(400).send(err.details[0].message);
//     }
// }
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
router.param('id', async (req, res, next) => {
    try {
        const lab_test = await db.get(req.params.id)
        if (lab_test.doctype != 'lab_tests') {
            throw new Error()
        }
        req.lab_test = lab_test
        next()
    } catch (ex) {
        res.status(404).send('Incorrect ID');
    }
})
router.route("/")
    .get(async (req, res) => {
        const results = await db.query('views/results')
        res.send(results.rows.map(result => result.value));
    })
// .post(validateInsert, confirmTest, async (req, res) => {
//     req.update_list.forEach(result=>{
//         req.lab_test.tests.forEach()
//     })
//     res.send(req.update_list);
// })
router.route('/:id')
    .get(async (req, res) => {
        if (!req.lab_test.processed) {
            res.status(204).end('result not yet ready');
        } else {
            res.send(req.lab_test);
        }
    })


module.exports = router