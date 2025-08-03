/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: User ID
 *         username:
 *           type: string
 *           description: Username
 *         email:
 *           type: string
 *           format: email
 *           description: User email address
 *         role:
 *           type: string
 *           enum: [ADMIN, TRAINER, DEVELOPER, VIEWER]
 *           description: User role
 *         telegramId:
 *           type: string
 *           nullable: true
 *           description: Optional Telegram ID
 *         workspaceId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: Associated workspace ID
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: User creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: User last update timestamp
 *       example:
 *         id: "550e8400-e29b-41d4-a716-446655440000"
 *         username: "admin_user"
 *         email: "admin@example.com"
 *         role: "ADMIN"
 *         telegramId: null
 *         workspaceId: "550e8400-e29b-41d4-a716-446655440001"
 *         createdAt: "2024-01-01T12:00:00.000Z"
 *         updatedAt: "2024-01-01T12:00:00.000Z"
 *
 *     UserRole:
 *       type: string
 *       enum: [ADMIN, TRAINER, DEVELOPER, VIEWER]
 *       description: Available user roles
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: Enter JWT token received from login endpoint
 */