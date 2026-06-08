import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../../src/app";

describe("Resume Matches", () => {
  it("should fail for invalid resume id", async () => {
    const response = await request(app)
      .get("/api/v1/matching/resume/invalid-id/matches");

    expect(response.status).toBeGreaterThanOrEqual(400);
  });
});