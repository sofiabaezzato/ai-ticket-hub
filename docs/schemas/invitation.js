/**
 * @swagger
 * components:
 *   schemas:
 *     Invitation:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Invitation ID
 *         email:
 *           type: string
 *           format: email
 *           description: Invited user's email
 *         username:
 *           type: string
 *           nullable: true
 *           description: Suggested username for the invited user
 *         role:
 *           type: string
 *           enum: [ADMIN, TRAINER, DEVELOPER, VIEWER]
 *           description: Role to be assigned to the invited user
 *         token:
 *           type: string
 *           format: uuid
 *           description: Unique invitation token
 *         status:
 *           type: string
 *           enum: [PENDING, ACCEPTED, EXPIRED, CANCELLED]
 *           description: Current status of the invitation
 *         expiresAt:
 *           type: string
 *           format: date-time
 *           description: Invitation expiration timestamp
 *         invitedById:
 *           type: string
 *           format: uuid
 *           description: ID of the user who sent the invitation
 *         workspaceId:
 *           type: string
 *           format: uuid
 *           description: ID of the workspace the user is invited to
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Invitation creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Invitation last update timestamp
 *       example:
 *         id: "550e8400-e29b-41d4-a716-446655440002"
 *         email: "newuser@example.com"
 *         username: "new_developer"
 *         role: "DEVELOPER"
 *         token: "123e4567-e89b-12d3-a456-426614174000"
 *         status: "PENDING"
 *         expiresAt: "2024-08-06T12:00:00.000Z"
 *         invitedById: "550e8400-e29b-41d4-a716-446655440000"
 *         workspaceId: "550e8400-e29b-41d4-a716-446655440001"
 *         createdAt: "2024-08-03T12:00:00.000Z"
 *         updatedAt: "2024-08-03T12:00:00.000Z"
 *
 *     InviteUserRequest:
 *       type: object
 *       required:
 *         - email
 *         - role
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the user to invite
 *           example: "newuser@example.com"
 *         username:
 *           type: string
 *           description: Suggested username for the invited user (optional)
 *           example: "new_developer"
 *         role:
 *           type: string
 *           enum: [ADMIN, TRAINER, DEVELOPER, VIEWER]
 *           description: Role to assign to the invited user
 *           example: "DEVELOPER"
 *
 *     InviteUserResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Success message
 *           example: "Invitation created"
 *         invite:
 *           $ref: '#/components/schemas/Invitation'
 *
 *     AcceptInviteRequest:
 *       type: object
 *       required:
 *         - invitationToken
 *         - password
 *       properties:
 *         invitationToken:
 *           type: string
 *           format: uuid
 *           description: Unique invitation token received via email
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         password:
 *           type: string
 *           description: Password for the new user account
 *           minLength: 6
 *           example: "securePassword123"
 *
 *     AcceptInviteResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: JWT authentication token for the new user
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               description: New user's ID
 *               example: "550e8400-e29b-41d4-a716-446655440003"
 *             email:
 *               type: string
 *               format: email
 *               description: New user's email
 *               example: "newuser@example.com"
 *             role:
 *               type: string
 *               enum: [ADMIN, TRAINER, DEVELOPER, VIEWER]
 *               description: New user's role
 *               example: "DEVELOPER"
 */