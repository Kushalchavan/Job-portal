import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../../src/app";

describe("Upload Resume", () => {
  it("should reject unauthenticated user", async () => {
    const response = await request(app)
      .post("/api/v1/resumes/upload");

    expect(response.status).toBe(401);
  });
});