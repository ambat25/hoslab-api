const request = require('supertest')
const db = require('../../models/db')
let server;
let result;


describe('[RESULTS]', () => {
    beforeEach(async () => {
        server = await require('../../server')
    })
    afterEach(async () => {
        await server.close()
    })

    describe('GET /api/results', () => {
        it('it should return all the tests', async () => {
            const test = [{
                "_id": "1",
                "processed": true,
                "doctype": "lab_tests"
            }, {
                "_id": "2",
                "processed": true,
                "doctype": "lab_tests"
            }, {
                "_id": "3",
                "processed": true,
                "doctype": "lab_tests"
            }]
            await db.bulkDocs(test)
            const res = await request(server).get('/api/results')
            expect(res.status).toBe(200)
            expect(res.body).toBeDefined
            expect(res.body[0]._id).toEqual(test[0]._id)
            await db.remove(res.body[0])
            await db.remove(res.body[1])
            await db.remove(res.body[2])
        })
    })
    describe('ROUTE /api/tests/:id', () => {
        it('it should return 404 if not proper testid is provided', async () => {
            const res = await request(server).get('/api/results/1')
            expect(res.status).toBe(404)
        })
    })
    describe('GET /api/results/:id', () => {
        it('should return the result', async () => {
            const test = {
                "_id": "1",
                "patient": {
                    id: new Date().toISOString(),
                    name: "fatime"
                },
                "doctor": {
                    id: new Date().toISOString(),
                    name: "Abubakar"
                },
                "tests": ["malaria"],
                "processed": true,
                "doctype": "lab_tests"
            }
            const savedTest = await db.put(test)
            const res = await request(server).get('/api/results/1')
            expect(res.status).toBe(200)
            await db.remove(res.body)
        })
        it('should return 204 if result is not processed', async () => {
            const test = {
                "_id": "1",
                "patient": {
                    id: new Date().toISOString(),
                    name: "fatime"
                },
                "doctor": {
                    id: new Date().toISOString(),
                    name: "Abubakar"
                },
                "tests": ["malaria"],
                "processed": false,
                "doctype": "lab_tests"
            }
            await db.put(test)
            const res = await request(server).get('/api/results/1')
            expect(res.status).toBe(204)
            const toBeRemovedTest = await db.get("1")
            await db.remove(toBeRemovedTest)
        })
    })
    // describe('POST /api/results', () => {
    //     it("should return hello", async () => {
    //         const test = {
    //             "_id": "1",
    //             "patient": {
    //                 id: new Date().toISOString(),
    //                 name: "fatime"
    //             },
    //             "doctor": {
    //                 id: new Date().toISOString(),
    //                 name: "Abubakar"
    //             },
    //             "tests": ["malaria"],
    //             "processed": false,
    //             "doctype": "lab_tests"
    //         }
    //         await db.put(test)
    //         const testResult = {
    //             id: 1,
    //             tests: {
    //                 "malaria": "present"
    //             }
    //         }
    //         const res = await request(server).post('/api/results').send(testResult)
    //         expect(res.status).toBe(200)
    //         expect(res.body.processed).toEqual(true)
    //         expect(res.body.tests.malaria).toEqual(testResult.tests.malaria)
    //         await db.remove(res.body)
    //     })
    // })


})