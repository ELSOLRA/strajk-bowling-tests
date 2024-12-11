import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    RouterProvider: () => <div data-testid="mock-router">Router Mock</div>,
  };
});

describe("App Component", () => {
  test("renders with RouterProvider", () => {
    render(<App />);
    expect(screen.getByTestId("mock-router")).toBeInTheDocument();
  });
});
