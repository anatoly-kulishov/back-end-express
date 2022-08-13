import request from "supertest";
import {app, COURSES_URL, HTTP_STATUSES} from "../../src";

describe('/course', () => {

	beforeAll(async () => {
		await request(app).delete('/__test__/data');
	})

	it('should return 200 and empty array', async () => {
		await request(app)
			.get(COURSES_URL)
			.expect(HTTP_STATUSES.OK_200, [])
	})

	it('should return 404 for existing course', async () => {
		await request(app)
			.get(`${COURSES_URL}/1`)
			.expect(HTTP_STATUSES.NOT_FOUND_404)
	})

	it('should not create course with incorrect input data', async () => {
		await request(app)
			.post(COURSES_URL)
			.send({title: ''})
			.expect(HTTP_STATUSES.BAD_REQUEST_400)

		await request(app)
			.get(COURSES_URL)
			.expect(HTTP_STATUSES.OK_200, [])
	})

	let createdCourse1: any = null;
	it('should create course with correct input data', async () => {
		const createResponse = await request(app)
			.post(COURSES_URL)
			.send({title: 'full-stack'})
			.expect(HTTP_STATUSES.CREATED_201);

		createdCourse1 = createResponse.body;
		expect(createdCourse1).toEqual({id: expect.any(Number), title: 'full-stack'});

		await request(app)
			.get(COURSES_URL)
			.expect(HTTP_STATUSES.OK_200, [createdCourse1])
	})

	let createdCourse2: any = null;
	it('should create one more course with correct input data', async () => {
		const createResponse = await request(app)
			.post(COURSES_URL)
			.send({title: 'python'})
			.expect(HTTP_STATUSES.CREATED_201);

		createdCourse2 = createResponse.body;
		expect(createdCourse2).toEqual({id: expect.any(Number), title: 'python'});

		await request(app)
			.get(COURSES_URL)
			.expect(HTTP_STATUSES.OK_200, [createdCourse1, createdCourse2])
	})

	it('should not update course with incorrect input data', async () => {
		await request(app)
			.put(`${COURSES_URL}/${createdCourse1.id}`)
			.send({title: ''})
			.expect(HTTP_STATUSES.BAD_REQUEST_400);

		await request(app)
			.get(`${COURSES_URL}/${createdCourse1.id}`)
			.expect(HTTP_STATUSES.OK_200, createdCourse1);
	})

	it('should not update course that not exist', async () => {
		await request(app)
			.put(`${COURSES_URL}/-100`)
			.send({title: 'javascript'})
			.expect(HTTP_STATUSES.NOT_FOUND_404);
	})

	it('should update course with correct input data', async () => {
		await request(app)
			.put(`${COURSES_URL}/${createdCourse1.id}`)
			.send({title: 'typescript'})
			.expect(HTTP_STATUSES.NO_CONTENT_204);

		await request(app)
			.get(`${COURSES_URL}/${createdCourse1.id}`)
			.expect(HTTP_STATUSES.OK_200, {
				...createdCourse1,
				title: 'typescript'
			});

		await request(app)
			.get(`${COURSES_URL}/${createdCourse2.id}`)
			.expect(HTTP_STATUSES.OK_200, createdCourse2);
	})

	it('should delete both courses', async () => {
		await request(app)
			.delete(`${COURSES_URL}/${createdCourse1.id}`)
			.expect(HTTP_STATUSES.NO_CONTENT_204);

		await request(app)
			.get(`${COURSES_URL}/${createdCourse1.id}`)
			.expect(HTTP_STATUSES.NOT_FOUND_404);

		await request(app)
			.delete(`${COURSES_URL}/${createdCourse2.id}`)
			.expect(HTTP_STATUSES.NO_CONTENT_204);

		await request(app)
			.get(`${COURSES_URL}/${createdCourse2.id}`)
			.expect(HTTP_STATUSES.NOT_FOUND_404);

		await request(app)
			.get(COURSES_URL)
			.expect(HTTP_STATUSES.OK_200, []);
	})

})