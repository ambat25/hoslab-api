const request = require('supertest')
const db = require('../../models/db')
let server;
let doctor;


describe('[DOCTOR]', () => {
    beforeEach(async () => {
        server = await require('../../server')
    })
    afterEach(async () => {
        await server.close()
    })
    describe('GET /api/doctor', () => {
        it('Should return all the doctors', async () => {
            doctor = [{
                "_id": "1",
                'doctype': 'doctor'
            }, {
                "_id": "2",
                'doctype': 'doctor'
            }, {
                "_id": "3",
                'doctype': 'doctor'
            }]
            await db.bulkDocs(doctor)
            const res = await request(server).get('/api/doctors')
            expect(res.status).toBe(200)
            expect(res.body.length).toBe(3)
            expect(res.body[0]).toBeDefined
            expect(res.body[0].doctype).toBe(doctor[0].doctype)
            expect(res.body[1]).toBeDefined
            expect(res.body[1].doctype).toBe(doctor[1].doctype)
            expect(res.body[2]).toBeDefined
            expect(res.body[2].doctype).toBe(doctor[2].doctype)
            await db.remove(res.body[0])
            await db.remove(res.body[1])
            await db.remove(res.body[2])
        })
    })
    describe('POST /api/doctor', () => {
        it('Should return 400 if speciality is not provided', async () => {
            doctor = {
                "name": "Aisha",
                "gender": "female",
                "age": 20,
                "speciality": "optician"
            }
            const res = await request(server).post('/api/doctors').send(doctor)
            expect(res.status).toBe(400)
        })
        it('Should return 400 if speciality is not provided', async () => {
            doctor = {
                "name": "Aisha",
                "gender": "female",
                "age": 20,
                "phone": "09088998876"
            }
            const res = await request(server).post('/api/doctors').send(doctor)
            expect(res.status).toBe(400)
        })
        it('Should return 400 if age is less than 20', async () => {
            doctor = {
                "name": "Aisha",
                "gender": "female",
                "age": 19,
                "speciality": "doctor",
                "phone": "09088998876"
            }
            const res = await request(server).post('/api/doctors').send(doctor)
            expect(res.status).toBe(400)
        })
        it('Should return 400 if age is not provided', async () => {
            doctor = {
                "name": "Aisha",
                "gender": "female",
                "speciality": "doctor",
                "phone": "09088998876"
            }
            const res = await request(server).post('/api/doctors').send(doctor)
            expect(res.status).toBe(400)
        })
        it('Should return 400 if gender is not correct', async () => {
            doctor = {
                "name": "Aisha",
                "gender": "fem",
                "age": 22,
                "speciality": "doctor",
                "phone": "09088998876"
            }
            const res = await request(server).post('/api/doctors').send(doctor)
            expect(res.status).toBe(400)
        })
        it('Should return 400 if gender is not provided', async () => {
            doctor = {
                "name": "Aisha",
                "age": 22,
                "speciality": "doctor",
                "phone": "09088998876"
            }
            const res = await request(server).post('/api/doctors').send(doctor)
            expect(res.status).toBe(400)
        })
        it('Should return 400 if name is not provided', async () => {
            doctor = {
                "gender": "female",
                "age": 22,
                "speciality": "doctor",
                "phone": "09088998876"
            }
            const res = await request(server).post('/api/doctors').send(doctor)
            expect(res.status).toBe(400)
        })
        it('Should add a new doctor', async () => {
            doctor = {
                "name": "Fatima",
                "gender": "female",
                "age": 22,
                "speciality": "doctor",
                "phone": "09088998876"
            }
            const res = await request(server).post('/api/doctors').send(doctor)
            expect(res.status).toBe(200)
            expect(res.body).toBeDefined
            expect(res.body.name).toEqual(doctor.name.toLowerCase())
            await db.remove(res.body.id, res.body.rev)
        })
    })
    describe('ROUTE /api/doctor/id', () => {
        it('Should return 404 if id is not valid', async () => {
            const res = await request(server).get('/api/doctors/1')
            expect(res.status).toBe(404)
        })
    })
    describe('GET /api/doctor/id', () => {
        it('Should return the doctor', async () => {
            doctor = {
                "_id": "1",
                'doctype': 'doctor'
            }
            await db.put(doctor)
            const res = await request(server).get('/api/doctors/1')
            expect(res.status).toBe(200)
            expect(res.body.doctype).toEqual('doctor')
            await db.remove(res.body)
        })
    })
    describe('PUT /api/doctor/id', () => {
        it('Should update the doctor', async () => {
            doctor = {
                "_id": "1",
                "name": "Fatima",
                "gender": "female",
                "age": 22,
                "speciality": "doctor",
                "phone": "09088998876",
                "doctype": "doctor"
            }
            await db.put(doctor)
            const res = await request(server).put('/api/doctors/1').send({
                "name": "aisha"
            })
            expect(res.status).toBe(200)
            expect(res.body.name).toEqual("aisha")
            await db.remove(res.body._id, res.body.rev)
        })
        it('Should return if a wrong property is been updated', async () => {
            doctor = {
                "_id": "1",
                "name": "Fatima",
                "gender": "female",
                "age": 22,
                "speciality": "doctor",
                "phone": "09088998876",
                "doctype": "doctor"
            }
            await db.put(doctor)
            const res = await request(server).put('/api/doctors/1').send({
                "service": "some service"
            })
            expect(res.status).toBe(400)
            const doc = await db.get("1")
            await db.remove(doc)
        })
    })
    describe('DELETE /api/doctor/id', () => {
        it('Should delete the propter doctor when id is valid', async () => {
            doctor = {
                "_id": "1",
                'doctype': 'doctor'
            }
            await db.put(doctor)
            const res = await request(server).delete('/api/doctors/1')
            expect(res.status).toBe(200)
            const res1 = await request(server).delete('/api/doctors/1')
            expect(res1.status).toBe(404)
        })
    })
})