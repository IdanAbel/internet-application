import '../../server';
import supertest from 'supertest';
import { app } from '../../app';
import { Comment, CommentModel } from '../../models/comment.model';
import { UserModel } from '../../models/user.model';
import { initDb } from '../../utils/init-db';
import { postMock1, userMock1 } from '../../utils/mocks';
import mongoose from 'mongoose';
import { PostModel } from '../../models/post.model';

describe('/comments - Comments Controller', () => {
    let refreshToken: string;
    let userId: string;
    let postId: string;
    let commentMock: Omit<Comment, 'owner'>;
    const fakeId: string = '67791c50b619529fb3878f1e';

    beforeAll(async () => {
        await initDb();
        await UserModel.deleteMany();
        await PostModel.deleteMany();
        await CommentModel.deleteMany();

        await supertest(app).post('/auth/register').send(userMock1);
        const loginResponse = await supertest(app).post('/auth/login').send(userMock1);
        refreshToken = loginResponse.body.refreshToken;
        userId = loginResponse.body._id;

        const createPostResponse = await supertest(app)
            .post('/posts')
            .set('Authorization', `JWT ${refreshToken}`)
            .send(postMock1);
        postId = createPostResponse.body._id;

        commentMock = {
            comment: 'Mock Comment',
            postId,
        };
    });

    afterAll(async () => {
        await UserModel.deleteMany();
        await CommentModel.deleteMany();
        await mongoose.connection.close();
    });

    describe('POST /comments', () => {
        const createCommentRoute = '/comments';

        it('should create a new comment', async () => {
            const response = await supertest(app)
                .post(createCommentRoute)
                .set('Authorization', `JWT ${refreshToken}`)
                .send(commentMock);
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('_id');
            expect(response.body).toHaveProperty('owner');
            expect(response.body.owner).toBe(userId);
        });

        it('should fail to create a new comment with invalid token', async () => {
            const response = await supertest(app)
                .post(createCommentRoute)
                .set('Authorization', `JWT invalidToken`)
                .send(postMock1);
            expect(response.status).toBe(401);
        });

        it('should fail to create a comment with missing fields', async () => {
            const response = await supertest(app)
                .post(createCommentRoute)
                .set('Authorization', `JWT ${refreshToken}`)
                .send({});
            expect(response.status).toBe(400);
        });

        it('should fail to create a new comment without header', async () => {
            const response = await supertest(app).post(createCommentRoute).send(postMock1);
            expect(response.status).toBe(400);
        });
    });

    describe('GET /comments', () => {
        const getAllCommentRoute = '/comments';

        it('should get all comments', async () => {
            const response = await supertest(app).get(getAllCommentRoute);
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
        });

        it('should get comments filtered by owner', async () => {
            const response = await supertest(app).get(`${getAllCommentRoute}?owner=${userId}`);
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body[0]).toHaveProperty('owner', userId);
        });

        it('should return error', async () => {
            jest.spyOn(CommentModel, 'find').mockImplementationOnce(() => {
                throw new Error('Fake Error');
            });

            const response = await supertest(app).get(getAllCommentRoute);
            expect(response.status).toBe(400);
        });
    });

    describe('GET /comments/:id', () => {
        let commentId: string;

        beforeAll(async () => {
            const response = await supertest(app)
                .post('/comments')
                .set('Authorization', `JWT ${refreshToken}`)
                .send(commentMock);
            commentId = response.body._id;
        });

        it('should get a comment by id', async () => {
            const response = await supertest(app).get(`/comments/${commentId}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('_id', commentId);
        });

        it('should return 404 for non-existing comment', async () => {
            const response = await supertest(app).get(`/comments/${fakeId}`);
            expect(response.status).toBe(404);
        });

        it('should throw error for a non ObjectId request params', async () => {
            const response = await supertest(app).get(`/comments/1`);
            expect(response.status).toBe(400);
        });
    });

    describe('DELETE /comments/:id', () => {
        let commentId: string;

        beforeAll(async () => {
            const response = await supertest(app)
                .post('/comments')
                .set('Authorization', `JWT ${refreshToken}`)
                .send(commentMock);
            commentId = response.body._id;
        });

        it('should fail to delete a comment by id with invalid token', async () => {
            const response = await supertest(app).delete(`/comments/${commentId}`).set('Authorization', `JWT invalidToken`);
            expect(response.status).toBe(401);
        });

        it('should fail to delete a comment by id without header', async () => {
            const response = await supertest(app).delete(`/comments/${commentId}`);
            expect(response.status).toBe(400);
        });

        it('should delete a comment by id', async () => {
            const response = await supertest(app)
                .delete(`/comments/${commentId}`)
                .set('Authorization', `JWT ${refreshToken}`);
            expect(response.status).toBe(204);
        });

        it('should return 404 for non-existing comment', async () => {
            const response = await supertest(app)
                .delete(`/comments/${fakeId}`)
                .set('Authorization', `JWT ${refreshToken}`);
            expect(response.status).toBe(404);
        });

        it('should throw error for a non ObjectId request params', async () => {
            const response = await supertest(app).delete(`/comments/1`).set('Authorization', `JWT ${refreshToken}`);
            expect(response.status).toBe(400);
        });
    });
});
