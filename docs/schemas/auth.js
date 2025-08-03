/**
 * @swagger
 * components:
 *   schemas:
 *     SignupRequest:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *         - workspaceName
 *       properties:
 *         username:
 *           type: string
 *           description: Desired username
 *           minLength: 1
 *           example: "admin_user"
 *         email:
 *           type: string
 *           format: email
 *           description: User email address
 *           example: "admin@example.com"
 *         password:
 *           type: string
 *           description: User password
 *           minLength: 6
 *           example: "securePassword123"
 *         workspaceName:
 *           type: string
 *           description: Name of the workspace to create
 *           minLength: 1
 *           example: "My Company"
 *         workspaceDomain:
 *           type: string
 *           description: Custom domain for the workspace (optional, will be auto-generated if not provided)
 *           example: "my-company"
 *
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User email address
 *           example: "admin@example.com"
 *         password:
 *           type: string
 *           description: User password
 *           example: "securePassword123"
 *
 *     SignupResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Success message
 *           example: "Workspace and admin user created successfully"
 *         token:
 *           type: string
 *           description: JWT authentication token
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               example: "550e8400-e29b-41d4-a716-446655440000"
 *             email:
 *               type: string
 *               format: email
 *               example: "admin@example.com"
 *             username:
 *               type: string
 *               example: "admin_user"
 *             role:
 *               $ref: '#/components/schemas/UserRole'
 *               example: "ADMIN"
 *         workspace:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               example: "550e8400-e29b-41d4-a716-446655440001"
 *             name:
 *               type: string
 *               example: "My Company"
 *             domain:
 *               type: string
 *               example: "my-company"
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: JWT authentication token
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               example: "550e8400-e29b-41d4-a716-446655440000"
 *             email:
 *               type: string
 *               format: email
 *               example: "admin@example.com"
 *             role:
 *               $ref: '#/components/schemas/UserRole'
 *               example: "ADMIN"
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *       examples:
 *         missing_fields:
 *           summary: Missing required fields
 *           value:
 *             message: "Missing required fields"
 *         workspace_exists:
 *           summary: Workspace domain already exists
 *           value:
 *             message: "Workspace domain already in use"
 *         email_exists:
 *           summary: Email already registered
 *           value:
 *             message: "Email already in use"
 *         user_not_found:
 *           summary: User not found
 *           value:
 *             message: "User not found"
 *         invalid_password:
 *           summary: Invalid password
 *           value:
 *             message: "Invalid password"
 *         server_error:
 *           summary: Internal server error
 *           value:
 *             message: "Internal server error"
 *         admin_only:
 *           summary: Admin access required
 *           value:
 *             message: "Admin only"
 */