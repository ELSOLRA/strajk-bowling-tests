import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import App from "./App";
import router from "./router";

// Mock view components
vi.mock("./views/Booking", () => ({
  // Booking module with default export
  default: () => <div>Booking Page</div>,
}));

vi.mock("./views/Confirmation", () => ({
  // Confirmation module with default export
  default: () => <div>Confirmation Page</div>,
}));

describe("App component", () => {
  // checking if router configuration matches expected routes
  describe("Router configuration", () => {
    test("has correct routes", () => {
      expect(router.routes).toHaveLength(2);
      expect(router.routes[0].path).toBe("/");
      expect(router.routes[1].path).toBe("/confirmation");
    });
  });

  describe("Structure test", () => {
    test("renders with correct structure", () => {
      render(<App />);
      screen.debug();
      expect(document.querySelector(".App")).toBeInTheDocument();
    });
  });

  describe("Routing tests", () => {
    // helper function to render app with specific route
    const renderWithRouter = (initialEntry = "/") => {
      const testRouter = createMemoryRouter(router.routes, {
        initialEntries: [initialEntry],
      });

      return render(<RouterProvider router={testRouter} />);
    };

    test("renders booking view on root path", () => {
      renderWithRouter("/");
      expect(screen.getByText("Booking Page")).toBeInTheDocument();
    });

    test("renders confirmation view on confirmation path", () => {
      renderWithRouter("/confirmation");
      expect(screen.getByText("Confirmation Page")).toBeInTheDocument();
    });
  });
});
