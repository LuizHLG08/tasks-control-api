export const category = (userId: number) => {
  return {
    name: "Example",
    userId,
  };
};

export const invalidDataCategory = {
  name: 123,
};
