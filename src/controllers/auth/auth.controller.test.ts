import '../../server';
import supertest from 'supertest';
import { app } from '../../app';
import { UserModel } from '../../models/user.model';
import { initDb } from '../../utils/init-db';
import { userMock1, userMock2 } from '../../utils/mocks';
import mongoose from 'mongoose';

describe('/auth - Auth Controller', () => {
    let refreshToken: string;

    beforeAll(async () => {
        await initDb();
        await UserModel.deleteMany();
    });

    afterAll(async () => {
        await UserModel.deleteMany();
        await mongoose.connection.close();
    });

    describe('POST /auth/register', () => {
        const registerRoute = '/auth/register';
        it('should register a new user', async () => {
            const response = await supertest(app).post(registerRoute).send(userMock1);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('_id');
        });

        it('should fail to register with existing username', async () => {
            const response = await supertest(app).post(registerRoute).send(userMock1);
            expect(response.status).toBe(400);
        });

        it('should fail to register with missing fields', async () => {
            const response = await supertest(app).post(registerRoute).send({ username: userMock2 });
            expect(response.status).toBe(400);
        });
    });

    describe('POST /auth/login', () => {
        const loginRoute = '/auth/login';

        it('should login an existing user', async () => {
            const response = await supertest(app).post(loginRoute).send(userMock1);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('accessToken');
            expect(response.body).toHaveProperty('refreshToken');
            refreshToken = response.body.refreshToken;
        });

        it('should fail to login with non existing username', async () => {
            const response = await supertest(app).post(loginRoute).send(userMock2);
            expect(response.status).toBe(400);
        });

        it('should fail to login with wrong password ', async () => {
            const response = await supertest(app)
                .post(loginRoute)
                .send({ ...userMock1, password: 'pass' });
            expect(response.status).toBe(400);
        });

        it('should return error and send status 400', async () => {
            jest.spyOn(UserModel, 'findOne').mockImplementationOnce(() => {
                throw new Error('Fake Error');
            });

            const response = await supertest(app).post(loginRoute).send(userMock1);
            expect(response.status).toBe(400);
        });
    });

    describe('POST /refresh', () => {
        const refreshRoute = '/auth/refresh';
        it('should refresh tokens', async () => {
            const response = await supertest(app).post(refreshRoute).send({ refreshToken });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('accessToken');
            expect(response.body).toHaveProperty('refreshToken');
            refreshToken = response.body.refreshToken;
        });

        it('should fail to refresh with invalid token', async () => {
            const response = await supertest(app).post(refreshRoute).send({
                refreshToken: 'invalidtoken',
            });
            expect(response.status).toBe(400);
        });
    });

    describe('POST /auth/logout', () => {
        const logoutRoute = '/auth/logout';
        it('should logout the user', async () => {
            const response = await supertest(app).post(logoutRoute).send({ refreshToken });
            expect(response.status).toBe(200);
        });

        it('should fail to logout the user with the same token twice', async () => {
            const response = await supertest(app).post(logoutRoute).send({ refreshToken });
            expect(response.status).toBe(400);
        });

        it('should fail to logout with invalid token', async () => {
            const response = await supertest(app).post(logoutRoute).send({
                refreshToken: 'invalidtoken',
            });
            expect(response.status).toBe(400);
        });

        it('should fail to logout without token', async () => {
            const response = await supertest(app).post(logoutRoute).send();
            expect(response.status).toBe(400);
        });

        it('should fail to logout a deleted user', async () => {
            await UserModel.deleteMany();
            const response = await supertest(app).post(logoutRoute).send({ refreshToken });
            expect(response.status).toBe(400);
        });

        it('should return error and send status 400', async () => {
            jest.spyOn(UserModel, 'findOne').mockImplementationOnce(() => {
                throw new Error('Fake Error');
            });

            const response = await supertest(app).post(logoutRoute).send({ refreshToken });
            expect(response.status).toBe(400);
        });
    });
});
