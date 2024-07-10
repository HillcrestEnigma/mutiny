import { FormatRegistry } from "@fastify/type-provider-typebox";

const emailRegex =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

const usernameRegex = /^[a-z][-a-z0-9_]*$/i;

FormatRegistry.Set("email", (value) => {
  return emailRegex.test(value);
});

FormatRegistry.Set("username", (value) => {
  return 3 <= value.length && value.length <= 32 && usernameRegex.test(value);
});
