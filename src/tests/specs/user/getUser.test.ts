import { describe, it } from "vitest";
import { request } from "../../setupFiles";
import {
   generateAuthentication,
   generateInvalidToken,
} from "../../utils/generateAuthentication";
import { userDefaultExpects } from "../../utils/userDefaultExpects";

describe("get user", () => {
  it("should be able to get user sucessfully", async () => {
    const { token } = await generateAuthentication();

    const data = await request
      .get("/users/profile")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then((response) => response.body);

    userDefaultExpects(data);
  });

  it("should throw error when there is no token", async () => {
    await request.get("/users/profile").expect(401);
  });

  it("should throw error when the token is invalid", async () => {
    const token = generateInvalidToken();

    await request
      .get("/users/profile")
      .set("Authorization", `Bearer ${token}`)
      .expect(401);
  });
});
