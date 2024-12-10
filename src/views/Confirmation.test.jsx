import { BrowserRouter, useLocation } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import Confirmation from "./Confirmation";
import { render, screen } from "@testing-library/react";

const mockConfirmation = {
  when: "2024-12-19T16:00",
  lanes: "1",
  people: "2",
  shoes: ["44", "44"],
  price: 340,
  id: "1",
  //   active: true,
};

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useLocation: vi.fn(),
  };
});
describe("Confirmation Component - user able to view booking confirmation ", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.sessionStorage = {
      getItem: vi.fn(),
    };
  });

  test("displays booking details from location state", () => {
    vi.mocked(useLocation).mockReturnValue({
      state: { confirmationDetails: mockConfirmation },
    });

    render(<Confirmation />, { wrapper: BrowserRouter });

    expect(screen.getByLabelText(/when/i)).toHaveValue(
      mockConfirmation.when.replace("T", " ")
    );
    expect(screen.getByLabelText(/who/i)).toHaveValue(mockConfirmation.people);
    expect(screen.getByLabelText(/lanes/i)).toHaveValue(mockConfirmation.lanes);
    expect(screen.getByLabelText(/booking number/i)).toHaveValue(
      mockConfirmation.id
    );
    expect(
      screen.getByText(`${mockConfirmation.price} sek`)
    ).toBeInTheDocument();
  });

  test(" if no location state displays booking details from sessionStorage", () => {
    vi.mocked(useLocation).mockReturnValue({ state: null });
    global.sessionStorage.getItem.mockReturnValue(
      JSON.stringify(mockConfirmation)
    );
    render(<Confirmation />, { wrapper: BrowserRouter });

    expect(screen.getByLabelText(/when/i)).toHaveValue(
      mockConfirmation.when.replace("T", " ")
    );
    expect(screen.getByLabelText(/who/i)).toHaveValue(mockConfirmation.people);
    expect(screen.getByLabelText(/lanes/i)).toHaveValue(mockConfirmation.lanes);
    expect(screen.getByLabelText(/booking number/i)).toHaveValue(
      mockConfirmation.id
    );
    expect(
      screen.getByText(`${mockConfirmation.price} sek`)
    ).toBeInTheDocument();
  });

  test("displays message:'Inga bokning gjord!' when no data available", () => {
    vi.mocked(useLocation).mockReturnValue({ state: null });
    global.sessionStorage.getItem.mockReturnValue(null);

    render(<Confirmation />, { wrapper: BrowserRouter });

    expect(screen.getByText(/Inga bokning gjord!/i)).toBeInTheDocument();
  });
});
