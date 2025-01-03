import 'dotenv/config';
import { initDb } from './utils/init-db';
import { app } from './app';

process.on('unhandledRejection', (reason) => {
    console.log('An unhandled promise rejection occurred!', { reason });
    process.exit(1);
});

process.on('uncaughtException', (error: Error) => {
    console.log('An uncaught exception occurred!', { error: error.message });
    process.exit(1);
});

(async () => {
    await initDb();
    const port: number = Number(process.env.PORT) || 3000;
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
})();
