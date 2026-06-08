import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../../src/app";

describe("Login Validation", () => {
  it("should reject invalid login payload", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "invalid-email",
        password: "123",
      });

    expect(response.status).toBe(400);
  });
});