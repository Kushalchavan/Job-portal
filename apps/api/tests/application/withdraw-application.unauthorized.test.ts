import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../../src/app";

describe("Withdraw Application", () => {
  it("should reject unauthenticated user", async () => {
    const response = await request(app)
      .delete("/api/v1/applications/1");

    expect(response.status).toBe(401);
  });
});