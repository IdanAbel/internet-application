import { Router } from 'express';
import authController from '../controllers/auth/auth.controller';

/**
 * @swagger
 * tags:
 *      name: Auth
 *      description: The Authentication API
 */

/**
 * @swagger
 * components:
 *      securitySchemes:
 *          bearerAuth:
 *              type: http
 *              scheme: bearer
 *              bearerFormat: JWT
 */

/**
 * @swagger
 * components:
 *      schemas:
 *          User:
 *              type: object
 *              required:
 *                  - username
 *                  - email
 *                  - password
 *              properties:
 *                  username:
 *                      type: string
 *                      description: The user username
 *                  email:
 *                      type: string
 *                      description: The user email
 *                  password:
 *                      type: string
 *                      description: The user password
 *              example:
 *                  username: 'Roy'
 *                  email: 'example@gmail.com'
 *                  password: '123456'
 */

/**
 * @swagger
 *      components:
 *          schemas:
 *              Tokens:
 *                  type: object
 *                  required:
 *                      - accessToken
 *                      - refreshToken
 *                  properties:
 *                      accessToken:
 *                          type: string
 *                          description: The JWT access token
 *                      refreshToken:
 *                          type: string
 *                          description: The JWT refresh token
 *                  example:
 *                      accessToken: '123cd123x1xx1'
 *                      refreshToken: '134r2134cr1x3c'
 */

export const authRouter = Router();

/**
 * @swagger
 *      /auth/register:
 *           post:
 *               summary: registers a new user
 *               tags: [Auth]
 *               requestBody:
 *                   required: true
 *                   content:
 *                       application/json:
 *                           schema:
 *                               $ref: '#/components/schemas/User'
 *               responses:
 *                   200:
 *                       description: The new user
 *                       content:
 *                           application/json:
 *                               schema:
 *                                   $ref: '#/components/schemas/User'
 *                   400:
 *                       description: Bad Input
 */
authRouter.post('/register', authController.register);

/**
 * @swagger
 *      /auth/login:
 *          post:
 *              summary: logs in the user
 *              tags: [Auth]
 *              requestBody:
 *                  required: true
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/User'
 *              responses:
 *                  200:
 *                      description: The access & refresh tokens
 *                      content:
 *                          application/json:
 *                              schema:
 *                                  $ref: '#/components/schemas/Tokens'
 *                  400:
 *                      description: Bad Input
 */
authRouter.post('/login', authController.login);

/**
 * @swagger
 *      /auth/logout:
 *          post:
 *              summary: logout a user
 *              tags: [Auth]
 *              description: need to provide the refresh token in the body
 *              requestBody:
 *                  required: true
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              required:
 *                                  - refreshToken
 *                              properties:
 *                                  refreshToken: string
 *                              example:
 *                                  refreshToken: '134r2134cr1x3c'
 *              responses:
 *                  200:
 *                      description: logout completed successfully
 *                  400:
 *                      description: Bad Input
 */
authRouter.post('/logout', authController.logout);

/**
 * @swagger
 *      /auth/refresh:
 *          post:
 *              summary: get a new refresh token using the refresh token
 *              tags: [Auth]
 *              description: need to provide the refresh token in the body
 *              requestBody:
 *                  required: true
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              required:
 *                                  - refreshToken
 *                              properties:
 *                                  refreshToken: string
 *                              example:
 *                                  refreshToken: '134r2134cr1x3c'
 *              responses:
 *                  200:
 *                      description: The new refresh token
 *                      content:
 *                          application/json:
 *                              schema:
 *                                  $ref: '#/components/schemas/Tokens'
 *                  400:
 *                      description: Bad Input
 */
authRouter.post('/refresh', authController.refresh);
