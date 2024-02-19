import { describe, expect, it } from "vitest";
import { prisma } from "../../../database/prisma";
import { category } from "../../mocks/category.mocks";
import { getTaskList, task } from "../../mocks/tasks.mocks";
import { secondUserMock } from "../../mocks/user.mocks";
import { request } from "../../setupFiles";
import { categoryDefaultExpects } from "../../utils/categoryDefaultExpects";
import {
   generateAuthentication,
   generateInvalidToken,
} from "../../utils/generateAuthentication";
import { taskDefaultExpects } from "../../utils/taskDefaultExpects";

const getTasksBeforeEach = async () => {
  const { user: user1, token: token1 } = await generateAuthentication();

  await prisma.category.create({ data: category(user1.id) });

  const taskList = await getTaskList(user1.id);

  await prisma.task.createMany({ data: taskList });

  const { user: user2, token: token2 } = await generateAuthentication(
    secondUserMock
  );

  await prisma.task.create({ data: { ...task, userId: user2.id } });

  return { user: user1, token: token1, secondUser: user2, secondToken: user2 };
};

describe("get tasks", () => {
  it("should be able to get tasks successfully", async () => {
    const { user, token } = await getTasksBeforeEach();

    const data = await request
      .get("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then((response) => response.body);

    expect(data).toHaveLength(2);

    taskDefaultExpects(data[0], user.id);

    expect(data[0].category).toBeNull();

    taskDefaultExpects(data[1], user.id);

    categoryDefaultExpects(data[1].category);
  });

  it("should be able to get tasks from specific category", async () => {
    const { user, token } = await getTasksBeforeEach();

    const getCategory = await prisma.category.findFirst();

    const data = await request
      .get(`/tasks?category=${getCategory?.name}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then((response) => response.body);

    expect(data).toHaveLength(1);

    taskDefaultExpects(data[0], user.id);

    categoryDefaultExpects(data[0].category);
  });

  it("should throw error when try to get tasks from a category of a different user", async () => {
    const { secondToken } = await getTasksBeforeEach();

    const getCategory = await prisma.category.findFirst();

    await request
      .get(`/tasks?category=${getCategory?.id}`)
      .set("Authorization", `Bearer ${secondToken}`)
      .expect(401)
      .then((response) => response.body);
  });

  it("should throw error when there is no token", async () => {
    await request.get("/tasks").expect(401);
  });

  it("should throw error when the token is invalid", async () => {
    const token = generateInvalidToken();

    await request
      .get("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .expect(401);
  });

  it("should be able to get a single task by the id correctly", async () => {
    const { user, token } = await getTasksBeforeEach();

    const tasks = await prisma.task.findMany();

    const data = await request
      .get(`/tasks/${tasks[1].id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then((response) => response.body);

    taskDefaultExpects(data, user.id);

    categoryDefaultExpects(data.category);
  });

  it("should be throw error when try get a task with a invalid id", async () => {
    const { token } = await getTasksBeforeEach();

    const tasks = await prisma.task.findMany();

    const id = tasks[2].id + 1;

    await request
      .get(`/tasks/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(404);
  });

  it("should not be able to get a task from a different user", async () => {
    const { secondToken } = await getTasksBeforeEach();

    const tasks = await prisma.task.findMany();

    await request
      .get(`/tasks/${tasks[0].id}`)
      .set("Authorization", `Bearer ${secondToken}`)
      .expect(401);
  });

  it("should throw error when there is no token", async () => {
    await request.get("/tasks/1").expect(401);
  });

  it("should throw error when the token is invalid", async () => {
    const token = generateInvalidToken();

    await request
      .get("/tasks/1")
      .set("Authorization", `Bearer ${token}`)
      .expect(401);
  });
});
