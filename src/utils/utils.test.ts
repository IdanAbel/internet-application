import 'dotenv/config';
import { verifyDotEnv } from './verify-dotenv';
import mongoose from 'mongoose';
import { initDb } from './init-db';

describe('Utils Functions', () => {
    let originalEnv: NodeJS.ProcessEnv;

    beforeAll(() => {
        originalEnv = { ...process.env };
    });

    afterEach(() => {
        process.env = { ...originalEnv };
    });

    describe('verifyDotEnv', () => {
        afterEach(() => {
            process.env = { ...originalEnv };
        });

        it('should throw error when TOKEN_SECRET is undefined', () => {
            delete process.env.TOKEN_SECRET;
            expect(() => verifyDotEnv()).toThrowError('Missing TOKEN_SECRET!');
        });

        it('should throw error when DB_CONNECT is undefined', () => {
            delete process.env.DB_CONNECT;
            expect(() => verifyDotEnv()).toThrowError('Missing DB_CONNECT!');
        });

        it('should throw error when REFRESH_TOKEN_EXPIRES is undefined', () => {
            delete process.env.REFRESH_TOKEN_EXPIRES;
            expect(() => verifyDotEnv()).toThrowError('Missing REFRESH_TOKEN_EXPIRES!');
        });

        it('should throw error when PORT is undefined', () => {
            delete process.env.PORT;
            expect(() => verifyDotEnv()).toThrowError('Missing PORT!');
        });

        it('should not throw error when all environment variables are defined', () => {
            process.env.TOKEN_SECRET = 'test_token_secret';
            process.env.DB_CONNECT = 'test_db_connect';
            process.env.REFRESH_TOKEN_EXPIRES = 'test_refresh_token_expires';
            process.env.REFRESH_TOKEN_EXPIRES = 'test_port';
            expect(() => verifyDotEnv()).not.toThrow();
        });
    });

    describe('initDb', () => {
        it('should connect to the database successfully', async () => {
            const connectSpy = jest.spyOn(mongoose, 'connect').mockResolvedValueOnce(mongoose);
            const onSpy = jest.spyOn(mongoose.connection, 'on');

            await initDb();

            expect(connectSpy).toHaveBeenCalledWith(process.env.DB_CONNECT);
            expect(onSpy).toHaveBeenCalledWith('connecting', expect.any(Function));
            expect(onSpy).toHaveBeenCalledWith('connected', expect.any(Function));
            expect(onSpy).toHaveBeenCalledWith('error', expect.any(Function));

            connectSpy.mockRestore();
            onSpy.mockRestore();
        });

        it('should throw an error if connection fails', async () => {
            const connectSpy = jest
                .spyOn(mongoose, 'connect')
                .mockImplementationOnce(() => {
                    mongoose.connection.emit('error', new Error('Cannot connect to DB!'));
                    return Promise.reject(new Error('Cannot connect to DB!'));
                });

            await expect(initDb()).rejects.toThrow('Cannot connect to DB!');

            connectSpy.mockRestore();
        });
    });
});
