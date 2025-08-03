import express from 'express';
import {login, signup} from "../../services/authService.js";

const authRoutes = express.Router();

/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     summary: Create a new workspace and admin user
 *     description: |
 *       Register a new workspace with an admin user. This endpoint creates both a workspace and the first admin user for that workspace in a single transaction.
 *
 *       **Features:**
 *       - Creates a new workspace with a unique domain
 *       - Creates an admin user for the workspace
 *       - Auto-generates domain if not provided (using timestamp)
 *       - Validates email uniqueness across all workspaces
 *       - Returns JWT token for immediate authentication
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupRequest'
 *           examples:
 *             with_custom_domain:
 *               summary: Signup with custom domain
 *               value:
 *                 username: "john_admin"
 *                 email: "john@mycompany.com"
 *                 password: "securePassword123"
 *                 workspaceName: "My Company Inc"
 *                 workspaceDomain: "my-company"
 *             auto_generated_domain:
 *               summary: Signup with auto-generated domain
 *               value:
 *                 username: "jane_admin"
 *                 email: "jane@startup.com"
 *                 password: "anotherSecurePass456"
 *                 workspaceName: "Startup Corp"
 *     responses:
 *       201:
 *         description: Workspace and admin user created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SignupResponse'
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Missing required fields"
 *       409:
 *         description: Workspace domain or email already in use
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               workspace_exists:
 *                 summary: Workspace domain already exists
 *                 value:
 *                   message: "Workspace domain already in use"
 *               email_exists:
 *                 summary: Email already registered
 *                 value:
 *                   message: "Email already in use"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Internal server error"
 */
authRoutes.post('/signup', signup);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Authenticate user and get access token
 *     description: |
 *       Login with email and password to receive a JWT token for authenticated requests.
 *
 *       **Features:**
 *       - Validates user credentials using bcrypt
 *       - Returns JWT token for API authentication
 *       - Works for users with any role (ADMIN, TRAINER, DEVELOPER, VIEWER)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           examples:
 *             admin_login:
 *               summary: Admin user login
 *               value:
 *                 email: "john@mycompany.com"
 *                 password: "securePassword123"
 *             developer_login:
 *               summary: Developer user login
 *               value:
 *                 email: "dev@company.com"
 *                 password: "devPassword456"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "User not found"
 *       401:
 *         description: Invalid password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Invalid password"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Internal server error"
 */
authRoutes.post('/login', login);

export default authRoutes;
