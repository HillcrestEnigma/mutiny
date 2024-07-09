import { lucia } from "./plugins/setup.ts";
import { crud } from "./crud/index.ts";
import * as argon2 from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { type ErrorResponse, type AuthResponse } from "./schemas/index.ts";

export const auth = {
  signup: async (
    username: string,
    email: string,
    password: string,
  ): Promise<AuthResponse> => {
    const user = await crud.user.find({ username, email });

    if (user) {
      return [
        401,
        {
          message: "User already exists.",
        },
      ];
    }

    const userId = generateIdFromEntropySize(10);
    const passwordHash = await argon2.hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    await crud.user.create({ userId, username, email, passwordHash });

    const session = await lucia.createSession(userId, {});

    return [
      201,
      {
        session: session.id,
        message: "Successfully created user.",
      },
    ];
  },
  signin: async (
    usernameOrEmail: string,
    password: string,
  ): Promise<AuthResponse> => {
    const userNotFoundResponse: ErrorResponse = [
      401,
      {
        message: "Incorrect credentials.",
        error: "forbidden",
      },
    ];

    const user = await crud.user.find({
      username: usernameOrEmail,
      email: usernameOrEmail,
    });

    if (!user) {
      return userNotFoundResponse;
    }

    const validPassword = await argon2.verify(user.passwordHash, password);

    if (!validPassword) {
      return userNotFoundResponse;
    }

    const session = await lucia.createSession(user.id, {});

    return [
      201,
      {
        message: "Successfully created session.",
        session: session.id,
      },
    ];
  },
  signout: async (sessionId: string): Promise<AuthResponse> => {
    await lucia.invalidateSession(sessionId);

    return [
      200,
      {
        message: "Successfully invalidated session.",
      },
    ];
  },
  validate: async (sessionId: string): Promise<AuthResponse> => {
    const { session } = await lucia.validateSession(sessionId);

    if (!session) {
      return [
        401,
        {
          message: "Session not found.",
        },
      ];
    }

    return [
      200,
      {
        message: "Successfully validated session.",
        session: session.id,
      },
    ];
  },
};
