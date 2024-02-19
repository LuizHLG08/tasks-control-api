import { describe, it } from "vitest";
import { prisma } from "../../../database/prisma";
import { category } from "../../mocks/category.mocks";
import { secondUserMock } from "../../mocks/user.mocks";
import { request } from "../../setupFiles";
import {
   generateAuthentication,
   generateInvalidToken,
} from "../../utils/generateAuthentication";

const deleteCategoryBeforeEach = async () => {
  const { user: user1, token: token1 } = await generateAuthentication();

  const deleteCategory = await prisma.category.create({
    data: category(user1.id),
  });

  const { token: token2 } = await generateAuthentication(secondUserMock);

  return { token: token1, secondToken: token2, deleteCategory };
};

describe("delete category", () => {
  it("should be able to delete category successfully", async () => {
    const { token, deleteCategory } = await deleteCategoryBeforeEach();

    await request
      .delete(`/categories/${deleteCategory?.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);
  });

  it("should throw error when try to delete a invalid category", async () => {
    const { token, deleteCategory } = await deleteCategoryBeforeEach();

    const id = (deleteCategory?.id as number) + 1;

    await request
      .delete(`/categories/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(404);
  });

  it("should throw error when try to delete a category from a different user", async () => {
    const { secondToken, deleteCategory } = await deleteCategoryBeforeEach();

    await request
      .delete(`/categories/${deleteCategory?.id}`)
      .set("Authorization", `Bearer ${secondToken}`)
      .expect(403);
  });

  it("should throw error when there is no token", async () => {
    await request.delete("/categories/1").expect(401);
  });

  it("should throw error when the token is invalid", async () => {
    const token = generateInvalidToken();

    await request
      .delete("/categories/1")
      .set("Authorization", `Bearer ${token}`)
      .expect(401);
  });
});
