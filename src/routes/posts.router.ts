import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { postController } from '../controllers/posts/posts.controller';

/**
 * @swagger
 * tags:
 *      name: Posts
 *      description: The Posts API
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
 *          Post:
 *              type: object
 *              required:
 *                  - title
 *              properties:
 *                  title:
 *                      type: string
 *                      description: The title of the post
 *                  content:
 *                      type: string
 *                      description: The content of the post
 *                  owner:
 *                      type: string
 *                      description: The ownerId of the post
 *              example:
 *                  title: "Roy's Post"
 *                  content: "This is a post by Roy"
 *                  owner: '67791c50b619529fb3878f1e'
 */

export const postsRouter = Router();

/**
 * @swagger
 *      /posts:
 *          get:
 *              summary: retrieve a list of posts
 *              tags: [Posts]
 *              responses:
 *                  200:
 *                      description: A list of posts
 *                      content:
 *                          application/json:
 *                              schema:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#/components/schemas/Post'
 *                  400:
 *                      description: Bad request
 */
postsRouter.get('/', postController.getAll.bind(postController));

/**
 * @swagger
 *      /posts/{postId}:
 *          get:
 *              summary: gets a post by id
 *              tags: [Posts]
 *              parameters:
 *                  - in: path
 *                    name: postId
 *                    schema:
 *                        type: string
 *                    required: true
 *                    description: The id of the post
 *              responses:
 *                  200:
 *                      description: A post
 *                      content:
 *                          application/json:
 *                              schema:
 *                                  $ref: '#/components/schemas/Post'
 *                  400:
 *                      description: Bad request
 *                  404:
 *                      description: Not Found
 */
postsRouter.get('/:id', postController.getById.bind(postController));

/**
 * @swagger
 *      /posts:
 *          post:
 *              summary: creates a new post
 *              tags: [Posts]
 *              description: need to provide the refresh token in the auth header
 *              security:
 *                  - bearerAuth: []
 *              requestBody:
 *                  required: true
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Post'
 *              responses:
 *                  201:
 *                      description: Created
 *                      content:
 *                          application/json:
 *                              schema:
 *                                  $ref: '#/components/schemas/Post'
 *                  400:
 *                      description: Bad request
 *                  401:
 *                      description: Unauthorized
 */
postsRouter.post('/', authMiddleware, postController.create.bind(postController));

/**
 * @swagger
 *      /posts/{postId}:
 *          delete:
 *              summary: deletes a new post
 *              tags: [Posts]
 *              parameters:
 *                  - in: path
 *                    name: postId
 *                    schema:
 *                        type: string
 *                    required: true
 *                    description: The id of the post
 *              description: need to provide the refresh token in the auth header
 *              security:
 *                  - bearerAuth: []
 *              responses:
 *                  204:
 *                      description: Deleted
 *                  400:
 *                      description: Bad request
 *                  401:
 *                      description: Unauthorized
 *                  404:
 *                      description: Not Found
 */
postsRouter.delete('/:id', authMiddleware, postController.deleteItem.bind(postController));
