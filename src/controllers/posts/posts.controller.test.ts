import '../../server';
import { PostModel } from '../../models/post.model';
import mongoose, { Types } from 'mongoose';
import supertest from 'supertest';
import { app } from '../../app';
import { postMock1, userMock1 } from '../../utils/mocks';
import { UserModel } from '../../models/user.model';

describe('/posts - Posts Controller', () => {
    let userId: Types.ObjectId;
    let refreshToken: string;
    const fakeId: string = '67791c50b619529fb3878f1e';

    beforeAll(async () => {
        await UserModel.deleteMany();
        await PostModel.deleteMany();
        const registerResponse = await supertest(app).post('/auth/register').send(userMock1);
        const loginResponse = await supertest(app).post('/auth/login').send(userMock1);
        userId = registerResponse.body._id;
        refreshToken = loginResponse.body.refreshToken;
    });

    afterAll(async () => {
        await PostModel.deleteMany();
        await UserModel.deleteMany();
        await mongoose.connection.close();
    });

    describe('POST /posts', () => {
        const createPostRoute = '/posts';

        it('should create a new post', async () => {
            const response = await supertest(app)
                .post(createPostRoute)
                .set('Authorization', `JWT ${refreshToken}`)
                .send(postMock1);
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('_id');
        });

        it('should fail to create a new post with invalid token', async () => {
            const response = await supertest(app)
                .post(createPostRoute)
                .set('Authorization', `JWT invalidToken`)
                .send(postMock1);
            expect(response.status).toBe(401);
        });

        it('should fail to create a post with missing fields', async () => {
            const response = await supertest(app)
                .post(createPostRoute)
                .set('Authorization', `JWT ${refreshToken}`)
                .send({});
            expect(response.status).toBe(400);
        });

        it('should fail to create a new post without header', async () => {
            const response = await supertest(app).post(createPostRoute).send(postMock1);
            expect(response.status).toBe(400);
        });
    });

    describe('GET /posts', () => {
        const getAllRoute = '/posts';

        it('should get all posts', async () => {
            const response = await supertest(app).get(getAllRoute);
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
        });

        it('should get posts filtered by owner', async () => {
            const response = await supertest(app).get(`${getAllRoute}?owner=${userId}`);
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body[0]).toHaveProperty('owner', userId);
        });

        it('should return error', async () => {
            jest.spyOn(PostModel, 'find').mockImplementationOnce(() => {
                throw new Error('Fake Error');
            });

            const response = await supertest(app).get(getAllRoute);
            expect(response.status).toBe(400);
        });
    });

    describe('GET /posts/:id', () => {
        let postId: string;

        beforeAll(async () => {
            const response = await supertest(app)
                .post('/posts')
                .set('Authorization', `JWT ${refreshToken}`)
                .send(postMock1);
            postId = response.body._id;
        });

        it('should get a post by id', async () => {
            const response = await supertest(app).get(`/posts/${postId}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('_id', postId);
        });

        it('should return 404 for non-existing post', async () => {
            const response = await supertest(app).get(`/posts/${fakeId}`);
            expect(response.status).toBe(404);
        });

        it('should throw error for a non ObjectId request params', async () => {
            const response = await supertest(app).get(`/posts/1`);
            expect(response.status).toBe(400);
        });
    });

    describe('DELETE /posts/:id', () => {
        let postId: string;

        beforeAll(async () => {
            const response = await supertest(app)
                .post('/posts')
                .set('Authorization', `JWT ${refreshToken}`)
                .send(postMock1);
            postId = response.body._id;
        });

        it('should fail to delete a post by id with invalid token', async () => {
            const response = await supertest(app).delete(`/posts/${postId}`).set('Authorization', `JWT invalidToken`);
            expect(response.status).toBe(401);
        });

        it('should fail to delete a post by id without header', async () => {
            const response = await supertest(app).delete(`/posts/${postId}`);
            expect(response.status).toBe(400);
        });

        it('should delete a post by id', async () => {
            const response = await supertest(app)
                .delete(`/posts/${postId}`)
                .set('Authorization', `JWT ${refreshToken}`);
            expect(response.status).toBe(204);
        });

        it('should return 404 for non-existing post', async () => {
            const response = await supertest(app)
                .delete(`/posts/${fakeId}`)
                .set('Authorization', `JWT ${refreshToken}`);
            expect(response.status).toBe(404);
        });

        it('should throw error for a non ObjectId request params', async () => {
            const response = await supertest(app).delete(`/posts/1`).set('Authorization', `JWT ${refreshToken}`);
            expect(response.status).toBe(400);
        });
    });
});
