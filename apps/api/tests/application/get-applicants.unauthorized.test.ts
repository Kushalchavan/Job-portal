import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../../src/app";

describe("Get Applicants", () => {
  it("should reject unauthenticated recruiter", async () => {
    const response = await request(app)
      .get("/api/v1/applications/job/1");

    expect(response.status).toBe(401);
  });
});