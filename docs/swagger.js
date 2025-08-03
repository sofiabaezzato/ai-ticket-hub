import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'AI Ticket Hub API',
            version: '0.0.0',
            description: 'API for AI Ticket Hub workspace and user management',
        },
    },
    servers: [
        {
            url: 'http://localhost:5500',
            description: 'Development server'
        },
        {
            // url: 'https://your-production-domain.com',
            // description: 'Production server'
        }
    ],
    apis: [
        './routes/**/*.js',
        './docs/schemas/**/*.js',
        './docs/tags.js',
        ],
};

const specs = swaggerJsDoc(options);

export function setupSwagger(app) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}
