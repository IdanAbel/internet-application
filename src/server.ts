import 'dotenv/config';
import { initDb } from './utils/init-db';
import { app } from './app';
import { verifyDotEnv } from './utils/verify-dotenv';
import { setupSwagger } from './utils/setup-swagger';

(async () => {
    verifyDotEnv();

    await initDb();
    const port: number = Number(process.env.PORT);
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
        setupSwagger();
    });
})();
