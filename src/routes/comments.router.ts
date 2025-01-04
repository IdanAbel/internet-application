import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { commentsController } from '../controllers/comments/comments.controller';

/**
 * @swagger
 * tags:
 *      name: Comments
 *      description: The Comments API
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
 *          Comment:
 *              type: object
 *              required:
 *                  - comment
 *                  - postId
 *              properties:
 *                  comment:
 *                      type: string
 *                      description: The comment message
 *                  postId:
 *                      type: string
 *                      description: The postId of the comment
 *                  owner:
 *                      type: string
 *                      description: The ownerId of the comment
 *              example:
 *                  comment: "Roy's Comment"
 *                  postId: '6776fa595cec7491a6e983f2'
 *                  owner: '67791c50b619529fb3878f1e'
 */

export const commentsRouter = Router();

/**
 * @swagger
 *      /comments:
 *          get:
 *              summary: retrieve a list of comments
 *              tags: [Comments]
 *              responses:
 *                  200:
 *                      description: A list of comments
 *                      content:
 *                          application/json:
 *                              schema:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#/components/schemas/Comment'
 *                  400:
 *                      description: Bad request
 */
commentsRouter.get('/', commentsController.getAll.bind(commentsController));

/**
 * @swagger
 *      /comments/{commentId}:
 *          get:
 *              summary: gets a comment by id
 *              tags: [Comments]
 *              parameters:
 *                  - in: path
 *                    name: commentId
 *                    schema:
 *                        type: string
 *                    required: true
 *                    description: The id of the comment
 *              responses:
 *                  200:
 *                      description: A comment
 *                      content:
 *                          application/json:
 *                              schema:
 *                                  $ref: '#/components/schemas/Comment'
 *                  400:
 *                      description: Bad request
 *                  404:
 *                      description: Not Found
 */
commentsRouter.get('/:id', commentsController.getById.bind(commentsController));

/**
 * @swagger
 *      /comments:
 *          post:
 *              summary: creates a new comment
 *              tags: [Comments]
 *              description: need to provide the refresh token in the auth header
 *              security:
 *                  - bearerAuth: []
 *              requestBody:
 *                  required: true
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Comment'
 *              responses:
 *                  201:
 *                      description: Created
 *                      content:
 *                          application/json:
 *                              schema:
 *                                  $ref: '#/components/schemas/Comment'
 *                  400:
 *                      description: Bad request
 *                  401:
 *                      description: Unauthorized
 */
commentsRouter.post('/', authMiddleware, commentsController.create.bind(commentsController));

/**
 * @swagger
 *      /comments/{commentId}:
 *          delete:
 *              summary: deletes a comment
 *              tags: [Comments]
 *              parameters:
 *                  - in: path
 *                    name: commentId
 *                    schema:
 *                        type: string
 *                    required: true
 *                    description: The id of the comment
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
commentsRouter.delete('/:id', authMiddleware, commentsController.deleteItem.bind(commentsController));
