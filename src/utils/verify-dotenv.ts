export const verifyDotEnv = () => {
    if (!process.env.TOKEN_SECRET) {
        throw new Error('Missing TOKEN_SECRET!');
    }

    if (!process.env.DB_CONNECT) {
        throw new Error('Missing DB_CONNECT!');
    }

    if (!process.env.REFRESH_TOKEN_EXPIRES) {
        throw new Error('Missing REFRESH_TOKEN_EXPIRES!');
    }
};
