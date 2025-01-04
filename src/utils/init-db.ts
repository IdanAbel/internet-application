import mongoose from 'mongoose';

export const initDb = async () => {
    mongoose.connection
        .on('connecting', () => console.log('Connection to db...'))
        .on('connected', () => console.log('Connected to db successfully!'))
        .on('error', () => {
            throw new Error('Cannot connect to DB!');
        });

    await mongoose.connect(process.env.DB_CONNECT!);
};
