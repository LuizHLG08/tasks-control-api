import { expect } from "vitest";

export interface ITask {
  id: number;
  title: string;
  content: string;
  finished: boolean;
  userId: number;
  categoryId?: number;
}

export const taskDefaultExpects = (task: ITask, userId: number) => {
  expect(task).toBeDefined();
  expect(task).toBeTypeOf("object");
  expect(task).toEqual;

  expect(task.id).toBeDefined();
  expect(task.id).toBeTypeOf("number");

  expect(task.title).toBeDefined();
  expect(task.title).toBeTypeOf("string");

  expect(task.content).toBeDefined();
  expect(task.content).toBeTypeOf("string");

  expect(task.finished).toBeDefined();
  expect(task.finished).toBeTypeOf("boolean");
};
