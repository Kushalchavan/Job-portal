import swaggerUi from "swagger-ui-express";

export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "AI Recruiting Platform API",
    version: "1.0.0",
    description:
      "An AI-powered recruiting platform built with Node.js, TypeScript, PostgreSQL, Prisma, Redis, BullMQ, Docker and JWT authentication.",
  },

  tags: [
    {
      name: "Auth",
      description: "Authentication APIs",
    },
    {
      name: "Company",
      description: "Company management APIs",
    },
    {
      name: "Jobs",
      description: "Job management APIs",
    },
    {
      name: "Applications",
      description: "Job application APIs",
    },
    {
      name: "Saved Jobs",
      description: "Saved jobs APIs",
    },
    {
      name: "Resume",
      description: "Resume management APIs",
    },
    {
      name: "Matching",
      description: "AI candidate matching APIs",
    },
    {
      name: "Notifications",
      description: "Notification APIs",
    },
    {
      name: "Dashboard",
      description: "Dashboard APIs",
    },
    {
      name: "Analytics",
      description: "Analytics APIs",
    },
    {
      name: "Admin",
      description: "Admin APIs",
    },
  ],

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

  paths: {
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",
        description: "Authenticate user and return access token",

        requestBody: {
          required: true,

          content: {
            "application/json": {
              schema: {
                type: "object",

                properties: {
                  email: {
                    type: "string",
                    example: "user@gmail.com",
                  },

                  password: {
                    type: "string",
                    example: "password123",
                  },
                },
              },
            },
          },
        },

        responses: {
          200: {
            description: "Login successful",
          },

          401: {
            description: "Invalid credentials",
          },
        },
      },
    },

    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register user",

        requestBody: {
          required: true,

          content: {
            "application/json": {
              schema: {
                type: "object",

                properties: {
                  name: {
                    type: "string",
                    example: "Kushal",
                  },

                  email: {
                    type: "string",
                    example: "kushal@gmail.com",
                  },

                  password: {
                    type: "string",
                    example: "password123",
                  },

                  role: {
                    type: "string",
                    example: "USER",
                  },
                },
              },
            },
          },
        },

        responses: {
          201: {
            description: "User registered successfully",
          },
        },
      },
    },

    "/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get current user",

        security: [
          {
            bearerAuth: [],
          },
        ],

        responses: {
          200: {
            description: "Current user returned",
          },
        },
      },
    },

    "/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout user",

        security: [
          {
            bearerAuth: [],
          },
        ],

        responses: {
          200: {
            description: "Logged out successfully",
          },
        },
      },
    },

    "/auth/refresh": {
      post: {
        tags: ["Auth"],
        summary: "Refresh access token",

        responses: {
          200: {
            description: "New access token generated",
          },
        },
      },
    },

    "/companies": {
      post: {
        tags: ["Company"],
        summary: "Create company",
        security: [{ bearerAuth: [] }],

        responses: {
          201: {
            description: "Company created successfully",
          },
        },
      },
    },

    "/companies/my": {
      get: {
        tags: ["Company"],
        summary: "Get recruiter companies",
        security: [{ bearerAuth: [] }],

        responses: {
          200: {
            description: "Companies fetched successfully",
          },
        },
      },
    },

    "/companies/{id}": {
      get: {
        tags: ["Company"],
        summary: "Get company by id",

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,

            schema: {
              type: "integer",
            },
          },
        ],

        responses: {
          200: {
            description: "Company fetched successfully",
          },
        },
      },

      put: {
        tags: ["Company"],
        summary: "Update company",
        security: [{ bearerAuth: [] }],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,

            schema: {
              type: "integer",
            },
          },
        ],

        responses: {
          200: {
            description: "Company updated successfully",
          },
        },
      },

      delete: {
        tags: ["Company"],
        summary: "Delete company",
        security: [{ bearerAuth: [] }],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,

            schema: {
              type: "integer",
            },
          },
        ],

        responses: {
          200: {
            description: "Company deleted successfully",
          },
        },
      },
    },

    "/jobs": {
      post: {
        tags: ["Jobs"],
        summary: "Create job",
        security: [{ bearerAuth: [] }],

        responses: {
          201: {
            description: "Job created successfully",
          },
        },
      },

      get: {
        tags: ["Jobs"],
        summary: "Get all jobs",

        responses: {
          200: {
            description: "Jobs fetched successfully",
          },
        },
      },
    },

    "/jobs/{id}": {
      get: {
        tags: ["Jobs"],
        summary: "Get job by id",

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],

        responses: {
          200: {
            description: "Job fetched successfully",
          },
        },
      },

      put: {
        tags: ["Jobs"],
        summary: "Update job",
        security: [{ bearerAuth: [] }],

        responses: {
          200: {
            description: "Job updated successfully",
          },
        },
      },

      delete: {
        tags: ["Jobs"],
        summary: "Delete job",
        security: [{ bearerAuth: [] }],

        responses: {
          200: {
            description: "Job deleted successfully",
          },
        },
      },
    },

    "/applications": {
      post: {
        tags: ["Applications"],
        summary: "Apply to a job",
        security: [{ bearerAuth: [] }],

        responses: {
          201: {
            description: "Application submitted successfully",
          },
        },
      },
    },

    "/applications/me": {
      get: {
        tags: ["Applications"],
        summary: "Get my applications",
        security: [{ bearerAuth: [] }],

        responses: {
          200: {
            description: "Applications fetched successfully",
          },
        },
      },
    },

    "/applications/job/{jobId}": {
      get: {
        tags: ["Applications"],
        summary: "Get applicants for a job",
        security: [{ bearerAuth: [] }],

        parameters: [
          {
            name: "jobId",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],

        responses: {
          200: {
            description: "Applicants fetched successfully",
          },
        },
      },
    },

    "/applications/{id}/status": {
      patch: {
        tags: ["Applications"],
        summary: "Update application status",
        security: [{ bearerAuth: [] }],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],

        responses: {
          200: {
            description: "Application status updated",
          },
        },
      },
    },

    "/applications/{id}": {
      delete: {
        tags: ["Applications"],
        summary: "Withdraw application",
        security: [{ bearerAuth: [] }],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],

        responses: {
          200: {
            description: "Application withdrawn successfully",
          },
        },
      },
    },

    "/saved-jobs": {
      get: {
        tags: ["Saved Jobs"],
        summary: "Get saved jobs",
        security: [{ bearerAuth: [] }],

        responses: {
          200: {
            description: "Saved jobs fetched successfully",
          },
        },
      },
    },

    "/saved-jobs/{jobId}": {
      post: {
        tags: ["Saved Jobs"],
        summary: "Save a job",
        security: [{ bearerAuth: [] }],

        parameters: [
          {
            name: "jobId",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],

        responses: {
          201: {
            description: "Job saved successfully",
          },
        },
      },

      delete: {
        tags: ["Saved Jobs"],
        summary: "Unsave a job",
        security: [{ bearerAuth: [] }],

        parameters: [
          {
            name: "jobId",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],

        responses: {
          200: {
            description: "Job removed from saved jobs",
          },
        },
      },
    },

    "/resumes/upload": {
      post: {
        tags: ["Resume"],
        summary: "Upload resume",
        security: [{ bearerAuth: [] }],

        requestBody: {
          required: true,

          content: {
            "multipart/form-data": {
              schema: {
                type: "object",

                properties: {
                  resume: {
                    type: "string",
                    format: "binary",
                  },
                },
              },
            },
          },
        },

        responses: {
          201: {
            description: "Resume uploaded successfully",
          },
        },
      },
    },

    "/resumes/me": {
      get: {
        tags: ["Resume"],
        summary: "Get my resumes",
        security: [{ bearerAuth: [] }],

        responses: {
          200: {
            description: "Resumes fetched successfully",
          },
        },
      },
    },

    "/resumes/{id}": {
      get: {
        tags: ["Resume"],
        summary: "Get resume by id",
        security: [{ bearerAuth: [] }],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,

            schema: {
              type: "integer",
            },
          },
        ],

        responses: {
          200: {
            description: "Resume fetched successfully",
          },
        },
      },

      delete: {
        tags: ["Resume"],
        summary: "Delete resume",
        security: [{ bearerAuth: [] }],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,

            schema: {
              type: "integer",
            },
          },
        ],

        responses: {
          200: {
            description: "Resume deleted successfully",
          },
        },
      },
    },

    "/matching/{jobId}/matches": {
      get: {
        tags: ["Matching"],
        summary: "Get job matches",
        security: [{ bearerAuth: [] }],

        parameters: [
          {
            name: "jobId",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],

        responses: {
          200: {
            description: "Job matches fetched successfully",
          },
        },
      },
    },

    "/matching/{jobId}/top-candidates": {
      get: {
        tags: ["Matching"],
        summary: "Get top candidates",
        security: [{ bearerAuth: [] }],

        parameters: [
          {
            name: "jobId",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],

        responses: {
          200: {
            description: "Top candidates fetched successfully",
          },
        },
      },
    },

    "/matching/resume/{resumeId}/matches": {
      get: {
        tags: ["Matching"],
        summary: "Get resume matches",
        security: [{ bearerAuth: [] }],

        parameters: [
          {
            name: "resumeId",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],

        responses: {
          200: {
            description: "Resume matches fetched successfully",
          },
        },
      },
    },

    "/matching/{matchId}/status": {
      patch: {
        tags: ["Matching"],
        summary: "Update match status",
        security: [{ bearerAuth: [] }],

        parameters: [
          {
            name: "matchId",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],

        responses: {
          200: {
            description: "Match status updated successfully",
          },
        },
      },
    },

    "/matching/{jobId}/candidates": {
      get: {
        tags: ["Matching"],
        summary: "Get candidates by status",
        security: [{ bearerAuth: [] }],

        parameters: [
          {
            name: "jobId",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],

        responses: {
          200: {
            description: "Candidates fetched successfully",
          },
        },
      },
    },

    "/matching/{jobId}/pipeline": {
      get: {
        tags: ["Matching"],
        summary: "Get candidate pipeline",
        security: [{ bearerAuth: [] }],

        parameters: [
          {
            name: "jobId",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],

        responses: {
          200: {
            description: "Pipeline fetched successfully",
          },
        },
      },
    },

    "/matching/candidate/{resumeId}": {
      get: {
        tags: ["Matching"],
        summary: "Get candidate profile",
        security: [{ bearerAuth: [] }],

        parameters: [
          {
            name: "resumeId",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],

        responses: {
          200: {
            description: "Candidate profile fetched successfully",
          },
        },
      },
    },

    "/notifications": {
      get: {
        tags: ["Notifications"],
        summary: "Get user notifications",
        security: [{ bearerAuth: [] }],

        responses: {
          200: {
            description: "Notifications fetched successfully",
          },
        },
      },
    },

    "/notifications/{id}/read": {
      patch: {
        tags: ["Notifications"],
        summary: "Mark notification as read",
        security: [{ bearerAuth: [] }],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,

            schema: {
              type: "integer",
            },
          },
        ],

        responses: {
          200: {
            description: "Notification marked as read",
          },
        },
      },
    },

    "/dashboard/stats": {
      get: {
        tags: ["Dashboard"],
        summary: "Get platform dashboard statistics",

        responses: {
          200: {
            description: "Dashboard statistics fetched successfully",
          },
        },
      },
    },

    "/dashboard/recruiter": {
      get: {
        tags: ["Dashboard"],
        summary: "Get recruiter dashboard statistics",

        security: [{ bearerAuth: [] }],

        responses: {
          200: {
            description: "Recruiter dashboard statistics fetched successfully",
          },
        },
      },
    },

    "/analytics": {
      get: {
        tags: ["Analytics"],
        summary: "Get platform analytics",

        responses: {
          200: {
            description: "Analytics fetched successfully",
          },
        },
      },
    },

    "/admin/users": {
      get: {
        tags: ["Admin"],
        summary: "Get all users",

        security: [{ bearerAuth: [] }],

        responses: {
          200: {
            description: "Users fetched successfully",
          },
        },
      },
    },

    "/admin/users/{id}/block": {
      patch: {
        tags: ["Admin"],
        summary: "Block user",

        security: [{ bearerAuth: [] }],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,

            schema: {
              type: "integer",
            },
          },
        ],

        responses: {
          200: {
            description: "User blocked successfully",
          },
        },
      },
    },

    "/admin/users/{id}/unblock": {
      patch: {
        tags: ["Admin"],
        summary: "Unblock user",

        security: [{ bearerAuth: [] }],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,

            schema: {
              type: "integer",
            },
          },
        ],

        responses: {
          200: {
            description: "User unblocked successfully",
          },
        },
      },
    },

    "/admin/dashboard": {
      get: {
        tags: ["Admin"],
        summary: "Get admin dashboard",

        security: [{ bearerAuth: [] }],

        responses: {
          200: {
            description: "Admin dashboard fetched successfully",
          },
        },
      },
    },
  },
};

export { swaggerUi };
