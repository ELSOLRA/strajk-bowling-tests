import { BrowserRouter } from "react-router-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import Booking from "./Booking";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Booking View", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.sessionStorage = {
      setItem: vi.fn(),
    };
  });

  test("Submits booking with correct data and saves to storage", async () => {
    render(<Booking />, { wrapper: BrowserRouter });

    fireEvent.change(screen.getByLabelText(/date/i), {
      target: { value: "2024-12-19" },
    });
    fireEvent.change(screen.getByLabelText(/time/i), {
      target: { value: "16:00" },
    });
    fireEvent.change(screen.getByLabelText(/number of awesome bowlers/i), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByLabelText(/number of lanes/i), {
      target: { value: "1" },
    });

    // Shoes
    fireEvent.click(screen.getByText("+"));
    fireEvent.click(screen.getByText("+"));
    const shoeInputs = screen.getAllByLabelText(/shoe size/i);

    fireEvent.change(shoeInputs[0], { target: { value: "44" } });
    fireEvent.change(shoeInputs[1], { target: { value: "44" } });

    fireEvent.click(screen.getByText(/strIIIIIike!/i));

    const expectedBookingData = {
      when: "2024-12-19T16:00",
      lanes: "1",
      people: "2",
      shoes: ["44", "44"],
      price: 340,
      id: "1",
      active: true,
    };

    await waitFor(() => {
      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        "confirmation",
        JSON.stringify(expectedBookingData)
      );

      expect(mockNavigate).toBeCalledWith("/confirmation", {
        state: {
          confirmationDetails: expectedBookingData,
        },
      });
    });
  });
});
