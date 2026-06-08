import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../../src/app";

describe("Delete Resume", () => {
  it("should reject unauthenticated user", async () => {
    const response = await request(app)
      .delete("/api/v1/resumes/test-id");

    expect(response.status).toBe(401);
  });
});