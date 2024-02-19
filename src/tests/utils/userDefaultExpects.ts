import { expect } from "vitest";

export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
}

export const userDefaultExpects = (user: Omit<IUser, "password">) => {
  expect(user).toBeDefined();
  expect(user).toBeTypeOf("object");

  expect(user.id).toBeDefined();
  expect(user.id).toBeTypeOf("number");

  expect(user.name).toBeDefined();
  expect(user.name).toBeTypeOf("string");

  expect(user.email).toBeDefined();
  expect(user.email).toBeTypeOf("string");
};
