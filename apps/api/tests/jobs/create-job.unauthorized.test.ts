import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../../src/app";

describe("Create Job", () => {
  it("should reject request without token", async () => {
    const response = await request(app)
      .post("/api/v1/jobs")
      .send({
        title: "Backend Engineer",
      });

    expect(response.status).toBe(401);
  });
});