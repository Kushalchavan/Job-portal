import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../../src/app";

describe("Register Validation", () => {
  it("should reject invalid payload", async () => {
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Ku",
        email: "invalid-email",
        password: "123",
        role: "INVALID_ROLE",
      });

    expect(response.status).toBe(400);
  });
});