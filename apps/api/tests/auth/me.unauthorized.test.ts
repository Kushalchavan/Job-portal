import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../../src/app";

describe("Get Current User", () => {
  it("should reject request without token", async () => {
    const response = await request(app)
      .get("/api/v1/auth/me");

    expect(response.status).toBe(401);
  });
});