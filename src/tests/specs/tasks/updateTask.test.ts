import { describe, expect, it } from "vitest";
import { prisma } from "../../../database/prisma";
import { category } from "../../mocks/category.mocks";
import {
   getTaskList,
   invalidDataUpdateTask,
   updateTask,
} from "../../mocks/tasks.mocks";
import { secondUserMock } from "../../mocks/user.mocks";
import { request } from "../../setupFiles";
import {
   generateAuthentication,
   generateInvalidToken,
} from "../../utils/generateAuthentication";
import { taskDefaultExpects } from "../../utils/taskDefaultExpects";

const updateTaskBeforeEach = async () => {
  const { user: user1, token: token1 } = await generateAuthentication();

  await prisma.category.create({ data: category(user1.id) });
  const taskList = await getTaskList(user1.id);
  await prisma.task.createMany({ data: taskList });

  const { token: token2 } = await generateAuthentication(secondUserMock);

  return { user: user1, token: token1, secondToken: token2 };
};

describe("update task", () => {
  it("should be able to update task successfully ", async () => {
    const { user, token } = await updateTaskBeforeEach();

    const task = await prisma.task.findFirst();

    const data = await request
      .patch(`/tasks/${task?.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updateTask)
      .expect(200)
      .then((response) => response.body);

    taskDefaultExpects(data, user.id);

    expect(data.title).toBe(updateTask.title);
    expect(data.content).toBe(updateTask.content);
    expect(data.finished).toBe(updateTask.finished);
  });

  it("should throw error when try to update a invalid task", async () => {
    const { token } = await updateTaskBeforeEach();

    const tasks = await prisma.task.findMany();

    const id = tasks[1].id + 1;

    await request
      .patch(`/tasks/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(404)
      .then((response) => response.body);
  });

  it("should throw error when try to update a task with invalid data types", async () => {
    const { token } = await updateTaskBeforeEach();

    const task = await prisma.task.findFirst();

    await request
      .patch(`/tasks/${task?.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(invalidDataUpdateTask)
      .expect(400);
  });

  it("should throw error when try update a task from a different user", async () => {
    const { secondToken } = await updateTaskBeforeEach();

    const task = await prisma.task.findFirst();

    await request
      .patch(`/tasks/${task?.id}`)
      .set("Authorization", `Bearer ${secondToken}`)
      .send(updateTask)
      .expect(403);
  });

  it("should throw error when there is no token", async () => {
    await request.patch("/tasks/1").expect(401);
  });

  it("should throw error when the token is invalid", async () => {
    const token = generateInvalidToken();

    await request
      .patch("/tasks/1")
      .set("Authorization", `Bearer ${token}`)
      .expect(401);
  });
});
