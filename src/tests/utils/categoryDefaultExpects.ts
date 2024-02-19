import { expect } from "vitest";

export interface ICategory {
  name: string;
}

export const categoryDefaultExpects = async (category: ICategory) => {
  expect(category).toBeDefined();
  expect(category).toBeTypeOf("object");
  expect(category.name).toBeDefined();
  expect(category.name).toBeTypeOf("string");
};
