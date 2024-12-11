import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import App from "./App";
import Booking from "./views/Booking";
import Confirmation from "./views/Confirmation";

// mocking the router configuration directly
vi.mock("./router", () => ({
  // router default export
  default: createMemoryRouter([
    {
      path: "/",
      element: <div>Router Mock</div>,
    },
  ]),
}));

vi.mock("./views/Booking", () => ({
  // Booking module with default export
  default: () => <div>Booking Page</div>,
}));

vi.mock("./views/Confirmation", () => ({
  // Confirmation module with default export
  default: () => <div>Confirmation Page</div>,
}));

/*  vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    RouterProvider: () => <div>Router Mock</div>,

  };
});  */

describe("App component", () => {
  describe("Structure Tests", () => {
    test("renders with correct structure", () => {
      render(<App />);
      expect(screen.getByText(/Router Mock/i)).toBeInTheDocument();
      expect(document.querySelector(".App")).toBeInTheDocument();
    });
  });

  describe("Routing tests", () => {
    beforeEach(() => {
      vi.resetModules();
      vi.unmock("react-router-dom");
    });

    const renderWithRouter = (initialEntry = "/") => {
      const routes = [
        {
          path: "/",
          element: <Booking />,
        },
        {
          path: "/confirmation",
          element: <Confirmation />,
        },
      ];

      const router = createMemoryRouter(routes, {
        initialEntries: [initialEntry],
      });

      return render(<RouterProvider router={router} />);
    };

    test("renders booking view on root path", () => {
      renderWithRouter("/");
      screen.debug();
      expect(screen.getByText("Booking Page")).toBeInTheDocument();
    });

    test("renders confirmation view on confirmation path", () => {
      renderWithRouter("/confirmation");
      expect(screen.getByText("Confirmation Page")).toBeInTheDocument();
    });
  });
});
