import swaggerUi from "swagger-ui-express";

export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Job Portal API",
    version: "1.0.0",
    description: "Backend API for Job Portal",
  },

  servers: [
    {
      url: "http://localhost:3001/api/v1",
    },
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },

  security: [
    {
      bearerAuth: [],
    },
  ],
};

export { swaggerUi };
