import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navigation from "./Navigation";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Navigation component", () => {
  beforeEach(() => {
    // using MemoryRouter instead of BrowserRouter
    render(<Navigation />, { wrapper: MemoryRouter });
  });

  test("render nav menu", () => {
    expect(screen.getByText(/booking/i)).toBeInTheDocument();
    expect(screen.getByText(/Confirmation/i)).toBeInTheDocument();
  });

  test("toggles menu visibility with click", () => {
    const navIcon = screen.getByRole("img");
    fireEvent.click(navIcon);

    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass("show-menu");
  });

  test("navigates to booking page when clicked", () => {
    const bookingLink = screen.getByText(/booking/i);
    fireEvent.click(bookingLink);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("navigates to confirmation page when clicked", () => {
    const confirmationLink = screen.getByText(/confirmation/i);
    fireEvent.click(confirmationLink);
    expect(mockNavigate).toHaveBeenCalledWith("/confirmation");
  });
});
