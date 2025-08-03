/**
 * @swagger
 * components:
 *   schemas:
 *     Workspace:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Workspace ID
 *         name:
 *           type: string
 *           description: Workspace name
 *         domain:
 *           type: string
 *           nullable: true
 *           description: Unique workspace domain
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Workspace creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Workspace last update timestamp
 *       example:
 *         id: "550e8400-e29b-41d4-a716-446655440001"
 *         name: "My Company"
 *         domain: "my-company"
 *         createdAt: "2024-01-01T12:00:00.000Z"
 *         updatedAt: "2024-01-01T12:00:00.000Z"
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: Enter JWT token received from login endpoint
 */