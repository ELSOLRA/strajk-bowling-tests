import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll } from "vitest";
import "@testing-library/jest-dom/vitest";
import { server } from "./src/mocks/server";

// makes MSW throw an error when it encounters any network request that isn't explicitly mocked
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

afterEach(() => {
  cleanup(); // Clean up DOM
  server.resetHandlers(); // Reset MSW handlers
});

afterAll(() => server.close());
