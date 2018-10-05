const request = require('supertest')
const db = require('../../models/db')
let server;
let patient;


describe('[PATIENT]', () => {
    beforeEach(async () => {
        server = await require('../../server')
    })
    afterEach(async () => {
        await server.close()
    })
    describe('GET/api/patients', () => {
        it('Should return all the patients', async () => {
            patient = [{
                "_id": "1",
                'doctype': 'patient'
            }, {
                "_id": "2",
                'doctype': 'patient'
            }, {
                "_id": "3",
                'doctype': 'patient'
            }]
            await db.bulkDocs(patient)
            const res = await request(server).get('/api/patients')
            expect(res.status).toBe(200)
            expect(res.body.length).toBe(3)
            expect(res.body[0]).toBeDefined
            expect(res.body[0].doctype).toBe(patient[0].doctype)
            expect(res.body[1]).toBeDefined
            expect(res.body[1].doctype).toBe(patient[1].doctype)
            expect(res.body[2]).toBeDefined
            expect(res.body[2].doctype).toBe(patient[2].doctype)
            await db.remove(res.body[0])
            await db.remove(res.body[1])
            await db.remove(res.body[2])
        })
    })
    describe('POST/api/patients', () => {
        it('Should return 400 phone is not provided', async () => {
            patient = {
                "name": "Musa Isa",
                "age": 30,
                "gender": "female",
                "phone": "0908877667"
            }
            const res = await request(server).post('/api/patients').send(patient)
            expect(res.status).toBe(400)
        })
        it('Should return 400 phone is not provided', async () => {
            patient = {
                "name": "Musa Isa",
                "age": 30,
                "gender": "female",
                "address": "Naibawa kano"
            }
            const res = await request(server).post('/api/patients').send(patient)
            expect(res.status).toBe(400)
        })
        it('Should return 400 gender is not provided', async () => {
            patient = {
                "name": "Musa Isa",
                "age": 30,
                "phone": "09067565676",
                "address": "Naibawa kano"
            }
            const res = await request(server).post('/api/patients').send(patient)
            expect(res.status).toBe(400)
        })
        it('Should return 400 age is not provided', async () => {
            patient = {
                "name": "Musa Isa",
                "gender": "female",
                "phone": "09067565676",
                "address": "Naibawa kano"
            }
            const res = await request(server).post('/api/patients').send(patient)
            expect(res.status).toBe(400)
        })
        it('Should return 400 name is not provided', async () => {
            patient = {
                "age": 20,
                "gender": "female",
                "phone": "09067565676",
                "address": "Naibawa kano"
            }
            const res = await request(server).post('/api/patients').send(patient)
            expect(res.status).toBe(400)
        })
        it('Should return 200 if all data are provided', async () => {
            patient = {
                "name": "Aisha",
                "age": 20,
                "gender": "female",
                "phone": "09067565676",
                "address": "Naibawa kano"
            }
            const res = await request(server).post('/api/patients').send(patient)
            expect(res.status).toBe(200)
            await db.remove(res.body.id, res.body.rev)
        })
    })
    describe('ROUTE/api/patients/:id', () => {
        it('Should return 404 if id is not valid', async () => {
            const res = await request(server).get('/api/patients/1')
            expect(res.status).toBe(404)
        })
    })
    describe('GET/api/patients/:id', () => {
        it('Should return the patient', async () => {
            patient = {
                "_id": "1",
                'doctype': 'patient'
            }
            await db.put(patient)
            const res = await request(server).get('/api/patients/1')
            expect(res.status).toBe(200)
            expect(res.body.doctype).toEqual('patient')
            await db.remove(res.body)
        })
    })
    describe('PUT/api/patients/id', () => {
        it('Should update the patient', async () => {
            patient = {
                "_id": "1",
                "name": "Fatima",
                "age": 22,
                "address": "kabo road",
                "gender": "female",
                "phone": "09088998876",
                "doctype": "patient"
            }
            await db.put(patient)
            const res = await request(server).put('/api/patients/1').send({
                "name": "aisha"
            })
            expect(res.status).toBe(200)
            expect(res.body.name).toEqual("aisha")
            await db.remove(res.body._id, res.body.rev)
        })
        it('Should return if a wrong property is been updated', async () => {
            patient = {
                "_id": "1",
                "name": "Fatima",
                "age": 22,
                "address": "kabo road",
                "gender": "female",
                "phone": "09088998876",
                "doctype": "patient"
            }
            await db.put(patient)
            const res = await request(server).put('/api/patients/1').send({
                "service": "some service"
            })
            expect(res.status).toBe(400)
            const doc = await db.get("1")
            await db.remove(doc)
        })
    })
    describe('DELETE/api/patients/id', () => {
        it('Should delete the propter patient when id is valid', async () => {
            patient = {
                "_id": "1",
                'doctype': 'patient'
            }
            await db.put(patient)
            const res = await request(server).delete('/api/patients/1')
            expect(res.status).toBe(200)
            const res1 = await request(server).delete('/api/patients/1')
            expect(res1.status).toBe(404)
        })
    })
})