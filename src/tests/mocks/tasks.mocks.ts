import { prisma } from "../../database/prisma";

export const task = {
  title: "Lorem ipsum",
  content: "Lorem ipsum",
};

export const invalidDataTask = {
  title: 123,
  content: 123,
};

export const updateTask = {
  title: "Updated title",
  content: "Updated content",
  finished: true,
};

export const invalidDataUpdateTask = {
  title: 123,
  content: 123,
  finished: "testing",
};

export const taskWithInvalidCategory = {
  title: "Lorem ipsum",
  content: "Lorem ipsum",
  categoryId: 1,
};

export const getTaskWithCategory = async () => {
  const category = await prisma.category.findFirst();

  return {
    title: "Lorem ipsum",
    content: "Lorem ipsum",
    categoryId: category?.id,
  };
};

export const getTaskList = async (userId: number) => {
  const category = await prisma.category.findFirst();

  return [
    {
      title: "Lorem ipsum",
      content: "Lorem ipsum",
      userId,
    },
    {
      title: "Lorem ipsum",
      content: "Lorem ipsum",
      categoryId: category?.id,
      userId,
    },
  ];
};
