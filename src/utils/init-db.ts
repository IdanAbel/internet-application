import mongoose from 'mongoose';

export const initDb = async () => {
    const dbUri: string | undefined = process.env.DB_CONNECT;

    if (!dbUri) {
        throw new Error('DB_CONNECT is not defined in .env file');
    }

    mongoose.connection
        .on('connecting', () => console.log('Connection to db...'))
        .on('connected', () => console.log('Connected to db successfully!'))
        .on('error', () => {
            throw new Error('Cannot connect to DB!');
        });

    await mongoose.connect(dbUri);
};
