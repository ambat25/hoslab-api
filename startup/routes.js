const patientRouter = require('../api/patient')
const doctorRouter = require('../api/doctor')
const labTestRouter = require('../api/lab_test')
const resultRouter = require('../api/result')
const error = require('../middlewares/error')
module.exports = (app) => {
    app.use('/api/patients', patientRouter);
    app.use('/api/doctors', doctorRouter);
    app.use('/api/tests', labTestRouter);
    app.use('/api/results', resultRouter);
    app.use(error);
}