import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../../src/app";

describe("Update Match Status", () => {
  it("should reject missing status", async () => {
    const response = await request(app)
      .patch("/api/v1/matching/test-id/status")
      .send({});

    expect(response.status).toBe(401);
  });
});