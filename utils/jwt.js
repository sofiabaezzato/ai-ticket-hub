import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret'; // set in .env

export function generateToken(user) {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role,
            workspaceId: user.workspaceId,
        },
        JWT_SECRET,
        { expiresIn: '1h' }
    );
}

export function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}
