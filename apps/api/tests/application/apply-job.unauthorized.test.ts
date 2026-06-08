import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../../src/app";

describe("Apply To Job", () => {
  it("should reject unauthenticated user", async () => {
    const response = await request(app)
      .post("/api/v1/applications")
      .send({});

    expect(response.status).toBe(401);
  });
});