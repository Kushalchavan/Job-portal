import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../../src/app";

describe("Get My Applications", () => {
  it("should reject unauthenticated user", async () => {
    const response = await request(app)
      .get("/api/v1/applications/me");

    expect(response.status).toBe(401);
  });
});