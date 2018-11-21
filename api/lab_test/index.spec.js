const request = require('supertest');
const db = require('../../models/db');
let server;

describe('[TESTS ROUTES]', () => {
	beforeEach(async () => {
		server = await require('../../server');
	});
	afterEach(async () => {
		await server.close();
	});

	describe('GET /api/tests', () => {
		it('it should return all the tests', async () => {
			const test = [
				{
					_id: '1',
					doctype: 'lab_tests'
				},
				{
					_id: '2',
					doctype: 'lab_tests'
				},
				{
					_id: '3',
					doctype: 'lab_tests'
				}
			];
			await db.bulkDocs(test);
			const res = await request(server).get('/api/tests');
			expect(res.status).toBe(200);
			expect(res.body).toBeDefined;
			expect(res.body[0]._id).toEqual(test[0]._id);
			await db.remove(res.body[0]);
			await db.remove(res.body[1]);
			await db.remove(res.body[2]);
		});
	});

	describe('POST /api/tests', () => {
		it('should return 400 if patient name is not defined ', async () => {
			const test = {
				patient: {
					id: new Date().toISOString()
				},
				doctor: {
					id: new Date().toISOString(),
					name: 'Abubakar'
				},
				tests: [ 'malaria' ]
			};
			const res = await request(server).post('/api/tests').send(test);
			expect(res.status).toBe(400);
		});
		it('should return 400 if patient id is not valid ', async () => {
			const test = {
				patient: {
					id: '1',
					name: 'fatima'
				},
				doctor: {
					id: new Date().toISOString(),
					name: 'Abubakar'
				},
				tests: [ 'malaria' ]
			};
			const res = await request(server).post('/api/tests').send(test);
			expect(res.status).toBe(400);
		});
		it('should return 400 if doctor name is not defined ', async () => {
			const test = {
				doctor: {
					id: new Date().toISOString()
				},
				patient: {
					id: new Date().toISOString(),
					name: 'Abubakar'
				},
				tests: [ 'malaria' ]
			};
			const res = await request(server).post('/api/tests').send(test);
			expect(res.status).toBe(400);
		});
		it('should return 400 if doctor id is not valid ', async () => {
			const test = {
				doctor: {
					id: '1',
					name: 'fatima'
				},
				patient: {
					id: new Date().toISOString(),
					name: 'Abubakar'
				},
				tests: [ 'malaria' ]
			};
			const res = await request(server).post('/api/tests').send(test);
			expect(res.status).toBe(400);
		});
		it('should return 400 if test is not given', async () => {
			const test = {
				patient: {
					id: new Date().toISOString(),
					name: 'fatime'
				},
				doctor: {
					id: new Date().toISOString(),
					name: 'Abubakar'
				}
			};
			const res = await request(server).post('/api/tests').send(test);
			expect(res.status).toBe(400);
		});
		it('should add a new test', async () => {
			const test = {
				patient: {
					id: new Date().toISOString(),
					name: 'fatime'
				},
				doctor: {
					id: new Date().toISOString(),
					name: 'Abubakar'
				},
				tests: [ 'malaria' ]
			};
			const res = await request(server).post('/api/tests').send(test);
			expect(res.status).toBe(201);
			expect(res.body).toBeDefined;
			expect(res.body.doctor.name).toEqual(test.doctor.name);
			await db.remove(res.body.id, res.body.rev);
		});
	});

	describe('ROUTE /api/tests/:id', () => {
		it('it should return 404 if not proper testid is provided', async () => {
			const res = await request(server).get('/api/tests/1');
			expect(res.status).toBe(404);
		});
	});

	describe('GET /api/tests/:id', () => {
		it('it should return the right test', async () => {
			const test = {
				_id: '1',
				patient: {
					id: new Date().toISOString()
				},
				doctor: {
					id: new Date().toISOString(),
					name: 'Abubakar'
				},
				tests: [ 'malaria' ],
				doctype: 'lab_tests'
			};
			await db.put(test);
			const res = await request(server).get('/api/tests/1');
			expect(res.status).toBe(200);
			expect(res.body).toBeDefined;
			expect(res.body._id).toEqual(test._id);
			expect(res.body.doctor).toMatchObject(test.doctor);
			await db.remove(res.body);
		});
	});
	describe('DELETE /api/tests/:id', () => {
		it('it should return 200 when id is correct', async () => {
			const test = {
				_id: '1',
				patient: {
					id: new Date().toISOString()
				},
				doctor: {
					id: new Date().toISOString(),
					name: 'Abubakar'
				},
				tests: [ 'malaria' ],
				doctype: 'lab_tests'
			};
			await db.put(test);
			const res = await request(server).delete('/api/tests/1');
			expect(res.status).toBe(200);
		});
	});
});
