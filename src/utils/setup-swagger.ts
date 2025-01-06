import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import { Request, Response } from 'express';
import { app } from '../app';

export const setupSwagger = () => {
    if (process.env.NODE_ENV == 'development') {
        const options: swaggerJsDoc.Options = {
            definition: {
                openapi: '3.0.0',
                info: {
                    title: 'Web Dev 2025 REST API',
                    version: '1.0.0',
                    description: 'REST server including authentication using JWT',
                },
                servers: [{ url: `http://localhost:${process.env.PORT}` }],
            },
            apis: ['./src/routes/*.router.ts'],
        };
        const specs = swaggerJsDoc(options);
        app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

        app.get('/docs.json', (req: Request, res: Response) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(specs);
        });
    }
};
