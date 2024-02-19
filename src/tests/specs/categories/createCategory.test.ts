import { describe, expect, it } from "vitest";
import { category, invalidDataCategory } from "../../mocks/category.mocks";
import { request } from "../../setupFiles";
import {
  generateAuthentication,
  generateInvalidToken,
} from "../../utils/generateAuthentication";

describe("create category", async () => {
  it("should be able to create category successfully", async () => {
    const { user, token } = await generateAuthentication();

    const data = await request
      .post("/categories")
      .set("Authorization", `Bearer ${token}`)
      .send(category(user.id))
      .expect(201)
      .then((response) => response.body);

    expect(data).toBeDefined();
    expect(data).toBeTypeOf("object");

    expect(data.id).toBeDefined();
    expect(data.id).toBeTypeOf("number");

    expect(data.name).toBeDefined();
    expect(data.name).toBeTypeOf("string");

    expect(data.userId).toBeDefined();
    expect(data.userId).toBeTypeOf("number");
  });

  it("should throw error when try to create a task with a missing body parameter", async () => {
    const { token } = await generateAuthentication();

    await request
      .post("/categories")
      .set("Authorization", `Bearer ${token}`)
      .expect(400);
  });

  it("should throw error when try to create a task with invalid data types", async () => {
    const { token } = await generateAuthentication();

    await request
      .post("/categories")
      .set("Authorization", `Bearer ${token}`)
      .send(invalidDataCategory)
      .expect(400);
  });

  it("should throw error when there is no token", async () => {
    await request.post("/categories").expect(401);
  });

  it("should throw error when the token is invalid", async () => {
    const token = generateInvalidToken();

    await request
      .post("/categories")
      .set("Authorization", `Bearer ${token}`)
      .expect(401);
  });
});
